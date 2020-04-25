// Angular
import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatSelectChange } from '@angular/material';

@Component({
	selector: "kt-ministries",
	templateUrl: "./ministries.component.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MinistriesComponent),
			multi: true,
		},
	],
})
export class MinistriesComponent implements ControlValueAccessor {
	@Input() placeholder = "";
	@Input() hint = "";

	val = "";
	onChange: any = () => {};
	onTouch: any = () => {};

	set value(val) {
		if (val !== undefined && this.val !== val) {
			this.val = val;
			this.onChange(val);
			this.onTouch(val);
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

	selectionChanged(event: MatSelectChange) {
		this.value = event.value;
	  } 
	
}
