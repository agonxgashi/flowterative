export class TaskModel {
    _id: string;
    ProjectId: string;
    Code: string;
    Name: string;
    Description: string;
    Steps: string[] = [];
}
