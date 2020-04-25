// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { EylemPlaniMaddeActions, EylemPlaniMaddeActionTypes } from '../_actions/eylem-plani-madde.actions';
// Models
import { EylemPlaniMaddeModel } from '../_models/eylem-plani-madde.model';
import { QueryParamsModel } from '../../_base/crud';

export interface EylemPlaniMaddesState extends EntityState<EylemPlaniMaddeModel> {
    listLoading: boolean;
    actionsloading: boolean;
    totalCount: number;
    lastCreatedEylemPlaniMaddeId: number;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<EylemPlaniMaddeModel> = createEntityAdapter<EylemPlaniMaddeModel>();

export const initialEylemPlaniMaddesState: EylemPlaniMaddesState = adapter.getInitialState({
    eylemPlaniMaddeForEdit: null,
    listLoading: false,
    actionsloading: false,
    totalCount: 0,
    lastCreatedEylemPlaniMaddeId: undefined,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function eylemPlaniMaddesReducer(state = initialEylemPlaniMaddesState, action: EylemPlaniMaddeActions): EylemPlaniMaddesState {
    switch  (action.type) {
        case EylemPlaniMaddeActionTypes.EylemPlaniMaddesPageToggleLoading: {
            return {
                ...state, listLoading: action.payload.isLoading, lastCreatedEylemPlaniMaddeId: undefined
            };
        }
        case EylemPlaniMaddeActionTypes.EylemPlaniMaddeActionToggleLoading: {
            return {
                ...state, actionsloading: action.payload.isLoading
            };
        }
        case EylemPlaniMaddeActionTypes.EylemPlaniMaddeOnServerCreated: return {
            ...state
        };
        case EylemPlaniMaddeActionTypes.EylemPlaniMaddeCreated: return adapter.addOne(action.payload.eylemPlaniMadde, {
            ...state, lastCreatedEylemPlaniMaddeId: action.payload.eylemPlaniMadde.id
        });
        case EylemPlaniMaddeActionTypes.EylemPlaniMaddeUpdated: return adapter.updateOne(action.payload.partialEylemPlaniMadde, state);
        case EylemPlaniMaddeActionTypes.EylemPlaniMaddesStatusUpdated: {
            const _partialEylemPlaniMaddes: Update<EylemPlaniMaddeModel>[] = [];
            // tslint:disable-next-line:prefer-const
            for (let i = 0; i < action.payload.eylemPlaniMaddes.length; i++) {
                _partialEylemPlaniMaddes.push({
				    id: action.payload.eylemPlaniMaddes[i].id,
				    changes: {
                     //   status: action.payload.status
                    }
			    });
            }
            return adapter.updateMany(_partialEylemPlaniMaddes, state);
        }
        case EylemPlaniMaddeActionTypes.OneEylemPlaniMaddeDeleted: return adapter.removeOne(action.payload.id, state);
        case EylemPlaniMaddeActionTypes.ManyEylemPlaniMaddesDeleted: return adapter.removeMany(action.payload.ids, state);
        case EylemPlaniMaddeActionTypes.EylemPlaniMaddesPageCancelled: {
            return {
                ...state, listLoading: false, lastQuery: new QueryParamsModel({})
            };
        }
        case EylemPlaniMaddeActionTypes.EylemPlaniMaddesPageLoaded: {
            return adapter.addMany(action.payload.eylemPlaniMaddes, {
                ...initialEylemPlaniMaddesState,
                totalCount: action.payload.totalCount,
                listLoading: false,
                lastQuery: action.payload.page,
                showInitWaitingMessage: false
            });
        }
        default: return state;
    }
}

export const getEylemPlaniMaddeState = createFeatureSelector<EylemPlaniMaddeModel>('eylemPlaniMaddes');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
