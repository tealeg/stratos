import { Action, Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { StratosBaseCatalogueEntity } from '../../../core/src/core/entity-catalogue/entity-catalogue-entity';
import { entityCatalogue } from '../../../core/src/core/entity-catalogue/entity-catalogue.service';
import { IStratosEntityDefinition } from '../../../core/src/core/entity-catalogue/entity-catalogue.types';
import { AppState, InternalAppState } from '../app-state';
import { ApiRequestTypes, getRequestTypeFromMethod } from '../reducers/api-request-reducer/request-helpers';
import { EntityRequestAction } from '../types/request.types';
import { failedEntityHandler } from './entity-request-base-handlers/fail-entity-request.handler';
import { startEntityHandler } from './entity-request-base-handlers/start-entity-request.handler';
import { successEntityHandler } from './entity-request-base-handlers/success-entity-request.handler';
import { EntityRequestPipeline, PreApiRequest, SuccessfulApiRequestDataMapper } from './entity-request-pipeline.types';
import { PipelineHttpClient } from './pipline-http-client.service';

export interface PipelineFactoryConfig<T extends AppState = InternalAppState> {
  store: Store<AppState>;
  httpClient: PipelineHttpClient;
  action: EntityRequestAction;
  appState: T;
}

export interface PipelineConfig<T extends AppState = InternalAppState> {
  requestType: ApiRequestTypes;
  catalogueEntity: StratosBaseCatalogueEntity;
  action: EntityRequestAction;
  appState: T;
  postSuccessDataMapper?: SuccessfulApiRequestDataMapper;
  preRequest?: PreApiRequest;
}


function getSuccessMapper(catalogueEntity: StratosBaseCatalogueEntity) {
  const definition = catalogueEntity.definition as IStratosEntityDefinition;
  return definition.successfulRequestDataMapper || definition.endpoint.globalSuccessfulRequestDataMapper || null;
}

function getPreRequestFunction(catalogueEntity: StratosBaseCatalogueEntity) {
  const definition = catalogueEntity.definition as IStratosEntityDefinition;
  return definition.preRequest || definition.endpoint.globalPreRequest || null;
}

export const apiRequestPipelineFactory = (
  pipeline: EntityRequestPipeline,
  { store, httpClient, action, appState }: PipelineFactoryConfig
) => {
  const actionDispatcher = (actionToDispatch: Action) => store.dispatch(actionToDispatch);
  const requestType = getRequestTypeFromMethod(action);
  const catalogueEntity = entityCatalogue.getEntity(action.endpointType, action.entityType);
  const postSuccessDataMapper = getSuccessMapper(catalogueEntity);
  const preRequest = getPreRequestFunction(catalogueEntity);
  startEntityHandler(actionDispatcher, catalogueEntity, requestType, action);
  return pipeline(store, httpClient, {
    action,
    requestType,
    catalogueEntity,
    appState,
    postSuccessDataMapper,
    preRequest
  }).pipe(
    tap((response) => {
      if (response.success) {
        successEntityHandler(actionDispatcher, catalogueEntity, requestType, action, response.response);
      } else {
        failedEntityHandler(actionDispatcher, catalogueEntity, requestType, action, response.response);
      }
    }),
    map(() => catalogueEntity.getRequestAction('complete', requestType))
  );
};
// action: ICFAction | PaginatedAction, state: CFAppState