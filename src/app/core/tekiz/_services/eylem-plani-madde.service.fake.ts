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
import { EylemPlaniMaddeModel } from '../_models/eylem-plani-madde.model';

const API_CUSTOMERS_URL = 'api/eylemPlaniMaddes';

// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class EylemPlaniMaddesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new eylemPlaniMadde to the server
	createEylemPlaniMadde(eylemPlaniMadde: EylemPlaniMaddeModel): Observable<EylemPlaniMaddeModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<EylemPlaniMaddeModel>(API_CUSTOMERS_URL, eylemPlaniMadde, { headers: httpHeaders});
	}

	// READ
	getAllEylemPlaniMaddes(): Observable<EylemPlaniMaddeModel[]> {
		return this.http.get<EylemPlaniMaddeModel[]>(API_CUSTOMERS_URL);
	}

	getEylemPlaniMaddeById(eylemPlaniMaddeId: number): Observable<EylemPlaniMaddeModel> {
		return this.http.get<EylemPlaniMaddeModel>(API_CUSTOMERS_URL + `/${eylemPlaniMaddeId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findEylemPlaniMaddes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_CUSTOMERS_URL;
		return this.http.get<EylemPlaniMaddeModel[]>(API_CUSTOMERS_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'type']);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the eylemPlaniMadde on the server
	updateEylemPlaniMadde(eylemPlaniMadde: EylemPlaniMaddeModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_CUSTOMERS_URL, eylemPlaniMadde, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForEylemPlaniMadde(eylemPlaniMaddes: EylemPlaniMaddeModel[], status: number): Observable<any> {
		const tasks$ = [];
		each(eylemPlaniMaddes, element => {
			const _eylemPlaniMadde = Object.assign({}, element);
		//	_eylemPlaniMadde.status = status;
			tasks$.push(this.updateEylemPlaniMadde(_eylemPlaniMadde));
		});
		return forkJoin(tasks$);
	}

	// DELETE => delete the eylemPlaniMadde from the server
	deleteEylemPlaniMadde(eylemPlaniMaddeId: number): Observable<any> {
		const url = `${API_CUSTOMERS_URL}/${eylemPlaniMaddeId}`;
		return this.http.delete<EylemPlaniMaddeModel>(url);
	}

	deleteEylemPlaniMaddes(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		// tslint:disable-next-line:prefer-const
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteEylemPlaniMadde(ids[i]));
		}
		return forkJoin(tasks$);
	}
}
