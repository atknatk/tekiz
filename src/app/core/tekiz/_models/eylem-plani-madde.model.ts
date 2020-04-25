import { BaseModel } from "../../_base/crud";

export class EylemPlaniMaddeModel extends BaseModel {
	id: number;
	eylemPlan: string;
	eylemArea: string;
	eylemNo: string;
	eylemName: string;
	eylemDescription: string;
	eylemStartDate: Date;
	eylemEndDate: Date;
	foreignResponsibleInstitution: string[];
	localResponsibleInstitution: string[];
	relatedInstitution: string;
	ownerInstitution: string;
	status: number;

	clear() {
		this.id = undefined;
		this.eylemPlan = "";
		this.eylemArea = "";
		this.eylemNo = "";
		this.eylemName = "";
		this.eylemDescription = "";
		this.eylemStartDate = null;
		this.eylemEndDate = null;
		this.foreignResponsibleInstitution = [];
		this.localResponsibleInstitution = [];
		this.relatedInstitution = "";
		this.ownerInstitution = "";
		this.status = 0;
	}
}
