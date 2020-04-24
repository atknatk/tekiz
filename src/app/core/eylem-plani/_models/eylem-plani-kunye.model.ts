import { BaseModel } from '../../_base/crud';

export class EylemPlaniKunyeModel extends BaseModel {
	id: number;
	country: string;
	kek: string;
	planName: string;
	planPeriod: string;
	signedDate: Date;
	localSigner: string;
	foreignSigner: string;
	areaName: string;
	areaNo: string;
	responsibleInstitution: string;
	responsiblePresident: string;
	
	clear() {
		this.id = undefined;
		this.country= '';
		this.kek= '';
		this.planName= '';
		this.planPeriod= '';
	//	this.signedDate= '';
		this.localSigner= '';
		this.foreignSigner= '';
		this.areaName= '';
		this.areaNo= '';
		this.responsibleInstitution= '';
		this.responsiblePresident= '';
		
	}
}
