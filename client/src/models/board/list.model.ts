import { TaskModel } from "../task/task.model";

export class ListModel {
    _id: string;
    BoardId: string;
    Name: string;
    Tasks: TaskModel[] = [];
    OrderNo: number;
}
