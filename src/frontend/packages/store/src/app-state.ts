import { ActionHistoryState } from './reducers/action-history-reducer';
import { AuthState } from './reducers/auth.reducer';
import { DashboardState } from './reducers/dashboard-reducer';
import { ListsState } from './reducers/list.reducer';
import { CreateNewApplicationState } from './types/create-application.types';
import { CreateServiceInstanceState } from './types/create-service-instance.types';
import { ICurrentUserRolesState } from './types/current-user-roles.types';
import { DeployApplicationState } from './types/deploy-application.types';
import { EndpointState } from './types/endpoint.types';
import { ExtendedRequestState, CFRequestDataState } from './types/entity.types';
import { IUserFavoritesGroupsState } from './types/favorite-groups.types';
import { InternalEventsState } from './types/internal-events.types';
import { PaginationEntityTypeState } from './types/pagination.types';
import { IRecentlyVisitedState } from './types/recently-visited.types';
import { RoutingHistory } from './types/routing.type';
import { UAASetupState } from './types/uaa-setup.types';
import { UsersRolesState } from './types/users-roles.types';
import { RequestInfoState } from './reducers/api-request-reducer/types';

export interface IRequestTypeState {
  [entityKey: string]: any;
}
export interface IRequestEntityTypeState<T> {
  [guid: string]: T;
}
export abstract class AppState<
  T extends Record<string, any> = CFRequestDataState
  > {
  actionHistory: ActionHistoryState;
  auth: AuthState;
  uaaSetup: UAASetupState;
  endpoints: EndpointState;
  pagination: ExtendedRequestState<keyof T, PaginationEntityTypeState>;
  request: ExtendedRequestState<keyof T, IRequestEntityTypeState<RequestInfoState>>;
  requestData: T;
  dashboard: DashboardState;
  createApplication: CreateNewApplicationState;
  deployApplication: DeployApplicationState;
  createServiceInstance: CreateServiceInstanceState;
  lists: ListsState;
  routing: RoutingHistory;
  manageUsersRoles: UsersRolesState;
  internalEvents: InternalEventsState;
  currentUserRoles: ICurrentUserRolesState;
  userFavoritesGroups: IUserFavoritesGroupsState;
  recentlyVisited: IRecentlyVisitedState;
}
