import { BaseModel } from '../../_base/crud';

export class PlatformKunyeModel extends BaseModel {
	id: number;
	countryId: string;
	name: string;
	owner: string;
	summary: string;
	status: number;

	clear() {
		this.name = '';
		this.summary = '';
		this.countryId = undefined;
		this.owner = '';
		this.id = undefined;
		this.status = 0;
	}
}
