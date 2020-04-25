// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { PlatformKunyeActions, PlatformKunyeActionTypes } from '../_actions/platform-kunye.actions';
// Models
import { PlatformKunyeModel } from '../_models/platform-kunye.model';
import { QueryParamsModel } from '../../_base/crud';

export interface PlatformKunyesState extends EntityState<PlatformKunyeModel> {
    listLoading: boolean;
    actionsloading: boolean;
    totalCount: number;
    lastCreatedPlatformKunyeId: number;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<PlatformKunyeModel> = createEntityAdapter<PlatformKunyeModel>();

export const initialPlatformKunyesState: PlatformKunyesState = adapter.getInitialState({
    platformKunyeForEdit: null,
    listLoading: false,
    actionsloading: false,
    totalCount: 0,
    lastCreatedPlatformKunyeId: undefined,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function platformKunyesReducer(state = initialPlatformKunyesState, action: PlatformKunyeActions): PlatformKunyesState {
    switch  (action.type) {
        case PlatformKunyeActionTypes.PlatformKunyesPageToggleLoading: {
            return {
                ...state, listLoading: action.payload.isLoading, lastCreatedPlatformKunyeId: undefined
            };
        }
        case PlatformKunyeActionTypes.PlatformKunyeActionToggleLoading: {
            return {
                ...state, actionsloading: action.payload.isLoading
            };
        }
        case PlatformKunyeActionTypes.PlatformKunyeOnServerCreated: return {
            ...state
        };
        case PlatformKunyeActionTypes.PlatformKunyeCreated: return adapter.addOne(action.payload.platformKunye, {
            ...state, lastCreatedPlatformKunyeId: action.payload.platformKunye.id
        });
        case PlatformKunyeActionTypes.PlatformKunyeUpdated: return adapter.updateOne(action.payload.partialPlatformKunye, state);
        case PlatformKunyeActionTypes.PlatformKunyesStatusUpdated: {
            const _partialPlatformKunyes: Update<PlatformKunyeModel>[] = [];
            // tslint:disable-next-line:prefer-const
            for (let i = 0; i < action.payload.platformKunyes.length; i++) {
                _partialPlatformKunyes.push({
				    id: action.payload.platformKunyes[i].id,
				    changes: {
                        status: action.payload.status
                    }
			    });
            }
            return adapter.updateMany(_partialPlatformKunyes, state);
        }
        case PlatformKunyeActionTypes.OnePlatformKunyeDeleted: return adapter.removeOne(action.payload.id, state);
        case PlatformKunyeActionTypes.ManyPlatformKunyesDeleted: return adapter.removeMany(action.payload.ids, state);
        case PlatformKunyeActionTypes.PlatformKunyesPageCancelled: {
            return {
                ...state, listLoading: false, lastQuery: new QueryParamsModel({})
            };
        }
        case PlatformKunyeActionTypes.PlatformKunyesPageLoaded: {
            return adapter.addMany(action.payload.platformKunyes, {
                ...initialPlatformKunyesState,
                totalCount: action.payload.totalCount,
                listLoading: false,
                lastQuery: action.payload.page,
                showInitWaitingMessage: false
            });
        }
        default: return state;
    }
}

export const getPlatformKunyeState = createFeatureSelector<PlatformKunyeModel>('platformKunyes');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
