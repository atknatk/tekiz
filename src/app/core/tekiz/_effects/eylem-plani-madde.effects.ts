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
import { EylemPlaniMaddesService } from '../_services';
// State
import { AppState } from '../../reducers';
// Actions
import {
    EylemPlaniMaddeActionTypes,
    EylemPlaniMaddesPageRequested,
    EylemPlaniMaddesPageLoaded,
    ManyEylemPlaniMaddesDeleted,
    OneEylemPlaniMaddeDeleted,
    EylemPlaniMaddeActionToggleLoading,
    EylemPlaniMaddesPageToggleLoading,
    EylemPlaniMaddeUpdated,
    EylemPlaniMaddesStatusUpdated,
    EylemPlaniMaddeCreated,
    EylemPlaniMaddeOnServerCreated
} from '../_actions/eylem-plani-madde.actions';
import { of } from 'rxjs';

@Injectable()
export class EylemPlaniMaddeEffects {
    showPageLoadingDistpatcher = new EylemPlaniMaddesPageToggleLoading({ isLoading: true });
    showActionLoadingDistpatcher = new EylemPlaniMaddeActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new EylemPlaniMaddeActionToggleLoading({ isLoading: false });

    @Effect()
    loadEylemPlaniMaddesPage$ = this.actions$.pipe(
        ofType<EylemPlaniMaddesPageRequested>(EylemPlaniMaddeActionTypes.EylemPlaniMaddesPageRequested),
        mergeMap(( { payload } ) => {
            this.store.dispatch(this.showPageLoadingDistpatcher);
            const requestToServer = this.eylemPlaniMaddesService.findEylemPlaniMaddes(payload.page);
            const lastQuery = of(payload.page);
            return forkJoin(requestToServer, lastQuery);
        }),
        map(response => {
            const result: QueryResultsModel = response[0];
            const lastQuery: QueryParamsModel = response[1];
            const pageLoadedDispatch = new EylemPlaniMaddesPageLoaded({
                eylemPlaniMaddes: result.items,
                totalCount: result.totalCount,
                page: lastQuery
            });
            return pageLoadedDispatch;
        })
    );

    @Effect()
    deleteEylemPlaniMadde$ = this.actions$
        .pipe(
            ofType<OneEylemPlaniMaddeDeleted>(EylemPlaniMaddeActionTypes.OneEylemPlaniMaddeDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.eylemPlaniMaddesService.deleteEylemPlaniMadde(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    deleteEylemPlaniMaddes$ = this.actions$
        .pipe(
            ofType<ManyEylemPlaniMaddesDeleted>(EylemPlaniMaddeActionTypes.ManyEylemPlaniMaddesDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.eylemPlaniMaddesService.deleteEylemPlaniMaddes(payload.ids);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateEylemPlaniMadde$ = this.actions$
        .pipe(
            ofType<EylemPlaniMaddeUpdated>(EylemPlaniMaddeActionTypes.EylemPlaniMaddeUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.eylemPlaniMaddesService.updateEylemPlaniMadde(payload.eylemPlaniMadde);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            })
        );

    @Effect()
    updateEylemPlaniMaddesStatus$ = this.actions$
        .pipe(
            ofType<EylemPlaniMaddesStatusUpdated>(EylemPlaniMaddeActionTypes.EylemPlaniMaddesStatusUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.eylemPlaniMaddesService.updateStatusForEylemPlaniMadde(payload.eylemPlaniMaddes, payload.status);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            })
        );

    @Effect()
    createEylemPlaniMadde$ = this.actions$
        .pipe(
            ofType<EylemPlaniMaddeOnServerCreated>(EylemPlaniMaddeActionTypes.EylemPlaniMaddeOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.eylemPlaniMaddesService.createEylemPlaniMadde(payload.eylemPlaniMadde).pipe(
                    tap(res => {
                        this.store.dispatch(new EylemPlaniMaddeCreated({ eylemPlaniMadde: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    constructor(private actions$: Actions, private eylemPlaniMaddesService: EylemPlaniMaddesService, private store: Store<AppState>) { }
}
