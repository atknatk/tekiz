import { BaseModel } from '../../_base/crud';

export class PlatformKunyeModel extends BaseModel {
	id: number;
	country: string;
	name: string;
	owner: string;
	summary: string;
	status: number;

	clear() {
		this.name = '';
		this.country= '';
		this.summary = '';
		this.owner = '';
		this.id = undefined;
		this.status = 0;
	}
}
