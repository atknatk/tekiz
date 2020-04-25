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
import { EylemPlaniKunyeModel } from '../_models/eylem-plani-kunye.model';

const API_CUSTOMERS_URL = 'api/eylemPlaniKunyes';

// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class EylemPlaniKunyesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new eylemPlaniKunye to the server
	createEylemPlaniKunye(eylemPlaniKunye: EylemPlaniKunyeModel): Observable<EylemPlaniKunyeModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<EylemPlaniKunyeModel>(API_CUSTOMERS_URL, eylemPlaniKunye, { headers: httpHeaders});
	}

	// READ
	getAllEylemPlaniKunyes(): Observable<EylemPlaniKunyeModel[]> {
		return this.http.get<EylemPlaniKunyeModel[]>(API_CUSTOMERS_URL);
	}

	getEylemPlaniKunyeById(eylemPlaniKunyeId: number): Observable<EylemPlaniKunyeModel> {
		return this.http.get<EylemPlaniKunyeModel>(API_CUSTOMERS_URL + `/${eylemPlaniKunyeId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findEylemPlaniKunyes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_CUSTOMERS_URL;
		return this.http.get<EylemPlaniKunyeModel[]>(API_CUSTOMERS_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'type']);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the eylemPlaniKunye on the server
	updateEylemPlaniKunye(eylemPlaniKunye: EylemPlaniKunyeModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_CUSTOMERS_URL, eylemPlaniKunye, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForEylemPlaniKunye(eylemPlaniKunyes: EylemPlaniKunyeModel[], status: number): Observable<any> {
		const tasks$ = [];
		each(eylemPlaniKunyes, element => {
			const _eylemPlaniKunye = Object.assign({}, element);
		//	_eylemPlaniKunye.status = status;
			tasks$.push(this.updateEylemPlaniKunye(_eylemPlaniKunye));
		});
		return forkJoin(tasks$);
	}

	// DELETE => delete the eylemPlaniKunye from the server
	deleteEylemPlaniKunye(eylemPlaniKunyeId: number): Observable<any> {
		const url = `${API_CUSTOMERS_URL}/${eylemPlaniKunyeId}`;
		return this.http.delete<EylemPlaniKunyeModel>(url);
	}

	deleteEylemPlaniKunyes(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		// tslint:disable-next-line:prefer-const
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteEylemPlaniKunye(ids[i]));
		}
		return forkJoin(tasks$);
	}
}
