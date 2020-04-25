// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { EylemPlaniMaddesState } from '../_reducers/eylem-plani-madde.reducers';
import { EylemPlaniMaddeModel } from '../_models/eylem-plani-madde.model';

export const selectEylemPlaniMaddesState = createFeatureSelector<EylemPlaniMaddesState>('eylemPlaniMaddes');

export const selectEylemPlaniMaddeById = (eylemPlaniMaddeId: number) => createSelector(
    selectEylemPlaniMaddesState,
    eylemPlaniMaddesState => eylemPlaniMaddesState.entities[eylemPlaniMaddeId]
);

export const selectEylemPlaniMaddesPageLoading = createSelector(
    selectEylemPlaniMaddesState,
    eylemPlaniMaddesState => eylemPlaniMaddesState.listLoading
);

export const selectEylemPlaniMaddesActionLoading = createSelector(
    selectEylemPlaniMaddesState,
    eylemPlaniMaddesState => eylemPlaniMaddesState.actionsloading
);

export const selectLastCreatedEylemPlaniMaddeId = createSelector(
    selectEylemPlaniMaddesState,
    eylemPlaniMaddesState => eylemPlaniMaddesState.lastCreatedEylemPlaniMaddeId
);

export const selectEylemPlaniMaddesShowInitWaitingMessage = createSelector(
    selectEylemPlaniMaddesState,
    eylemPlaniMaddesState => eylemPlaniMaddesState.showInitWaitingMessage
);

export const selectEylemPlaniMaddesInStore = createSelector(
    selectEylemPlaniMaddesState,
    eylemPlaniMaddesState => {
        const items: EylemPlaniMaddeModel[] = [];
        each(eylemPlaniMaddesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: EylemPlaniMaddeModel[] = httpExtension.sortArray(items, eylemPlaniMaddesState.lastQuery.sortField, eylemPlaniMaddesState.lastQuery.sortOrder);
        return new QueryResultsModel(result, eylemPlaniMaddesState.totalCount, '');
    }
);
