// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { EylemPlaniKunyeModel } from '../_models/eylem-plani-kunye.model';

export enum EylemPlaniKunyeActionTypes {
    EylemPlaniKunyeOnServerCreated = '[Edit EylemPlaniKunye Dialog] EylemPlaniKunye On Server Created',
    EylemPlaniKunyeCreated = '[Edit EylemPlaniKunye Dialog] EylemPlaniKunye Created',
    EylemPlaniKunyeUpdated = '[Edit EylemPlaniKunye Dialog] EylemPlaniKunye Updated',
    EylemPlaniKunyesStatusUpdated = '[EylemPlaniKunye List Page] EylemPlaniKunyes Status Updated',
    OneEylemPlaniKunyeDeleted = '[EylemPlaniKunyes List Page] One EylemPlaniKunye Deleted',
    ManyEylemPlaniKunyesDeleted = '[EylemPlaniKunyes List Page] Many EylemPlaniKunye Deleted',
    EylemPlaniKunyesPageRequested = '[EylemPlaniKunyes List Page] EylemPlaniKunyes Page Requested',
    EylemPlaniKunyesPageLoaded = '[EylemPlaniKunyes API] EylemPlaniKunyes Page Loaded',
    EylemPlaniKunyesPageCancelled = '[EylemPlaniKunyes API] EylemPlaniKunyes Page Cancelled',
    EylemPlaniKunyesPageToggleLoading = '[EylemPlaniKunyes] EylemPlaniKunyes Page Toggle Loading',
    EylemPlaniKunyeActionToggleLoading = '[EylemPlaniKunyes] EylemPlaniKunyes Action Toggle Loading'
}

export class EylemPlaniKunyeOnServerCreated implements Action {
    readonly type = EylemPlaniKunyeActionTypes.EylemPlaniKunyeOnServerCreated;
    constructor(public payload: { eylemPlaniKunye: EylemPlaniKunyeModel }) { }
}

export class EylemPlaniKunyeCreated implements Action {
    readonly type = EylemPlaniKunyeActionTypes.EylemPlaniKunyeCreated;
    constructor(public payload: { eylemPlaniKunye: EylemPlaniKunyeModel }) { }
}

export class EylemPlaniKunyeUpdated implements Action {
    readonly type = EylemPlaniKunyeActionTypes.EylemPlaniKunyeUpdated;
    constructor(public payload: {
        partialEylemPlaniKunye: Update<EylemPlaniKunyeModel>, // For State update
        eylemPlaniKunye: EylemPlaniKunyeModel // For Server update (through service)
    }) { }
}

export class EylemPlaniKunyesStatusUpdated implements Action {
    readonly type = EylemPlaniKunyeActionTypes.EylemPlaniKunyesStatusUpdated;
    constructor(public payload: {
        eylemPlaniKunyes: EylemPlaniKunyeModel[],
        status: number
    }) { }
}

export class OneEylemPlaniKunyeDeleted implements Action {
    readonly type = EylemPlaniKunyeActionTypes.OneEylemPlaniKunyeDeleted;
    constructor(public payload: { id: number }) {}
}

export class ManyEylemPlaniKunyesDeleted implements Action {
    readonly type = EylemPlaniKunyeActionTypes.ManyEylemPlaniKunyesDeleted;
    constructor(public payload: { ids: number[] }) {}
}

export class EylemPlaniKunyesPageRequested implements Action {
    readonly type = EylemPlaniKunyeActionTypes.EylemPlaniKunyesPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class EylemPlaniKunyesPageLoaded implements Action {
    readonly type = EylemPlaniKunyeActionTypes.EylemPlaniKunyesPageLoaded;
    constructor(public payload: { eylemPlaniKunyes: EylemPlaniKunyeModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class EylemPlaniKunyesPageCancelled implements Action {
    readonly type = EylemPlaniKunyeActionTypes.EylemPlaniKunyesPageCancelled;
}

export class EylemPlaniKunyesPageToggleLoading implements Action {
    readonly type = EylemPlaniKunyeActionTypes.EylemPlaniKunyesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class EylemPlaniKunyeActionToggleLoading implements Action {
    readonly type = EylemPlaniKunyeActionTypes.EylemPlaniKunyeActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type EylemPlaniKunyeActions = EylemPlaniKunyeOnServerCreated
| EylemPlaniKunyeCreated
| EylemPlaniKunyeUpdated
| EylemPlaniKunyesStatusUpdated
| OneEylemPlaniKunyeDeleted
| ManyEylemPlaniKunyesDeleted
| EylemPlaniKunyesPageRequested
| EylemPlaniKunyesPageLoaded
| EylemPlaniKunyesPageCancelled
| EylemPlaniKunyesPageToggleLoading
| EylemPlaniKunyeActionToggleLoading;
