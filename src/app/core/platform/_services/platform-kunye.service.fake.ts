// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
// Lodash
import { each } from 'lodash';
// CRUD
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '../../_base/crud';
// Models
import { PlatformKunyeModel } from '../_models/platform-kunye.model';

const API_CUSTOMERS_URL = 'api/platformKunyes';

// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class PlatformKunyesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new platformKunye to the server
	createPlatformKunye(platformKunye: PlatformKunyeModel): Observable<PlatformKunyeModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<PlatformKunyeModel>(API_CUSTOMERS_URL, platformKunye, { headers: httpHeaders});
	}

	// READ
	getAllPlatformKunyes(): Observable<PlatformKunyeModel[]> {
		return this.http.get<PlatformKunyeModel[]>(API_CUSTOMERS_URL);
	}

	getPlatformKunyeById(platformKunyeId: number): Observable<PlatformKunyeModel> {
		return this.http.get<PlatformKunyeModel>(API_CUSTOMERS_URL + `/${platformKunyeId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findPlatformKunyes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_CUSTOMERS_URL;
		return this.http.get<PlatformKunyeModel[]>(API_CUSTOMERS_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'type']);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the platformKunye on the server
	updatePlatformKunye(platformKunye: PlatformKunyeModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_CUSTOMERS_URL, platformKunye, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForPlatformKunye(platformKunyes: PlatformKunyeModel[], status: number): Observable<any> {
		const tasks$ = [];
		each(platformKunyes, element => {
			const _platformKunye = Object.assign({}, element);
			_platformKunye.status = status;
			tasks$.push(this.updatePlatformKunye(_platformKunye));
		});
		return forkJoin(tasks$);
	}

	// DELETE => delete the platformKunye from the server
	deletePlatformKunye(platformKunyeId: number): Observable<any> {
		const url = `${API_CUSTOMERS_URL}/${platformKunyeId}`;
		return this.http.delete<PlatformKunyeModel>(url);
	}

	deletePlatformKunyes(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		// tslint:disable-next-line:prefer-const
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deletePlatformKunye(ids[i]));
		}
		return forkJoin(tasks$);
	}
}
