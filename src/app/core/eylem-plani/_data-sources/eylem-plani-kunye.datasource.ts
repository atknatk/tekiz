import { mergeMap, tap } from 'rxjs/operators';
// RxJS
import { delay, distinctUntilChanged, skip, filter, take, map } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../reducers';
// tslint:disable-next-line: max-line-length
import { selectEylemPlaniKunyesInStore, selectEylemPlaniKunyesPageLoading, selectEylemPlaniKunyesShowInitWaitingMessage } from '../_selectors/eylem-plani-kunye.selectors';

export class EylemPlaniKunyesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectEylemPlaniKunyesPageLoading),
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectEylemPlaniKunyesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectEylemPlaniKunyesInStore),
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});
	}
}
