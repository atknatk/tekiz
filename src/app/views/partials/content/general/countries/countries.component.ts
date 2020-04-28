// Angular
import { Component, forwardRef, Input, OnInit } from "@angular/core";
import {
	ControlValueAccessor,
	NG_VALUE_ACCESSOR,
	FormControl,
} from "@angular/forms";
import { CountriesTable } from "./countries.table";
import { startWith, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
	selector: "kt-countries",
	templateUrl: "./countries.component.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CountriesComponent),
			multi: true,
		},
	],
})
export class CountriesComponent implements ControlValueAccessor, OnInit {
	@Input() placeholder = "";
	@Input() hint = "";
	@Input() search = false;
	filtered: Observable<string[]>;
	inputControl = new FormControl("");
	countries;
	val = "";
	onChange: any = () => {};
	onTouch: any = () => {};

	constructor() {}
	ngOnInit(): void {
		this.countries = Object.entries(CountriesTable.countries)
			.map(([key, value]) => ({ key, value }))
			.map((l) => l.value);
		this.filtered = this.inputControl.valueChanges.pipe(
			startWith(""),
			map((val) => this.filter(val.toString()))
		);
		this.inputControl.valueChanges.subscribe(res =>{
			this.value = res;
		} )
	}

	filter(val: string): string[] {
		return this.countries.filter((option) =>
			option.toLowerCase().includes(val.toLowerCase())
		);
	}

	set value(val) {
		if (val !== undefined && this.val !== val) {
			this.val = val;
			this.onChange(val);
			this.onTouch(val);
			this.inputControl.setValue(val);
		}
	}

	writeValue(value: any): void {
		this.value = value;
	}
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}
	registerOnTouched(fn: any): void {
		this.onTouch = fn;
	}
	setDisabledState?(isDisabled: boolean): void {
		throw new Error("Method not implemented.");
	}
	selectionChanged(event) {
		this.value = event.value;
	}

	onBlur($event){
		// if(this.countries.indexOf(this.inputControl.value) === -1){
		// 	this.value = null;
		// 	this.inputControl.patchValue(null);
		// }
	}
}
