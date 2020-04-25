// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { PlatformKunyesState } from '../_reducers/platform-kunye.reducers';
import { PlatformKunyeModel } from '../_models/platform-kunye.model';

export const selectPlatformKunyesState = createFeatureSelector<PlatformKunyesState>('platformKunyes');

export const selectPlatformKunyeById = (platformKunyeId: number) => createSelector(
    selectPlatformKunyesState,
    platformKunyesState => platformKunyesState.entities[platformKunyeId]
);

export const selectPlatformKunyesPageLoading = createSelector(
    selectPlatformKunyesState,
    platformKunyesState => platformKunyesState.listLoading
);

export const selectPlatformKunyesActionLoading = createSelector(
    selectPlatformKunyesState,
    platformKunyesState => platformKunyesState.actionsloading
);

export const selectLastCreatedPlatformKunyeId = createSelector(
    selectPlatformKunyesState,
    platformKunyesState => platformKunyesState.lastCreatedPlatformKunyeId
);

export const selectPlatformKunyesShowInitWaitingMessage = createSelector(
    selectPlatformKunyesState,
    platformKunyesState => platformKunyesState.showInitWaitingMessage
);

export const selectPlatformKunyesInStore = createSelector(
    selectPlatformKunyesState,
    platformKunyesState => {
        const items: PlatformKunyeModel[] = [];
        each(platformKunyesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: PlatformKunyeModel[] = httpExtension.sortArray(items, platformKunyesState.lastQuery.sortField, platformKunyesState.lastQuery.sortOrder);
        return new QueryResultsModel(result, platformKunyesState.totalCount, '');
    }
);
