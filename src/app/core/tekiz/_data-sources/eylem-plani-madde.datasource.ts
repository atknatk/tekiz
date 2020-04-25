// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../reducers';
// tslint:disable-next-line: max-line-length
import { selectEylemPlaniMaddesInStore, selectEylemPlaniMaddesPageLoading, selectEylemPlaniMaddesShowInitWaitingMessage } from '../_selectors/eylem-plani-madde.selectors';

export class EylemPlaniMaddesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectEylemPlaniMaddesPageLoading),
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectEylemPlaniMaddesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectEylemPlaniMaddesInStore),
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});
	}
}
