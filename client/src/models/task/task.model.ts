import { StepModel } from './step.model';
import { CommentModel } from './comment.model';
import { AppUser } from '../auth/appUser.model';

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
    Comments: CommentModel[] = [];
    Members: any[];
}
