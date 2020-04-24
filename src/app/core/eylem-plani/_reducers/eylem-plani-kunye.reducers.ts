// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { EylemPlaniKunyeActions, EylemPlaniKunyeActionTypes } from '../_actions/eylem-plani-kunye.actions';
// Models
import { EylemPlaniKunyeModel } from '../_models/eylem-plani-kunye.model';
import { QueryParamsModel } from '../../_base/crud';

export interface EylemPlaniKunyesState extends EntityState<EylemPlaniKunyeModel> {
    listLoading: boolean;
    actionsloading: boolean;
    totalCount: number;
    lastCreatedEylemPlaniKunyeId: number;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<EylemPlaniKunyeModel> = createEntityAdapter<EylemPlaniKunyeModel>();

export const initialEylemPlaniKunyesState: EylemPlaniKunyesState = adapter.getInitialState({
    eylemPlaniKunyeForEdit: null,
    listLoading: false,
    actionsloading: false,
    totalCount: 0,
    lastCreatedEylemPlaniKunyeId: undefined,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function eylemPlaniKunyesReducer(state = initialEylemPlaniKunyesState, action: EylemPlaniKunyeActions): EylemPlaniKunyesState {
    switch  (action.type) {
        case EylemPlaniKunyeActionTypes.EylemPlaniKunyesPageToggleLoading: {
            return {
                ...state, listLoading: action.payload.isLoading, lastCreatedEylemPlaniKunyeId: undefined
            };
        }
        case EylemPlaniKunyeActionTypes.EylemPlaniKunyeActionToggleLoading: {
            return {
                ...state, actionsloading: action.payload.isLoading
            };
        }
        case EylemPlaniKunyeActionTypes.EylemPlaniKunyeOnServerCreated: return {
            ...state
        };
        case EylemPlaniKunyeActionTypes.EylemPlaniKunyeCreated: return adapter.addOne(action.payload.eylemPlaniKunye, {
            ...state, lastCreatedEylemPlaniKunyeId: action.payload.eylemPlaniKunye.id
        });
        case EylemPlaniKunyeActionTypes.EylemPlaniKunyeUpdated: return adapter.updateOne(action.payload.partialEylemPlaniKunye, state);
        case EylemPlaniKunyeActionTypes.EylemPlaniKunyesStatusUpdated: {
            const _partialEylemPlaniKunyes: Update<EylemPlaniKunyeModel>[] = [];
            // tslint:disable-next-line:prefer-const
            for (let i = 0; i < action.payload.eylemPlaniKunyes.length; i++) {
                _partialEylemPlaniKunyes.push({
				    id: action.payload.eylemPlaniKunyes[i].id,
				    changes: {
                     //   status: action.payload.status
                    }
			    });
            }
            return adapter.updateMany(_partialEylemPlaniKunyes, state);
        }
        case EylemPlaniKunyeActionTypes.OneEylemPlaniKunyeDeleted: return adapter.removeOne(action.payload.id, state);
        case EylemPlaniKunyeActionTypes.ManyEylemPlaniKunyesDeleted: return adapter.removeMany(action.payload.ids, state);
        case EylemPlaniKunyeActionTypes.EylemPlaniKunyesPageCancelled: {
            return {
                ...state, listLoading: false, lastQuery: new QueryParamsModel({})
            };
        }
        case EylemPlaniKunyeActionTypes.EylemPlaniKunyesPageLoaded: {
            return adapter.addMany(action.payload.eylemPlaniKunyes, {
                ...initialEylemPlaniKunyesState,
                totalCount: action.payload.totalCount,
                listLoading: false,
                lastQuery: action.payload.page,
                showInitWaitingMessage: false
            });
        }
        default: return state;
    }
}

export const getEylemPlaniKunyeState = createFeatureSelector<EylemPlaniKunyeModel>('eylemPlaniKunyes');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
