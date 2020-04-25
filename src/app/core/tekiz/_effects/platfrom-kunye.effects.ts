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
import { PlatformKunyesService } from '../_services/';
// State
import { AppState } from '../../reducers';
// Actions
import {
    PlatformKunyeActionTypes,
    PlatformKunyesPageRequested,
    PlatformKunyesPageLoaded,
    ManyPlatformKunyesDeleted,
    OnePlatformKunyeDeleted,
    PlatformKunyeActionToggleLoading,
    PlatformKunyesPageToggleLoading,
    PlatformKunyeUpdated,
    PlatformKunyesStatusUpdated,
    PlatformKunyeCreated,
    PlatformKunyeOnServerCreated
} from '../_actions/platform-kunye.actions';
import { of } from 'rxjs';

@Injectable()
export class PlatformKunyeEffects {
    showPageLoadingDistpatcher = new PlatformKunyesPageToggleLoading({ isLoading: true });
    showActionLoadingDistpatcher = new PlatformKunyeActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new PlatformKunyeActionToggleLoading({ isLoading: false });

    @Effect()
    loadPlatformKunyesPage$ = this.actions$.pipe(
        ofType<PlatformKunyesPageRequested>(PlatformKunyeActionTypes.PlatformKunyesPageRequested),
        mergeMap(( { payload } ) => {
            this.store.dispatch(this.showPageLoadingDistpatcher);
            const requestToServer = this.platformKunyesService.findPlatformKunyes(payload.page);
            const lastQuery = of(payload.page);
            return forkJoin(requestToServer, lastQuery);
        }),
        map(response => {
            const result: QueryResultsModel = response[0];
            const lastQuery: QueryParamsModel = response[1];
            const pageLoadedDispatch = new PlatformKunyesPageLoaded({
                platformKunyes: result.items,
                totalCount: result.totalCount,
                page: lastQuery
            });
            return pageLoadedDispatch;
        })
    );

    @Effect()
    deletePlatformKunye$ = this.actions$
        .pipe(
            ofType<OnePlatformKunyeDeleted>(PlatformKunyeActionTypes.OnePlatformKunyeDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.platformKunyesService.deletePlatformKunye(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    deletePlatformKunyes$ = this.actions$
        .pipe(
            ofType<ManyPlatformKunyesDeleted>(PlatformKunyeActionTypes.ManyPlatformKunyesDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.platformKunyesService.deletePlatformKunyes(payload.ids);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updatePlatformKunye$ = this.actions$
        .pipe(
            ofType<PlatformKunyeUpdated>(PlatformKunyeActionTypes.PlatformKunyeUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.platformKunyesService.updatePlatformKunye(payload.platformKunye);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            })
        );

    @Effect()
    updatePlatformKunyesStatus$ = this.actions$
        .pipe(
            ofType<PlatformKunyesStatusUpdated>(PlatformKunyeActionTypes.PlatformKunyesStatusUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.platformKunyesService.updateStatusForPlatformKunye(payload.platformKunyes, payload.status);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            })
        );

    @Effect()
    createPlatformKunye$ = this.actions$
        .pipe(
            ofType<PlatformKunyeOnServerCreated>(PlatformKunyeActionTypes.PlatformKunyeOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.platformKunyesService.createPlatformKunye(payload.platformKunye).pipe(
                    tap(res => {
                        this.store.dispatch(new PlatformKunyeCreated({ platformKunye: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    constructor(private actions$: Actions, private platformKunyesService: PlatformKunyesService, private store: Store<AppState>) { }
}
