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
	map,
} from "rxjs/operators";
import { fromEvent, merge, Subscription, of, Observable } from "rxjs";
// Translate Module
import { TranslateService } from "@ngx-translate/core";
// NGRX
import { Store, ActionsSubject, select } from "@ngrx/store";
import { AppState } from "../../../../../../../core/reducers";
// CRUD
import {
	LayoutUtilsService,
	MessageType,
	QueryParamsModel,
} from "../../../../../../../core/_base/crud";
// Components
import { EylemPlaniMaddeEditDialogComponent } from "../madde-edit/eylem-plani-madde-edit.dialog.component";
import {
	EylemPlaniMaddesDataSource,
	EylemPlaniMaddeModel,
	EylemPlaniMaddesPageRequested,
	OneEylemPlaniMaddeDeleted,
	ManyEylemPlaniMaddesDeleted,
	EylemPlaniMaddesStatusUpdated,
} from "../../../../../../../core/tekiz";
import { NgxPermissionsService } from "ngx-permissions";
import { User, currentUser } from "../../../../../../../core/auth";

@Component({
	// tslint:disable-next-line:component-selector
	selector: "kt-eylem-plani-madde-list",
	templateUrl: "./eylem-plani-madde-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EylemPlaniMaddesListComponent implements OnInit, OnDestroy {
	dataSource: EylemPlaniMaddesDataSource;
	displayedColumns = [
		"select",
		"eylemPlan",
		"eylemArea",
		"eylemNo",
		"eylemName",
		"status",
	];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild("sort1", { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild("searchInput", { static: true }) searchInput: ElementRef;
	filterStatus = "";
	filterType = "";
	// Selection
	selection = new SelectionModel<EylemPlaniMaddeModel>(true, []);
	eylemPlaniMaddesResult: EylemPlaniMaddeModel[] = [];
	user$: Observable<User>;
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
		private store: Store<AppState>,
		private permissionsService: NgxPermissionsService
	) {}

	/**
	 * On init
	 */
	ngOnInit() {
		this.dataSource = new EylemPlaniMaddesDataSource(this.store);

		this.user$ = this.store.pipe(select(currentUser));
		this.user$.subscribe((user) => {
			console.log(user);
			this.permissionsService
				.hasPermission("canOnayEylemPlaniMadde")
				.then((res) => {
					this.permissionsService
						.hasPermission("canEditEylemPlaniMadde")
						.then((res2) => {
							if (res || res2) {
								if (
									this.displayedColumns.indexOf("actions") ===
									-1
								)
									this.displayedColumns.push("actions");
							}

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
								.pipe(
									tap(() =>
										this.loadEylemPlaniMaddesList(user)
									)
								)
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
										this.loadEylemPlaniMaddesList(user);
									})
								)
								.subscribe();
							this.subscriptions.push(searchSubscription);

							// Init DataSource

							const entitiesSubscription = this.dataSource.entitySubject
								.pipe(skip(1), distinctUntilChanged())
								.pipe(
									map((res) => {
										// if (
										// 	user.roles.indexOf(2) > -1 &&
										// 	user.companyName === "T.C. Ticaret Bakanlığı"
										// ) {
										// 	return res.filter(l => (l.status === 4 || l.status === 6));
										// }
										return res;
									})
								)
								.subscribe((res) => {
									this.eylemPlaniMaddesResult = res;
								});
							this.subscriptions.push(entitiesSubscription);
							// First load
							of(undefined)
								.pipe(take(1), delay(1000))
								.subscribe(() => {
									// Remove this line, just loading imitation
									this.loadEylemPlaniMaddesList(user);
								}); // Remove this line, just loading imitation
						});
				});
		});
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach((el) => el.unsubscribe());
	}

	/**
	 * Load EylemPlaniMaddes List from service through data-source
	 */
	loadEylemPlaniMaddesList(user: User) {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(user),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);

		if (
			user.roles.indexOf(2) > -1 &&
			user.companyName === "T.C. Ticaret Bakanlığı"
		) {
			queryParams.status = [4, 6];
		}

		// Call request from server
		this.store.dispatch(
			new EylemPlaniMaddesPageRequested({ page: queryParams })
		);
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(user: User): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		// filter.firstName = searchText;
		// filter.email = searchText;
		// filter.ipAddress = searchText;

		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete eylemPlaniMadde
	 *
	 * @param _item: EylemPlaniMaddeModel
	 */
	deleteEylemPlaniMadde(_item: EylemPlaniMaddeModel) {
		const _title = "Eylem Planı Maddesi Sil";
		const _description =
			"Kalıcı olarak Eylem Planı Maddesi silmek için emin misiniz ?";
		const _waitDesciption = "Eylem Planı Siliniyor";
		const _deleteMessage = "Eylem Planı Silindi";

		const dialogRef = this.layoutUtilsService.deleteElement(
			_title,
			_description,
			_waitDesciption
		);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			this.store.dispatch(
				new OneEylemPlaniMaddeDeleted({ id: _item.id })
			);
			this.layoutUtilsService.showActionNotification(
				_deleteMessage,
				MessageType.Delete
			);
		});
	}

	eylemPlaniMaddesiOnayla() {}

	/**
	 * Delete selected eylemPlaniMaddes
	 */
	deleteEylemPlaniMaddes() {
		const _title = "Eylem Planı Maddeleri Sil";
		const _description =
			"Kalıcı olarak Eylem Planı Maddelerini silmek için emin misiniz ?";
		const _waitDesciption = "Eylem Planı Maddeleri Siliniyor";
		const _deleteMessage = "Eylem Planı Maddeleri Silindi";

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
				new ManyEylemPlaniMaddesDeleted({ ids: idsForDeletion })
			);
			this.layoutUtilsService.showActionNotification(
				_deleteMessage,
				MessageType.Delete
			);
			this.selection.clear();
		});
	}

	/**
	 * Fetch selected eylemPlaniMaddes
	 */
	fetchEylemPlaniMaddes() {
		const messages = [];
		this.selection.selected.forEach((elem) => {
			messages.push({
				text: `${elem.eylemNo}, ${elem.eylemName}`,
				id: elem.id.toString(),
				//status: elem.status
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Show UpdateStatuDialog for selected eylemPlaniMaddes
	 */
	updateStatusForEylemPlaniMaddes() {
		const _title = "Eylem Planı Durumu Güncelle";
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
				text: `${elem.eylemNo}, ${elem.eylemName}`,
				id: elem.id.toString(),
				status: elem.status,
				// statusTitle: this.getItemStatusString(elem.status),
				// statusCssClass: this.getItemCssClassByStatus(elem.status)
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
				new EylemPlaniMaddesStatusUpdated({
					status: +res,
					eylemPlaniMaddes: this.selection.selected,
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
	 * Show add eylemPlaniMadde dialog
	 */
	addEylemPlaniMadde() {
		const newEylemPlaniMadde = new EylemPlaniMaddeModel();
		newEylemPlaniMadde.clear(); // Set all defaults fields
		this.editEylemPlaniMadde(newEylemPlaniMadde);
	}

	/**
	 * Show Edit eylemPlaniMadde dialog and save after success close result
	 * @param eylemPlaniMadde: EylemPlaniMaddeModel
	 */
	editEylemPlaniMadde(eylemPlaniMadde: EylemPlaniMaddeModel) {
		let saveMessageTranslateParam = "ECOMMERCE.CUSTOMERS.EDIT.";
		saveMessageTranslateParam +=
			eylemPlaniMadde.id > 0 ? "UPDATE_MESSAGE" : "ADD_MESSAGE";
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType =
			eylemPlaniMadde.id > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(EylemPlaniMaddeEditDialogComponent, {
			data: { eylemPlaniMadde },
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(
				_saveMessage,
				_messageType
			);
			this.loadEylemPlaniMaddesList(null);
		});
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.eylemPlaniMaddesResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle all selections
	 */
	masterToggle() {
		if (
			this.selection.selected.length ===
			this.eylemPlaniMaddesResult.length
		) {
			this.selection.clear();
		} else {
			this.eylemPlaniMaddesResult.forEach((row) =>
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
				return "basic";
			case 1:
				return "metal";
			case 2:
				return "danger";
			case 3:
				return "basic";
			case 4:
				return "metal";
			case 5:
				return "danger";
			case 6:
				return "success";
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
				return "Taslak";
			case 1:
				return "Başkan Onay Bekleniyor";
			case 2:
				return "Red";
			case 3:
				return "Taslak";
			case 4:
				return "Başkan Onay Bekleniyor";
			case 5:
				return "Red";
			case 6:
				return "Onaylandı";
		}
		return "";
	}
}
