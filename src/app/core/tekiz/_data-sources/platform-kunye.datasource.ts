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
import { selectPlatformKunyesInStore, selectPlatformKunyesPageLoading, selectPlatformKunyesShowInitWaitingMessage } from '../_selectors/platform-kunye.selectors';

export class PlatformKunyesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectPlatformKunyesPageLoading),
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectPlatformKunyesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectPlatformKunyesInStore),
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});
	}
}
