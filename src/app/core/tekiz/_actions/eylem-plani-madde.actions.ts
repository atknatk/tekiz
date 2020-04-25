// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
import { EylemPlaniMaddeModel } from '../_models/eylem-plani-madde.model';
// Models


export enum EylemPlaniMaddeActionTypes {
    EylemPlaniMaddeOnServerCreated = '[Edit EylemPlaniMadde Dialog] EylemPlaniMadde On Server Created',
    EylemPlaniMaddeCreated = '[Edit EylemPlaniMadde Dialog] EylemPlaniMadde Created',
    EylemPlaniMaddeUpdated = '[Edit EylemPlaniMadde Dialog] EylemPlaniMadde Updated',
    EylemPlaniMaddesStatusUpdated = '[EylemPlaniMadde List Page] EylemPlaniMaddes Status Updated',
    OneEylemPlaniMaddeDeleted = '[EylemPlaniMaddes List Page] One EylemPlaniMadde Deleted',
    ManyEylemPlaniMaddesDeleted = '[EylemPlaniMaddes List Page] Many EylemPlaniMadde Deleted',
    EylemPlaniMaddesPageRequested = '[EylemPlaniMaddes List Page] EylemPlaniMaddes Page Requested',
    EylemPlaniMaddesPageLoaded = '[EylemPlaniMaddes API] EylemPlaniMaddes Page Loaded',
    EylemPlaniMaddesPageCancelled = '[EylemPlaniMaddes API] EylemPlaniMaddes Page Cancelled',
    EylemPlaniMaddesPageToggleLoading = '[EylemPlaniMaddes] EylemPlaniMaddes Page Toggle Loading',
    EylemPlaniMaddeActionToggleLoading = '[EylemPlaniMaddes] EylemPlaniMaddes Action Toggle Loading'
}

export class EylemPlaniMaddeOnServerCreated implements Action {
    readonly type = EylemPlaniMaddeActionTypes.EylemPlaniMaddeOnServerCreated;
    constructor(public payload: { eylemPlaniMadde: EylemPlaniMaddeModel }) { }
}

export class EylemPlaniMaddeCreated implements Action {
    readonly type = EylemPlaniMaddeActionTypes.EylemPlaniMaddeCreated;
    constructor(public payload: { eylemPlaniMadde: EylemPlaniMaddeModel }) { }
}

export class EylemPlaniMaddeUpdated implements Action {
    readonly type = EylemPlaniMaddeActionTypes.EylemPlaniMaddeUpdated;
    constructor(public payload: {
        partialEylemPlaniMadde: Update<EylemPlaniMaddeModel>, // For State update
        eylemPlaniMadde: EylemPlaniMaddeModel // For Server update (through service)
    }) { }
}

export class EylemPlaniMaddesStatusUpdated implements Action {
    readonly type = EylemPlaniMaddeActionTypes.EylemPlaniMaddesStatusUpdated;
    constructor(public payload: {
        eylemPlaniMaddes: EylemPlaniMaddeModel[],
        status: number
    }) { }
}

export class OneEylemPlaniMaddeDeleted implements Action {
    readonly type = EylemPlaniMaddeActionTypes.OneEylemPlaniMaddeDeleted;
    constructor(public payload: { id: number }) {}
}

export class ManyEylemPlaniMaddesDeleted implements Action {
    readonly type = EylemPlaniMaddeActionTypes.ManyEylemPlaniMaddesDeleted;
    constructor(public payload: { ids: number[] }) {}
}

export class EylemPlaniMaddesPageRequested implements Action {
    readonly type = EylemPlaniMaddeActionTypes.EylemPlaniMaddesPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class EylemPlaniMaddesPageLoaded implements Action {
    readonly type = EylemPlaniMaddeActionTypes.EylemPlaniMaddesPageLoaded;
    constructor(public payload: { eylemPlaniMaddes: EylemPlaniMaddeModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class EylemPlaniMaddesPageCancelled implements Action {
    readonly type = EylemPlaniMaddeActionTypes.EylemPlaniMaddesPageCancelled;
}

export class EylemPlaniMaddesPageToggleLoading implements Action {
    readonly type = EylemPlaniMaddeActionTypes.EylemPlaniMaddesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class EylemPlaniMaddeActionToggleLoading implements Action {
    readonly type = EylemPlaniMaddeActionTypes.EylemPlaniMaddeActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type EylemPlaniMaddeActions = EylemPlaniMaddeOnServerCreated
| EylemPlaniMaddeCreated
| EylemPlaniMaddeUpdated
| EylemPlaniMaddesStatusUpdated
| OneEylemPlaniMaddeDeleted
| ManyEylemPlaniMaddesDeleted
| EylemPlaniMaddesPageRequested
| EylemPlaniMaddesPageLoaded
| EylemPlaniMaddesPageCancelled
| EylemPlaniMaddesPageToggleLoading
| EylemPlaniMaddeActionToggleLoading;
