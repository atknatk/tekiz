import { QueryParamsModel } from '../../_base/crud/models/query-models/query-params.model';
import { forkJoin } from 'rxjs';
// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap, delay } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
// CRUD
import { QueryResultsModel } from '../../_base/crud';
// Services
import { EylemPlaniKunyesService } from '../_services';
// State
import { AppState } from '../../reducers';
// Actions
import {
    EylemPlaniKunyeActionTypes,
    EylemPlaniKunyesPageRequested,
    EylemPlaniKunyesPageLoaded,
    ManyEylemPlaniKunyesDeleted,
    OneEylemPlaniKunyeDeleted,
    EylemPlaniKunyeActionToggleLoading,
    EylemPlaniKunyesPageToggleLoading,
    EylemPlaniKunyeUpdated,
    EylemPlaniKunyesStatusUpdated,
    EylemPlaniKunyeCreated,
    EylemPlaniKunyeOnServerCreated
} from '../_actions/eylem-plani-kunye.actions';
import { of } from 'rxjs';

@Injectable()
export class EylemPlaniKunyeEffects {
    showPageLoadingDistpatcher = new EylemPlaniKunyesPageToggleLoading({ isLoading: true });
    showActionLoadingDistpatcher = new EylemPlaniKunyeActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new EylemPlaniKunyeActionToggleLoading({ isLoading: false });

    @Effect()
    loadEylemPlaniKunyesPage$ = this.actions$.pipe(
        ofType<EylemPlaniKunyesPageRequested>(EylemPlaniKunyeActionTypes.EylemPlaniKunyesPageRequested),
        mergeMap(( { payload } ) => {
            this.store.dispatch(this.showPageLoadingDistpatcher);
            const requestToServer = this.eylemPlaniKunyesService.findEylemPlaniKunyes(payload.page);
            const lastQuery = of(payload.page);
            return forkJoin(requestToServer, lastQuery);
        }),
        map(response => {
            const result: QueryResultsModel = response[0];
            const lastQuery: QueryParamsModel = response[1];
            const pageLoadedDispatch = new EylemPlaniKunyesPageLoaded({
                eylemPlaniKunyes: result.items,
                totalCount: result.totalCount,
                page: lastQuery
            });
            return pageLoadedDispatch;
        })
    );

    @Effect()
    deleteEylemPlaniKunye$ = this.actions$
        .pipe(
            ofType<OneEylemPlaniKunyeDeleted>(EylemPlaniKunyeActionTypes.OneEylemPlaniKunyeDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.eylemPlaniKunyesService.deleteEylemPlaniKunye(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    deleteEylemPlaniKunyes$ = this.actions$
        .pipe(
            ofType<ManyEylemPlaniKunyesDeleted>(EylemPlaniKunyeActionTypes.ManyEylemPlaniKunyesDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.eylemPlaniKunyesService.deleteEylemPlaniKunyes(payload.ids);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateEylemPlaniKunye$ = this.actions$
        .pipe(
            ofType<EylemPlaniKunyeUpdated>(EylemPlaniKunyeActionTypes.EylemPlaniKunyeUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.eylemPlaniKunyesService.updateEylemPlaniKunye(payload.eylemPlaniKunye);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            })
        );

    @Effect()
    updateEylemPlaniKunyesStatus$ = this.actions$
        .pipe(
            ofType<EylemPlaniKunyesStatusUpdated>(EylemPlaniKunyeActionTypes.EylemPlaniKunyesStatusUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.eylemPlaniKunyesService.updateStatusForEylemPlaniKunye(payload.eylemPlaniKunyes, payload.status);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            })
        );

    @Effect()
    createEylemPlaniKunye$ = this.actions$
        .pipe(
            ofType<EylemPlaniKunyeOnServerCreated>(EylemPlaniKunyeActionTypes.EylemPlaniKunyeOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.eylemPlaniKunyesService.createEylemPlaniKunye(payload.eylemPlaniKunye).pipe(
                    tap(res => {
                        this.store.dispatch(new EylemPlaniKunyeCreated({ eylemPlaniKunye: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    constructor(private actions$: Actions, private eylemPlaniKunyesService: EylemPlaniKunyesService, private store: Store<AppState>) { }
}
