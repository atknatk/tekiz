// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// Translate Module
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// UI
import { PartialsModule } from '../../../partials/partials.module';
// Core
import { FakeApiService } from '../../../../core/_base/layout';
// Auth
import { ModuleGuard } from '../../../../core/auth';
// Core => Services
import {
	eylemPlaniKunyesReducer,
	EylemPlaniKunyeEffects,
	EylemPlaniKunyesService,
} from '../../../../core/eylem-plani';
// Core => Utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';
// Shared
import {
	ActionNotificationComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent
} from '../../../partials/content/crud';
// Components
import { EylemPlaniComponent } from './eylem-plani.component';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule
} from '@angular/material';
import { environment } from '../../../../../environments/environment';
import { NgbProgressbarModule, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { EylemPlaniKunyesListComponent } from './kunye/kunye-list/eylem-plani-kunye-list.component';
import { EylemPlaniKunyeEditDialogComponent } from './kunye/kunye-edit/eylem-plani-kunye-edit.dialog.component';

// tslint:disable-next-line:class-name
const routes: Routes = [
	{
		path: '',
		component: EylemPlaniComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: '',
				redirectTo: 'kunye',
				pathMatch: 'full'
			},
			{
				path: 'kunye',
				component: EylemPlaniKunyesListComponent
			},
			// {
			// 	path: 'orders',
			// 	component: OrdersListComponent
			// },
			// {
			// 	path: 'products',
			// 	component: ProductsListComponent,
			// },
			// {
			// 	path: 'products/add',
			// 	component: ProductEditComponent
			// },
			// {
			// 	path: 'products/edit',
			// 	component: ProductEditComponent
			// },
			// {
			// 	path: 'products/edit/:id',
			// 	component: ProductEditComponent
			// },
		]
	}
];

@NgModule({
	imports: [
		MatDialogModule,
		CommonModule,
		HttpClientModule,
		PartialsModule,
		NgxPermissionsModule.forChild(),
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
        MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
		NgbProgressbarModule,
		environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
			passThruUnknownUrl: true,
        	dataEncapsulation: false
		}) : [],
		StoreModule.forFeature('eylemPlaniKunyes', eylemPlaniKunyesReducer),
		EffectsModule.forFeature([EylemPlaniKunyeEffects]),
	],
	providers: [
		ModuleGuard,
		InterceptService,
      	{
        	provide: HTTP_INTERCEPTORS,
       	 	useClass: InterceptService,
        	multi: true
      	},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		TypesUtilsService,
		LayoutUtilsService,
		HttpUtilsService,
		EylemPlaniKunyesService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
		EylemPlaniKunyeEditDialogComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
	],
	declarations: [
		EylemPlaniComponent,
		// EylemPlaniKunyes
		EylemPlaniKunyesListComponent,
		EylemPlaniKunyeEditDialogComponent,

	]
})
export class EylemPlaniModule { }
