// Angular
import {
	Component,
	OnInit,
	Inject,
	ChangeDetectionStrategy,
	ViewEncapsulation,
	OnDestroy,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// Material
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
// RxJS
import { Subscription, of, Observable } from "rxjs";
import { delay, skip, distinctUntilChanged, take, startWith, map } from "rxjs/operators";
// NGRX
import { Update } from "@ngrx/entity";
import { Store, select } from "@ngrx/store";
// State
import { AppState } from "../../../../../../../core/reducers";
// CRUD
import {
	TypesUtilsService,
	QueryParamsModel,
} from "../../../../../../../core/_base/crud";
import {
	EylemPlaniKunyeModel,
	selectEylemPlaniKunyesActionLoading,
	PlatformKunyesDataSource,
	EylemPlaniKunyeUpdated,
	EylemPlaniKunyeOnServerCreated,
	selectLastCreatedEylemPlaniKunyeId,
	PlatformKunyesPageRequested,
} from "../../../../../../../core/tekiz";
// Services and Models

@Component({
	// tslint:disable-next-line:component-selector
	selector: "kt-eylem-plani-kunye-edit-dialog",
	templateUrl: "./eylem-plani-kunye-edit.dialog.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class EylemPlaniKunyeEditDialogComponent implements OnInit, OnDestroy {
	// Public properties
	eylemPlaniKunye: EylemPlaniKunyeModel;
	eylemPlaniKunyeForm: FormGroup;
	hasFormErrors = false;
    viewLoading = false;
    AVAILABLE_KEK = [];
    filteredPlatformKunyes: Observable<string[]>;
	// Private properties
	private subscriptions: Subscription[] = [];
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<EylemPlaniKunyeEditDialogComponent>
	 * @param data: any
	 * @param fb: FormBuilder
	 * @param store: Store<AppState>
	 * @param typesUtilsService: TypesUtilsService
	 */
	constructor(
		public dialogRef: MatDialogRef<EylemPlaniKunyeEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService
	) {}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.store
			.pipe(select(selectEylemPlaniKunyesActionLoading))
			.subscribe((res) => (this.viewLoading = res));
		this.eylemPlaniKunye = this.data.eylemPlaniKunye;
	
		const dataSource = new PlatformKunyesDataSource(this.store);
		const entitiesSubscription = dataSource.entitySubject
			.pipe(skip(1), distinctUntilChanged())
			.subscribe((res) => {
                this.AVAILABLE_KEK = res.map( l => l.name);
                this.createForm();
			});
		this.subscriptions.push(entitiesSubscription);
		this.loadPlatformKunyesList();
	}

	loadPlatformKunyesList() {
		const queryParams = new QueryParamsModel({}, "asc", "name", 0, 100);
		this.store.dispatch(
			new PlatformKunyesPageRequested({ page: queryParams })
		);
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach((el) => el.unsubscribe());
	}

	createForm() {
		this.eylemPlaniKunyeForm = this.fb.group({
		//	country: [this.eylemPlaniKunye.country, Validators.required],
			kek: [this.eylemPlaniKunye.kek, Validators.required],
			// // owner: [this.eylemPlaniKunye.owner, Validators.required],
			// // summary: [ this.eylemPlaniKunye.summary ],
        });
        
        this.filteredPlatformKunyes = this.eylemPlaniKunyeForm.controls.kek.valueChanges
			.pipe(
				startWith(''),
                map(val => this.filterKek(val.toString()))
            );
            
    }
    
    filterKek(val: string): string[] {
		return this.AVAILABLE_KEK.filter(option =>
			option.toLowerCase().includes(val.toLowerCase()));
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {
		if (this.eylemPlaniKunye.id > 0) {
			// return `EylemPlani Künye Düzenle '${this.eylemPlaniKunye.name} ${
			//     this.eylemPlaniKunye.owner
			// }'`;
		}

		return "Yeni EylemPlani Künye";
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.eylemPlaniKunyeForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared eylemPlaniKunye
	 */
	prepareEylemPlaniKunye(): EylemPlaniKunyeModel {
		const controls = this.eylemPlaniKunyeForm.controls;
		const _eylemPlaniKunye = new EylemPlaniKunyeModel();
		_eylemPlaniKunye.id = this.eylemPlaniKunye.id;
		// _eylemPlaniKunye.name = controls.name.value;
		// _eylemPlaniKunye.owner = controls.owner.value;
		// _eylemPlaniKunye.summary = controls.summary.value;
		return _eylemPlaniKunye;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.eylemPlaniKunyeForm.controls;
		/** check form */
		if (this.eylemPlaniKunyeForm.invalid) {
			Object.keys(controls).forEach((controlName) =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedEylemPlaniKunye = this.prepareEylemPlaniKunye();
		if (editedEylemPlaniKunye.id > 0) {
			this.updateEylemPlaniKunye(editedEylemPlaniKunye);
		} else {
			this.createEylemPlaniKunye(editedEylemPlaniKunye);
		}
	}

	/**
	 * Update eylemPlaniKunye
	 *
	 * @param _eylemPlaniKunye: EylemPlaniKunyeModel
	 */
	updateEylemPlaniKunye(_eylemPlaniKunye: EylemPlaniKunyeModel) {
		const updateEylemPlaniKunye: Update<EylemPlaniKunyeModel> = {
			id: _eylemPlaniKunye.id,
			changes: _eylemPlaniKunye,
		};
		this.store.dispatch(
			new EylemPlaniKunyeUpdated({
				partialEylemPlaniKunye: updateEylemPlaniKunye,
				eylemPlaniKunye: _eylemPlaniKunye,
			})
		);

		// Remove this line
		of(undefined)
			.pipe(delay(1000))
			.subscribe(() =>
				this.dialogRef.close({ _eylemPlaniKunye, isEdit: true })
			);
		// Uncomment this line
		// this.dialogRef.close({ _eylemPlaniKunye, isEdit: true }
	}

	/**
	 * Create eylemPlaniKunye
	 *
	 * @param _eylemPlaniKunye: EylemPlaniKunyeModel
	 */
	createEylemPlaniKunye(_eylemPlaniKunye: EylemPlaniKunyeModel) {
		this.store.dispatch(
			new EylemPlaniKunyeOnServerCreated({
				eylemPlaniKunye: _eylemPlaniKunye,
			})
		);
		const componentSubscriptions = this.store
			.pipe(
				select(selectLastCreatedEylemPlaniKunyeId),
				delay(1000) // Remove this line
			)
			.subscribe((res) => {
				if (!res) {
					return;
				}

				this.dialogRef.close({ _eylemPlaniKunye, isEdit: false });
			});
		this.subscriptions.push(componentSubscriptions);
	}

	/** Alect Close event */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
