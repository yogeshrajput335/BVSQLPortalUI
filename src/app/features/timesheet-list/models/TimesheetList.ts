export class TimesheetList {
  id!: number;
  employeeId!:number;
  employeeName!:string;
  projectId!: number;
  projectName! : string;
  clientName! : string;
  weekEndingDate!: Date;
  month! : string;
  year! : string;
  createdDate! : Date;
  createdBy! : string;
  duration! :string;
  status!: string;
  detail:any;
}
