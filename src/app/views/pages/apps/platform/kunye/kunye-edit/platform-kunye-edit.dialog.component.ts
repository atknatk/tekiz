

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
import { PlatformKunyeModel, PlatformKunyeUpdated, PlatformKunyeOnServerCreated, selectLastCreatedPlatformKunyeId, selectPlatformKunyesPageLoading, selectPlatformKunyesActionLoading } from '../../../../../../core/platform';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'kt-platform-kunye-edit-dialog',
    templateUrl: './platform-kunye-edit.dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class PlatformKunyeEditDialogComponent implements OnInit, OnDestroy {
    // Public properties
    platformKunye: PlatformKunyeModel;
    platformKunyeForm: FormGroup;
    hasFormErrors = false;
    viewLoading = false;
    // Private properties
    private componentSubscriptions: Subscription;

    /**
     * Component constructor
     *
     * @param dialogRef: MatDialogRef<PlatformKunyeEditDialogComponent>
     * @param data: any
     * @param fb: FormBuilder
     * @param store: Store<AppState>
     * @param typesUtilsService: TypesUtilsService
     */
    constructor(public dialogRef: MatDialogRef<PlatformKunyeEditDialogComponent>,
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
        this.store.pipe(select(selectPlatformKunyesActionLoading)).subscribe(res => this.viewLoading = res);
        this.platformKunye = this.data.platformKunye;
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
        this.platformKunyeForm = this.fb.group({
            name: [this.platformKunye.name, Validators.required],
            owner: [this.platformKunye.owner, Validators.required],
            summary: [ this.platformKunye.summary ],
        });
    }

    /**
     * Returns page title
     */
    getTitle(): string {
        if (this.platformKunye.id > 0) {
            return `Platform Künye Düzenle '${this.platformKunye.name} ${
                this.platformKunye.owner
            }'`;
        }

        return 'Yeni Platform Künye';
    }

    /**
     * Check control is invalid
     * @param controlName: string
     */
    isControlInvalid(controlName: string): boolean {
        const control = this.platformKunyeForm.controls[controlName];
        const result = control.invalid && control.touched;
        return result;
    }

    /** ACTIONS */

    /**
     * Returns prepared platformKunye
     */
    preparePlatformKunye(): PlatformKunyeModel {
        const controls = this.platformKunyeForm.controls;
        const _platformKunye = new PlatformKunyeModel();
        _platformKunye.id = this.platformKunye.id;
        _platformKunye.name = controls.name.value;
        _platformKunye.owner = controls.owner.value;
        _platformKunye.summary = controls.summary.value;
        return _platformKunye;
    }

    /**
     * On Submit
     */
    onSubmit() {
        this.hasFormErrors = false;
        const controls = this.platformKunyeForm.controls;
        /** check form */
        if (this.platformKunyeForm.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }

        const editedPlatformKunye = this.preparePlatformKunye();
        if (editedPlatformKunye.id > 0) {
            this.updatePlatformKunye(editedPlatformKunye);
        } else {
            this.createPlatformKunye(editedPlatformKunye);
        }
    }

    /**
     * Update platformKunye
     *
     * @param _platformKunye: PlatformKunyeModel
     */
    updatePlatformKunye(_platformKunye: PlatformKunyeModel) {
        const updatePlatformKunye: Update<PlatformKunyeModel> = {
            id: _platformKunye.id,
            changes: _platformKunye
        };
        this.store.dispatch(new PlatformKunyeUpdated({
            partialPlatformKunye: updatePlatformKunye,
            platformKunye: _platformKunye
        }));

        // Remove this line
        of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _platformKunye, isEdit: true }));
        // Uncomment this line
        // this.dialogRef.close({ _platformKunye, isEdit: true }
    }

    /**
     * Create platformKunye
     *
     * @param _platformKunye: PlatformKunyeModel
     */
    createPlatformKunye(_platformKunye: PlatformKunyeModel) {
        this.store.dispatch(new PlatformKunyeOnServerCreated({ platformKunye: _platformKunye }));
        this.componentSubscriptions = this.store.pipe(
            select(selectLastCreatedPlatformKunyeId),
            delay(1000), // Remove this line
        ).subscribe(res => {
            if (!res) {
                return;
            }

            this.dialogRef.close({ _platformKunye, isEdit: false });
        });
    }

    /** Alect Close event */
    onAlertClose($event) {
        this.hasFormErrors = false;
    }
}

