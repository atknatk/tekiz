// Angular
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
// Translate Module
import { TranslateModule } from "@ngx-translate/core";
// NGRX
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
// UI
import { PartialsModule } from "../../../partials/partials.module";
// Core
import { FakeApiService } from "../../../../core/_base/layout";
// Auth
import { ModuleGuard } from "../../../../core/auth";
// Core => Services
import {
	platformKunyesReducer,
	PlatformKunyeEffects,
	PlatformKunyesService,
	eylemPlaniKunyesReducer,
	EylemPlaniKunyeEffects,
	EylemPlaniKunyesService,
} from "../../../../core/tekiz";
// Core => Utils
import {
	HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService,
} from "../../../../core/_base/crud";
// Shared
import {
	ActionNotificationComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent,
} from "../../../partials/content/crud";
// Components
import { TekizComponent } from "./tekiz.component";

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
	MatTooltipModule,
} from "@angular/material";
import { environment } from "../../../../../environments/environment";
import {
	NgbProgressbarModule,
	NgbProgressbarConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxPermissionsModule } from "ngx-permissions";
import { PlatformKunyesListComponent } from "./platform/kunye/kunye-list/platform-kunye-list.component";
import { EylemPlaniKunyesListComponent } from "./eylem-plani/kunye/kunye-list/eylem-plani-kunye-list.component";
import { PlatformKunyeEditDialogComponent } from "./platform/kunye/kunye-edit/platform-kunye-edit.dialog.component";
import { EylemPlaniKunyeEditDialogComponent } from "./eylem-plani/kunye/kunye-edit/eylem-plani-kunye-edit.dialog.component";

// tslint:disable-next-line:class-name
const routes: Routes = [
	{
		path: "",
		component: TekizComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: "",
				redirectTo: "platform-kunye",
				pathMatch: "full",
			},
			{
				path: "platform-kunye",
				component: PlatformKunyesListComponent,
			},
			{
				path: "eylem-plani-kunye",
				component: EylemPlaniKunyesListComponent,
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
		],
	},
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
		environment.isMockEnabled
			? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
					passThruUnknownUrl: true,
					dataEncapsulation: false,
			  })
			: [],
		StoreModule.forFeature("platformKunyes", platformKunyesReducer),
		EffectsModule.forFeature([PlatformKunyeEffects]),
		StoreModule.forFeature("eylemPlaniKunyes", eylemPlaniKunyesReducer),
		EffectsModule.forFeature([EylemPlaniKunyeEffects]),
	],
	providers: [
		ModuleGuard,
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true,
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: "kt-mat-dialog-container__wrapper",
				height: "auto",
				width: "900px",
			},
		},
		TypesUtilsService,
		LayoutUtilsService,
		HttpUtilsService,
		PlatformKunyesService,
		EylemPlaniKunyesService,
		TypesUtilsService,
		LayoutUtilsService,
	],
	entryComponents: [
		ActionNotificationComponent,
		PlatformKunyeEditDialogComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		EylemPlaniKunyeEditDialogComponent,
	],
	declarations: [
		TekizComponent,
		// Platform Kunye
		PlatformKunyesListComponent,
		PlatformKunyeEditDialogComponent,
		// Orders
		// Platform Kunye
		EylemPlaniKunyesListComponent,
		EylemPlaniKunyeEditDialogComponent,
	],
})
export class TekizModule {}
