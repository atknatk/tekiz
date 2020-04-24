// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { EylemPlaniKunyesState } from '../_reducers/eylem-plani-kunye.reducers';
import { EylemPlaniKunyeModel } from '../_models/eylem-plani-kunye.model';

export const selectEylemPlaniKunyesState = createFeatureSelector<EylemPlaniKunyesState>('eylemPlaniKunyes');

export const selectEylemPlaniKunyeById = (eylemPlaniKunyeId: number) => createSelector(
    selectEylemPlaniKunyesState,
    eylemPlaniKunyesState => eylemPlaniKunyesState.entities[eylemPlaniKunyeId]
);

export const selectEylemPlaniKunyesPageLoading = createSelector(
    selectEylemPlaniKunyesState,
    eylemPlaniKunyesState => eylemPlaniKunyesState.listLoading
);

export const selectEylemPlaniKunyesActionLoading = createSelector(
    selectEylemPlaniKunyesState,
    eylemPlaniKunyesState => eylemPlaniKunyesState.actionsloading
);

export const selectLastCreatedEylemPlaniKunyeId = createSelector(
    selectEylemPlaniKunyesState,
    eylemPlaniKunyesState => eylemPlaniKunyesState.lastCreatedEylemPlaniKunyeId
);

export const selectEylemPlaniKunyesShowInitWaitingMessage = createSelector(
    selectEylemPlaniKunyesState,
    eylemPlaniKunyesState => eylemPlaniKunyesState.showInitWaitingMessage
);

export const selectEylemPlaniKunyesInStore = createSelector(
    selectEylemPlaniKunyesState,
    eylemPlaniKunyesState => {
        const items: EylemPlaniKunyeModel[] = [];
        each(eylemPlaniKunyesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: EylemPlaniKunyeModel[] = httpExtension.sortArray(items, eylemPlaniKunyesState.lastQuery.sortField, eylemPlaniKunyesState.lastQuery.sortOrder);
        return new QueryResultsModel(result, eylemPlaniKunyesState.totalCount, '');
    }
);
