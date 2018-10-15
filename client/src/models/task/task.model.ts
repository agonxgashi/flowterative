import { StepModel } from "./step.model";

export class TaskModel {
    _id: string;
    ProjectId: string;
    ListId: string;
    Code: string;
    Name: string;
    Description: string;
    StartDate: Date;
    DueDate: Date;
    Steps: StepModel[] = [];
}
