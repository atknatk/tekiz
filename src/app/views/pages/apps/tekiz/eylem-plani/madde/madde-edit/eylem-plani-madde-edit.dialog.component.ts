// Angular
import {
	Component,
	OnInit,
	Inject,
	ChangeDetectionStrategy,
	ViewEncapsulation,
	OnDestroy,
} from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	Validators,
	FormControl,
} from "@angular/forms";
// Material
import {
	MatDialogRef,
	MAT_DIALOG_DATA,
	MatChipInputEvent,
} from "@angular/material";
// RxJS
import { Subscription, of, Observable } from "rxjs";
import {
	delay,
	skip,
	distinctUntilChanged,
	startWith,
	map,
} from "rxjs/operators";
// NGRX
import { Update } from "@ngrx/entity";
import { Store, select } from "@ngrx/store";
// State
import { AppState } from "../../../../../../../core/reducers";
// CRUD
import { QueryParamsModel } from "../../../../../../../core/_base/crud";
import {
	EylemPlaniMaddeModel,
	selectEylemPlaniMaddesActionLoading,
	EylemPlaniMaddeUpdated,
	EylemPlaniMaddeOnServerCreated,
	selectLastCreatedEylemPlaniMaddeId,
	EylemPlaniKunyesDataSource,
	EylemPlaniKunyesPageRequested,
} from "../../../../../../../core/tekiz";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
// Services and Models

@Component({
	// tslint:disable-next-line:component-selector
	selector: "kt-eylem-plani-madde-edit-dialog",
	templateUrl: "./eylem-plani-madde-edit.dialog.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class EylemPlaniMaddeEditDialogComponent implements OnInit, OnDestroy {
	// Public properties
	eylemPlaniMadde: EylemPlaniMaddeModel;
	eylemPlaniMaddeForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	AVAILABLE_KUNYE = [];
	filteredEylemPlan: Observable<string[]>;
	planArea: [];
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	// Private properties
	private subscriptions: Subscription[] = [];
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<EylemPlaniMaddeEditDialogComponent>
	 * @param data: any
	 * @param fb: FormBuilder
	 * @param store: Store<AppState>
	 * @param typesUtilsService: TypesUtilsService
	 */
	constructor(
		public dialogRef: MatDialogRef<EylemPlaniMaddeEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>
	) {}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.store
			.pipe(select(selectEylemPlaniMaddesActionLoading))
			.subscribe((res) => (this.viewLoading = res));
		this.eylemPlaniMadde = this.data.eylemPlaniMadde;

		const kunyeDataSource = new EylemPlaniKunyesDataSource(this.store);
		const entitiesSubscription = kunyeDataSource.entitySubject
			.pipe(skip(1), distinctUntilChanged())
			.subscribe((res) => {
				this.AVAILABLE_KUNYE = res;
				this.createForm();
			});
		this.subscriptions.push(entitiesSubscription);
		this.loadPlatformMaddesList();
	}

	loadPlatformMaddesList() {
		const queryParams = new QueryParamsModel({}, "asc", "name", 0, 100);
		this.store.dispatch(
			new EylemPlaniKunyesPageRequested({ page: queryParams })
		);
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach((el) => el.unsubscribe());
	}

	createForm() {
		this.eylemPlaniMaddeForm = this.fb.group({
			eylemPlan: [this.eylemPlaniMadde.eylemPlan, Validators.required],
			eylemArea: [this.eylemPlaniMadde.eylemArea, Validators.required],
			eylemNo: [this.eylemPlaniMadde.eylemNo, Validators.required],
			eylemName: [this.eylemPlaniMadde.eylemName, Validators.required],
			eylemDescription: [this.eylemPlaniMadde.eylemDescription],
			eylemStartDate: [this.eylemPlaniMadde.eylemStartDate],
			eylemEndDate: [this.eylemPlaniMadde.eylemEndDate],
			foreignResponsibleInstitution: new FormControl([
				...this.eylemPlaniMadde.foreignResponsibleInstitution,
			]),
			localResponsibleInstitution: new FormControl([
				...this.eylemPlaniMadde.localResponsibleInstitution,
			]),
			relatedInstitution: [this.eylemPlaniMadde.relatedInstitution],
			ownerInstitution: [this.eylemPlaniMadde.ownerInstitution],
		});

		this.filteredEylemPlan = this.eylemPlaniMaddeForm.controls.eylemPlan.valueChanges.pipe(
			startWith(""),
			map((val) => this.filterKunye(val.toString()))
		);

		this.eylemPlaniMaddeForm.controls.eylemPlan.valueChanges.subscribe(
			(res) => {
				const filtered = this.AVAILABLE_KUNYE.filter(
					(l) => l.planName === res
				);
				this.planArea = filtered.length > 0 ? filtered[0].areaName : [];
			}
		);
	}

	addForeignResponsibleInstitutionField(event: MatChipInputEvent) {
		if(this.foreignResponsibleInstitutionField === null) return;
			const input = event.input;
		const value = event.value;
		if ((value || "").trim()) {
			if (
				this.foreignResponsibleInstitutionField.value.filter(
					(l) => l === event.value
				).length === 0
			) {
				this.foreignResponsibleInstitutionField.value.push(event.value);
				this.foreignResponsibleInstitutionField.updateValueAndValidity();
			}
		}

		// Reset the input value
		if (input) {
			input.value = "";
		}
	}

	removeForeignResponsibleInstitutionField(value) {
		if(this.foreignResponsibleInstitutionField === null) return;
		this.foreignResponsibleInstitutionField.value.splice(
			this.foreignResponsibleInstitutionField.value.indexOf(value),
			1
		);
		this.foreignResponsibleInstitutionField.updateValueAndValidity();
	}

	get foreignResponsibleInstitutionField() {
		return this.eylemPlaniMaddeForm == null
			? null
			: this.eylemPlaniMaddeForm.get("foreignResponsibleInstitution");
	}

	addLocalResponsibleInstitutionField(event: MatChipInputEvent) {
		if(this.localResponsibleInstitutionField === null) return;
		const input = event.input;
		const value = event.value;
		if ((value || "").trim()) {
			if (
				this.localResponsibleInstitutionField.value.filter(
					(l) => l === event.value
				).length === 0
			) {
				this.localResponsibleInstitutionField.value.push(event.value);
				this.localResponsibleInstitutionField.updateValueAndValidity();
			}
		}

		// Reset the input value
		if (input) {
			input.value = "";
		}
	}

	removeLocalResponsibleInstitutionField(value) {
		if(this.localResponsibleInstitutionField === null) return;
		this.localResponsibleInstitutionField.value.splice(
			this.localResponsibleInstitutionField.value.indexOf(value),
			1
		);
		this.localResponsibleInstitutionField.updateValueAndValidity();
	}

	get localResponsibleInstitutionField() {
		return this.eylemPlaniMaddeForm == null
		? null
		: this.eylemPlaniMaddeForm.get("localResponsibleInstitution");
	}

	filterKunye(val: string): string[] {
		return this.AVAILABLE_KUNYE.filter((option) =>
			option.planName.toLowerCase().includes(val.toLowerCase())
		);
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {
		if (this.eylemPlaniMadde.id > 0) {
			// return `EylemPlani Künye Düzenle '${this.eylemPlaniMadde.name} ${
			//     this.eylemPlaniMadde.owner
			// }'`;
		}

		return "Yeni Eylem Planı Maddesi";
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.eylemPlaniMaddeForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared eylemPlaniMadde
	 */
	prepareEylemPlaniMadde(): EylemPlaniMaddeModel {
		const controls = this.eylemPlaniMaddeForm.controls;
		const _eylemPlaniMadde = new EylemPlaniMaddeModel();
		_eylemPlaniMadde.id = this.eylemPlaniMadde.id;
		_eylemPlaniMadde.eylemPlan = controls.eylemPlan.value;
		_eylemPlaniMadde.eylemArea = controls.eylemArea.value;
		_eylemPlaniMadde.eylemNo = controls.eylemNo.value;
		_eylemPlaniMadde.eylemName = controls.eylemName.value;
		_eylemPlaniMadde.eylemDescription = controls.eylemDescription.value;
		_eylemPlaniMadde.eylemStartDate = controls.eylemStartDate.value;
		_eylemPlaniMadde.eylemEndDate = controls.eylemEndDate.value;
		_eylemPlaniMadde.foreignResponsibleInstitution =
			controls.foreignResponsibleInstitution.value;
		_eylemPlaniMadde.localResponsibleInstitution =
			controls.localResponsibleInstitution.value;
		_eylemPlaniMadde.relatedInstitution = controls.relatedInstitution.value;
		_eylemPlaniMadde.ownerInstitution = controls.ownerInstitution.value;
		_eylemPlaniMadde.status = 0;
		return _eylemPlaniMadde;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.eylemPlaniMaddeForm.controls;
		/** check form */
		if (this.eylemPlaniMaddeForm.invalid) {
			Object.keys(controls).forEach((controlName) =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedEylemPlaniMadde = this.prepareEylemPlaniMadde();
		if (editedEylemPlaniMadde.id > 0) {
			this.updateEylemPlaniMadde(editedEylemPlaniMadde);
		} else {
			this.createEylemPlaniMadde(editedEylemPlaniMadde);
		}
	}

	/**
	 * Update eylemPlaniMadde
	 *
	 * @param _eylemPlaniMadde: EylemPlaniMaddeModel
	 */
	updateEylemPlaniMadde(_eylemPlaniMadde: EylemPlaniMaddeModel) {
		const updateEylemPlaniMadde: Update<EylemPlaniMaddeModel> = {
			id: _eylemPlaniMadde.id,
			changes: _eylemPlaniMadde,
		};
		this.store.dispatch(
			new EylemPlaniMaddeUpdated({
				partialEylemPlaniMadde: updateEylemPlaniMadde,
				eylemPlaniMadde: _eylemPlaniMadde,
			})
		);

		// Remove this line
		of(undefined)
			.pipe(delay(1000))
			.subscribe(() =>
				this.dialogRef.close({ _eylemPlaniMadde, isEdit: true })
			);
		// Uncomment this line
		// this.dialogRef.close({ _eylemPlaniMadde, isEdit: true }
	}

	/**
	 * Create eylemPlaniMadde
	 *
	 * @param _eylemPlaniMadde: EylemPlaniMaddeModel
	 */
	createEylemPlaniMadde(_eylemPlaniMadde: EylemPlaniMaddeModel) {
		this.store.dispatch(
			new EylemPlaniMaddeOnServerCreated({
				eylemPlaniMadde: _eylemPlaniMadde,
			})
		);
		const componentSubscriptions = this.store
			.pipe(
				select(selectLastCreatedEylemPlaniMaddeId),
				delay(1000) // Remove this line
			)
			.subscribe((res) => {
				if (!res) {
					return;
				}

				this.dialogRef.close({ _eylemPlaniMadde, isEdit: false });
			});
		this.subscriptions.push(componentSubscriptions);
	}

	/** Alect Close event */
	onAlertClose() {
		this.hasFormErrors = false;
	}
}
