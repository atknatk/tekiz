

// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../../../core/_base/crud';
// Services and Models
import { EylemPlaniKunyeModel, EylemPlaniKunyeUpdated, EylemPlaniKunyeOnServerCreated, selectLastCreatedEylemPlaniKunyeId, selectEylemPlaniKunyesPageLoading, selectEylemPlaniKunyesActionLoading } from '../../../../../../core/eylem-plani';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'kt-eylem-plani-kunye-edit-dialog',
    templateUrl: './eylem-plani-kunye-edit.dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class EylemPlaniKunyeEditDialogComponent implements OnInit, OnDestroy {
    // Public properties
    eylemPlaniKunye: EylemPlaniKunyeModel;
    eylemPlaniKunyeForm: FormGroup;
    hasFormErrors = false;
    viewLoading = false;
    // Private properties
    private componentSubscriptions: Subscription;

    /**
     * Component constructor
     *
     * @param dialogRef: MatDialogRef<EylemPlaniKunyeEditDialogComponent>
     * @param data: any
     * @param fb: FormBuilder
     * @param store: Store<AppState>
     * @param typesUtilsService: TypesUtilsService
     */
    constructor(public dialogRef: MatDialogRef<EylemPlaniKunyeEditDialogComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: any,
                   private fb: FormBuilder,
                   private store: Store<AppState>,
                   private typesUtilsService: TypesUtilsService) {
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit() {
        this.store.pipe(select(selectEylemPlaniKunyesActionLoading)).subscribe(res => this.viewLoading = res);
        this.eylemPlaniKunye = this.data.eylemPlaniKunye;
        this.createForm();
    }

    /**
     * On destroy
     */
    ngOnDestroy() {
        if (this.componentSubscriptions) {
            this.componentSubscriptions.unsubscribe();
        }
    }

    createForm() {
        this.eylemPlaniKunyeForm = this.fb.group({
            // name: [this.eylemPlaniKunye.name, Validators.required],
            // owner: [this.eylemPlaniKunye.owner, Validators.required],
            // summary: [ this.eylemPlaniKunye.summary ],
        });
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

        return 'Yeni EylemPlani Künye';
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
            Object.keys(controls).forEach(controlName =>
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
            changes: _eylemPlaniKunye
        };
        this.store.dispatch(new EylemPlaniKunyeUpdated({
            partialEylemPlaniKunye: updateEylemPlaniKunye,
            eylemPlaniKunye: _eylemPlaniKunye
        }));

        // Remove this line
        of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _eylemPlaniKunye, isEdit: true }));
        // Uncomment this line
        // this.dialogRef.close({ _eylemPlaniKunye, isEdit: true }
    }

    /**
     * Create eylemPlaniKunye
     *
     * @param _eylemPlaniKunye: EylemPlaniKunyeModel
     */
    createEylemPlaniKunye(_eylemPlaniKunye: EylemPlaniKunyeModel) {
        this.store.dispatch(new EylemPlaniKunyeOnServerCreated({ eylemPlaniKunye: _eylemPlaniKunye }));
        this.componentSubscriptions = this.store.pipe(
            select(selectLastCreatedEylemPlaniKunyeId),
            delay(1000), // Remove this line
        ).subscribe(res => {
            if (!res) {
                return;
            }

            this.dialogRef.close({ _eylemPlaniKunye, isEdit: false });
        });
    }

    /** Alect Close event */
    onAlertClose($event) {
        this.hasFormErrors = false;
    }
}

