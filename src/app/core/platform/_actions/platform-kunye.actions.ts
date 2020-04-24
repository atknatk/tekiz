// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { PlatformKunyeModel } from '../_models/platform-kunye.model';

export enum PlatformKunyeActionTypes {
    PlatformKunyeOnServerCreated = '[Edit PlatformKunye Dialog] PlatformKunye On Server Created',
    PlatformKunyeCreated = '[Edit PlatformKunye Dialog] PlatformKunye Created',
    PlatformKunyeUpdated = '[Edit PlatformKunye Dialog] PlatformKunye Updated',
    PlatformKunyesStatusUpdated = '[PlatformKunye List Page] PlatformKunyes Status Updated',
    OnePlatformKunyeDeleted = '[PlatformKunyes List Page] One PlatformKunye Deleted',
    ManyPlatformKunyesDeleted = '[PlatformKunyes List Page] Many PlatformKunye Deleted',
    PlatformKunyesPageRequested = '[PlatformKunyes List Page] PlatformKunyes Page Requested',
    PlatformKunyesPageLoaded = '[PlatformKunyes API] PlatformKunyes Page Loaded',
    PlatformKunyesPageCancelled = '[PlatformKunyes API] PlatformKunyes Page Cancelled',
    PlatformKunyesPageToggleLoading = '[PlatformKunyes] PlatformKunyes Page Toggle Loading',
    PlatformKunyeActionToggleLoading = '[PlatformKunyes] PlatformKunyes Action Toggle Loading'
}

export class PlatformKunyeOnServerCreated implements Action {
    readonly type = PlatformKunyeActionTypes.PlatformKunyeOnServerCreated;
    constructor(public payload: { platformKunye: PlatformKunyeModel }) { }
}

export class PlatformKunyeCreated implements Action {
    readonly type = PlatformKunyeActionTypes.PlatformKunyeCreated;
    constructor(public payload: { platformKunye: PlatformKunyeModel }) { }
}

export class PlatformKunyeUpdated implements Action {
    readonly type = PlatformKunyeActionTypes.PlatformKunyeUpdated;
    constructor(public payload: {
        partialPlatformKunye: Update<PlatformKunyeModel>, // For State update
        platformKunye: PlatformKunyeModel // For Server update (through service)
    }) { }
}

export class PlatformKunyesStatusUpdated implements Action {
    readonly type = PlatformKunyeActionTypes.PlatformKunyesStatusUpdated;
    constructor(public payload: {
        platformKunyes: PlatformKunyeModel[],
        status: number
    }) { }
}

export class OnePlatformKunyeDeleted implements Action {
    readonly type = PlatformKunyeActionTypes.OnePlatformKunyeDeleted;
    constructor(public payload: { id: number }) {}
}

export class ManyPlatformKunyesDeleted implements Action {
    readonly type = PlatformKunyeActionTypes.ManyPlatformKunyesDeleted;
    constructor(public payload: { ids: number[] }) {}
}

export class PlatformKunyesPageRequested implements Action {
    readonly type = PlatformKunyeActionTypes.PlatformKunyesPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class PlatformKunyesPageLoaded implements Action {
    readonly type = PlatformKunyeActionTypes.PlatformKunyesPageLoaded;
    constructor(public payload: { platformKunyes: PlatformKunyeModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class PlatformKunyesPageCancelled implements Action {
    readonly type = PlatformKunyeActionTypes.PlatformKunyesPageCancelled;
}

export class PlatformKunyesPageToggleLoading implements Action {
    readonly type = PlatformKunyeActionTypes.PlatformKunyesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class PlatformKunyeActionToggleLoading implements Action {
    readonly type = PlatformKunyeActionTypes.PlatformKunyeActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type PlatformKunyeActions = PlatformKunyeOnServerCreated
| PlatformKunyeCreated
| PlatformKunyeUpdated
| PlatformKunyesStatusUpdated
| OnePlatformKunyeDeleted
| ManyPlatformKunyesDeleted
| PlatformKunyesPageRequested
| PlatformKunyesPageLoaded
| PlatformKunyesPageCancelled
| PlatformKunyesPageToggleLoading
| PlatformKunyeActionToggleLoading;
