// Angular
import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	ChangeDetectionStrategy,
	OnDestroy,
	AfterViewInit,
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
import { NgxPermissionsService, NgxRolesService } from "ngx-permissions";
import { User, currentUser } from "../../../../../../../core/auth";
import { FormControl } from "@angular/forms";

@Component({
	// tslint:disable-next-line:component-selector
	selector: "kt-eylem-plani-madde-list",
	templateUrl: "./eylem-plani-madde-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EylemPlaniMaddesListComponent
	implements OnInit, OnDestroy, AfterViewInit {
	dataSource: EylemPlaniMaddesDataSource;
	displayedColumns = [
		"select",
		"eylemPlan",
		"eylemArea",
		"eylemNo",
		"eylemName",
		"status",
		"actions",
	];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild("sort1", { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild("searchInput", { static: true }) searchInput: ElementRef;
	@ViewChild("countryInput", { static: true }) countryInput: ElementRef;
	filterStatus = "";
	filterType = "";
	// Selection
	selection = new SelectionModel<EylemPlaniMaddeModel>(true, []);
	eylemPlaniMaddesResult: EylemPlaniMaddeModel[] = [];

	// Subscriptions
	private subscriptions: Subscription[] = [];
	countryControl = new FormControl();
	user: User;
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
		private permissionsService: NgxPermissionsService,
		private roleService: NgxRolesService
	) {
		this.user = JSON.parse(localStorage.getItem("user"));
	}

	ngAfterViewInit(): void {
		of(undefined)
			.pipe(take(1), delay(1100))
			.subscribe(() => {});
		this.init();
	}

	/**
	 * On init
	 */
	ngOnInit() {
		this.dataSource = new EylemPlaniMaddesDataSource(this.store);
		console.log(this.roleService.getRoles());
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach((el) => el.unsubscribe());
		this.dataSource = null;
	}

	init() {
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
			.pipe(tap(() => this.loadEylemPlaniMaddesList()))
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		this.countryControl.valueChanges.subscribe(() => {
			this.paginator.pageIndex = 0;
			this.loadEylemPlaniMaddesList();
		});
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
					this.loadEylemPlaniMaddesList();
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
		this.loadEylemPlaniMaddesList();
	}

	/**
	 * Load EylemPlaniMaddes List from service through data-source
	 */
	loadEylemPlaniMaddesList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);

		if (this.isUzman() && this.isTicaret()) {
			queryParams.status = [0, 1, 2, 3, 4];
		} else if (this.isBaskan() && this.isTicaret()) {
			queryParams.status = [1, 2, 4];
		} else if (this.isUzman() && !this.isTicaret()) {
			queryParams.status = [2, 4];
		} else if (this.isBaskan() && !this.isTicaret()) {
			queryParams.status = [2, 4];
		}

		// Call request from server
		this.store.dispatch(
			new EylemPlaniMaddesPageRequested({ page: queryParams })
		);
		this.selection.clear();
	}

	isTicaret() {
		return this.user && this.user.companyName === "T.C. Ticaret Bakanlığı";
	}

	isUzman() {
		return this.user.roles.indexOf(3) > -1;
	}

	isBaskan() {
		return this.user.roles.indexOf(2) > -1;
	}

	isAdmin() {
		return this.user.roles.indexOf(1) > -1;
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		if (this.countryControl.value) {
			filter.eylemPlan = this.countryControl.value;
		} else {
			filter.eylemPlan = searchText;
		}

		if(this.isTicaret()){
			filter.eylemArea = searchText;
		}else{
			filter.eylemArea = "Spor";
		}
		
		filter.eylemNo = searchText;
		filter.eylemName = searchText;

		return filter;
	}

	canEditOrDelete(_item: EylemPlaniMaddeModel) {
		return (_item.status == 0 || _item.status == 3) && this.isTicaret()
	}

	redBaskan(_item: EylemPlaniMaddeModel) {
		const _title = "Eylem planı maddesi RED";
		const _description =
			_item.eylemPlan +
			" - " +
			_item.eylemNo +
			" Eylem Planı Maddesi reddetmeyi musunuz?";
		const _waitDesciption = "Eylem Planı Reddeliyor";
		const _updateMessage = "Eylem Planı Reddedildi";
		const dialogRef = this.layoutUtilsService.redElement(
			_title,
			_description,
			_waitDesciption
		);

		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				this.selection.clear();
				return;
			}
			
			this.store.dispatch(
				new EylemPlaniMaddesStatusUpdated({
					status: 3,
					eylemPlaniMaddes: [_item],
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
			this.loadEylemPlaniMaddesList();
		});
	}

	onayBaskana(_item: EylemPlaniMaddeModel) {
		const _title = "Eylem planı maddesi Onay";
		const _description =
			_item.eylemPlan +
			" - " +
			_item.eylemNo +
			" Eylem Planı Maddesi onaylıyor musunuz?";
		const _waitDesciption = "Eylem Planı Onaylanıyor";
		const _updateMessage = "Eylem Planı Onaylandı";
		const dialogRef = this.layoutUtilsService.onayElement(
			_title,
			_description,
			_waitDesciption
		);

		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				this.selection.clear();
				return;
			}
			this.store.dispatch(
				new EylemPlaniMaddesStatusUpdated({
					status : 1,
					eylemPlaniMaddes: [_item],
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
			this.loadEylemPlaniMaddesList();
		});
	}

	onayBaskan(_item: EylemPlaniMaddeModel) {
		const _title = "Eylem planı maddesi Onay";
		const _description =
			_item.eylemPlan +
			" - " +
			_item.eylemNo +
			" Eylem Planı Maddesi onaylıyor musunuz?";
		const _waitDesciption = "Eylem Planı Onaylanıyor";
		const _updateMessage = "Eylem Planı Onaylandı";
		const dialogRef = this.layoutUtilsService.onayElement(
			_title,
			_description,
			_waitDesciption
		);

		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				this.selection.clear();
				return;
			}

			this.store.dispatch(
				new EylemPlaniMaddesStatusUpdated({
					status: 2,
					eylemPlaniMaddes: [_item],
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
			this.loadEylemPlaniMaddesList();
		});
	}

	toIzlemede(_item: EylemPlaniMaddeModel) {
		const _title = "Eylem planı maddesi İzlemede";
		const _description =
			_item.eylemPlan +
			" - " +
			_item.eylemNo +
			" Eylem Planı Maddesi İzlemede durmuna alınacaktır. Onaylıyor musunuz?";
		const _waitDesciption = "Eylem Planı Onaylanıyor";
		const _updateMessage = "Eylem Planı Onaylandı";
		const dialogRef = this.layoutUtilsService.onayElement(
			_title,
			_description,
			_waitDesciption
		);

		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				this.selection.clear();
				return;
			}
			this.store.dispatch(
				new EylemPlaniMaddesStatusUpdated({
					status : 4,
					eylemPlaniMaddes: [_item],
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
			this.loadEylemPlaniMaddesList();
		});
	}
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
		const _updateMessage = "Eylem Planı Durumu Güncellendi";
		const _statuses = [{ value: 6, text: "Onaylandı" }];
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
			this.loadEylemPlaniMaddesList();
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
		const _saveMessage = "İşleminiz başarılı bir şekilde gerçekleşti.";
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
			this.loadEylemPlaniMaddesList();
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
				return "success";
			case 3:
				return "danger";
			case 4:
				return "primary";
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
				return "Aktif";
			case 3:
				return "Reddedildi";
			case 4:
				return "İzlemede";
		}
		return "";
	}
}
