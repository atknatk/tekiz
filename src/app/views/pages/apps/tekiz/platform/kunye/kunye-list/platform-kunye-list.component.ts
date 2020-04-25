// Angular
import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	ChangeDetectionStrategy,
	OnDestroy,
} from "@angular/core";
// Material
import { SelectionModel } from "@angular/cdk/collections";
import {
	MatPaginator,
	MatSort,
	MatSnackBar,
	MatDialog,
} from "@angular/material";
// RXJS
import {
	debounceTime,
	distinctUntilChanged,
	tap,
	skip,
	delay,
	take,
} from "rxjs/operators";
import { fromEvent, merge, Subscription, of } from "rxjs";
// Translate Module
import { TranslateService } from "@ngx-translate/core";
// NGRX
import { Store, ActionsSubject } from "@ngrx/store";
import { AppState } from "../../../../../../../core/reducers";
// CRUD
import {
	LayoutUtilsService,
	MessageType,
	QueryParamsModel,
} from "../../../../../../../core/_base/crud";
// Services and Models
import {
	PlatformKunyeModel,
	PlatformKunyesDataSource,
	PlatformKunyesPageRequested,
	OnePlatformKunyeDeleted,
	ManyPlatformKunyesDeleted,
	PlatformKunyesStatusUpdated,
} from "../../../../../../../core/tekiz";
// Components
import { PlatformKunyeEditDialogComponent } from "../kunye-edit/platform-kunye-edit.dialog.component";

// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/compgetItemCssClassByStatusonents/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	// tslint:disable-next-line:component-selector
	selector: "kt-platform-kunye-list",
	templateUrl: "./platform-kunye-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformKunyesListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: PlatformKunyesDataSource;
	displayedColumns = ["select", "id",  "country", "name", "owner", "actions"];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild("sort1", { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild("searchInput", { static: true }) searchInput: ElementRef;
	filterStatus = "";
	filterType = "";
	// Selection
	selection = new SelectionModel<PlatformKunyeModel>(true, []);
	platformKunyesResult: PlatformKunyeModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param dialog: MatDialog
	 * @param snackBar: MatSnackBar
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 */
	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>
	) {}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		const sortSubscription = this.sort.sortChange.subscribe(
			() => (this.paginator.pageIndex = 0)
		);
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(
			this.sort.sortChange,
			this.paginator.page
		)
			.pipe(tap(() => this.loadPlatformKunyesList()))
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(
			this.searchInput.nativeElement,
			"keyup"
		)
			.pipe(
				// tslint:disable-next-line:max-line-length
				debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
				distinctUntilChanged(), // This operator will eliminate duplicate values
				tap(() => {
					this.paginator.pageIndex = 0;
					this.loadPlatformKunyesList();
				})
			)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new PlatformKunyesDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject
			.pipe(skip(1), distinctUntilChanged())
			.subscribe((res) => {
				this.platformKunyesResult = res;
			});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined)
			.pipe(take(1), delay(1000))
			.subscribe(() => {
				// Remove this line, just loading imitation
				this.loadPlatformKunyesList();
			}); // Remove this line, just loading imitation
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach((el) => el.unsubscribe());
	}

	/**
	 * Load PlatformKunyes List from service through data-source
	 */
	loadPlatformKunyesList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		// Call request from server
		this.store.dispatch(
			new PlatformKunyesPageRequested({ page: queryParams })
		);
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		if (this.filterStatus && this.filterStatus.length > 0) {
			filter.status = +this.filterStatus;
		}

		if (this.filterType && this.filterType.length > 0) {
			filter.type = +this.filterType;
		}

		filter.lastName = searchText;
		if (!searchText) {
			return filter;
		}

		filter.firstName = searchText;
		filter.email = searchText;
		filter.ipAddress = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete platformKunye
	 *
	 * @param _item: PlatformKunyeModel
	 */
	deletePlatformKunye(_item: PlatformKunyeModel) {
		const _title: string = this.translate.instant(
			"ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.TITLE"
		);
		const _description: string = this.translate.instant(
			"ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.DESCRIPTION"
		);
		const _waitDesciption: string = this.translate.instant(
			"ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.WAIT_DESCRIPTION"
		);
		const _deleteMessage = this.translate.instant(
			"ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.MESSAGE"
		);

		const dialogRef = this.layoutUtilsService.deleteElement(
			_title,
			_description,
			_waitDesciption
		);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OnePlatformKunyeDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(
				_deleteMessage,
				MessageType.Delete
			);
		});
	}

	/**
	 * Delete selected platformKunyes
	 */
	deletePlatformKunyes() {
		const _title: string = this.translate.instant(
			"ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.TITLE"
		);
		const _description: string = this.translate.instant(
			"ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.DESCRIPTION"
		);
		const _waitDesciption: string = this.translate.instant(
			"ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.WAIT_DESCRIPTION"
		);
		const _deleteMessage = this.translate.instant(
			"ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.MESSAGE"
		);

		const dialogRef = this.layoutUtilsService.deleteElement(
			_title,
			_description,
			_waitDesciption
		);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			const idsForDeletion: number[] = [];
			for (let i = 0; i < this.selection.selected.length; i++) {
				idsForDeletion.push(this.selection.selected[i].id);
			}
			this.store.dispatch(
				new ManyPlatformKunyesDeleted({ ids: idsForDeletion })
			);
			this.layoutUtilsService.showActionNotification(
				_deleteMessage,
				MessageType.Delete
			);
			this.selection.clear();
		});
	}

	/**
	 * Fetch selected platformKunyes
	 */
	fetchPlatformKunyes() {
		const messages = [];
		this.selection.selected.forEach((elem) => {
			messages.push({
				text: `${elem.name}, ${elem.owner}`,
				id: elem.id.toString(),
				status: elem.status,
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Show UpdateStatuDialog for selected platformKunyes
	 */
	updateStatusForPlatformKunyes() {
		const _title = this.translate.instant(
			"ECOMMERCE.CUSTOMERS.UPDATE_STATUS.TITLE"
		);
		const _updateMessage = this.translate.instant(
			"ECOMMERCE.CUSTOMERS.UPDATE_STATUS.MESSAGE"
		);
		const _statuses = [
			{ value: 0, text: "Suspended" },
			{ value: 1, text: "Active" },
			{ value: 2, text: "Pending" },
		];
		const _messages = [];

		this.selection.selected.forEach((elem) => {
			_messages.push({
				text: `${elem.name}, ${elem.owner}`,
				id: elem.id.toString(),
				status: elem.status,
				statusTitle: this.getItemStatusString(elem.status),
				statusCssClass: this.getItemCssClassByStatus(elem.status),
			});
		});

		const dialogRef = this.layoutUtilsService.updateStatusForEntities(
			_title,
			_statuses,
			_messages
		);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				this.selection.clear();
				return;
			}

			this.store.dispatch(
				new PlatformKunyesStatusUpdated({
					status: +res,
					platformKunyes: this.selection.selected,
				})
			);

			this.layoutUtilsService.showActionNotification(
				_updateMessage,
				MessageType.Update,
				10000,
				true,
				true
			);
			this.selection.clear();
		});
	}

	/**
	 * Show add platformKunye dialog
	 */
	addPlatformKunye() {
		const newPlatformKunye = new PlatformKunyeModel();
		newPlatformKunye.clear(); // Set all defaults fields
		this.editPlatformKunye(newPlatformKunye);
	}

	/**
	 * Show Edit platformKunye dialog and save after success close result
	 * @param platformKunye: PlatformKunyeModel
	 */
	editPlatformKunye(platformKunye: PlatformKunyeModel) {
		let saveMessageTranslateParam = "ECOMMERCE.CUSTOMERS.EDIT.";
		saveMessageTranslateParam +=
			platformKunye.id > 0 ? "UPDATE_MESSAGE" : "ADD_MESSAGE";
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType =
			platformKunye.id > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(PlatformKunyeEditDialogComponent, {
			data: { platformKunye },
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(
				_saveMessage,
				_messageType
			);
			this.loadPlatformKunyesList();
		});
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.platformKunyesResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle all selections
	 */
	masterToggle() {
		if (
			this.selection.selected.length === this.platformKunyesResult.length
		) {
			this.selection.clear();
		} else {
			this.platformKunyesResult.forEach((row) =>
				this.selection.select(row)
			);
		}
	}

	/** UI */
	/**
	 * Retursn CSS Class Name by status
	 *
	 * @param status: number
	 */
	getItemCssClassByStatus(status: number = 0): string {
		switch (status) {
			case 0:
				return "danger";
			case 1:
				return "success";
			case 2:
				return "metal";
		}
		return "";
	}

	/**
	 * Returns Item Status in string
	 * @param status: number
	 */
	getItemStatusString(status: number = 0): string {
		switch (status) {
			case 0:
				return "Suspended";
			case 1:
				return "Active";
			case 2:
				return "Pending";
		}
		return "";
	}

	/**
	 * Returns CSS Class Name by type
	 * @param status: number
	 */
	getItemCssClassByType(status: number = 0): string {
		switch (status) {
			case 0:
				return "accent";
			case 1:
				return "primary";
			case 2:
				return "";
		}
		return "";
	}

	/**
	 * Returns Item Type in string
	 * @param status: number
	 */
	getItemTypeString(status: number = 0): string {
		switch (status) {
			case 0:
				return "Business";
			case 1:
				return "Individual";
		}
		return "";
	}
}
