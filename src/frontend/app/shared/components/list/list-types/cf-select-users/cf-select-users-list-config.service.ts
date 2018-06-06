import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ListView } from '../../../../../store/actions/list.actions';
import { AppState } from '../../../../../store/app-state';
import { APIResource } from '../../../../../store/types/api.types';
import { CfUser } from '../../../../../store/types/user.types';
import { ITableColumn } from '../../list-table/table.types';
import { IListConfig, ListViewTypes, IMultiListAction } from '../../list.component.types';
import { CfSelectUsersDataSourceService } from './cf-select-users-data-source.service';
import { waitForCFPermissions } from '../../../../../features/cloud-foundry/cf.helpers';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { CfUserService } from '../../../../data-services/cf-user.service';

@Injectable()
export class CfSelectUsersListConfigService implements IListConfig<APIResource<CfUser>> {
  viewType = ListViewTypes.TABLE_ONLY;
  dataSource: CfSelectUsersDataSourceService;
  defaultView = 'table' as ListView;
  enableTextFilter = true;
  text = {
    title: null,
    filter: 'Search by name',
    noEntries: 'There are no users'
  };
  columns: ITableColumn<APIResource<CfUser>>[] = [{
    columnId: 'username',
    headerCell: () => 'Username',
    cellFlex: '10',
    cellAlignSelf: 'baseline',
    cellDefinition: {
      getValue: row => row.entity.username || row.metadata.guid
    },
    sort: {
      type: 'sort',
      orderKey: 'username',
      field: 'entity.username'
    }
  }];
  private initialised: Observable<boolean>;

  constructor(private store: Store<AppState>, private cfGuid: string) {
    this.initialised = waitForCFPermissions(store, cfGuid).pipe(
      tap(cf => {
        const action = CfUserService.createPaginationAction(cfGuid, cf.global.isAdmin);
        this.dataSource = new CfSelectUsersDataSourceService(cfGuid, this.store, action, this);
      }),
      map(cf => cf && cf.state.initialised),
    );
  }

  getColumns = () => this.columns;
  getGlobalActions = () => [];
  getMultiActions = (): IMultiListAction<APIResource<CfUser>>[] => [{
    label: 'delete me',
    description: '',
    action: (items: APIResource<CfUser>[]) => false
  }]
  getSingleActions = () => [];
  getMultiFiltersConfigs = () => [];
  getDataSource = () => this.dataSource;
  getInitialised = () => this.initialised;
}
