import { AppUser } from '../auth/appUser.model';
import { ListModel } from './list.model';

export class BoardModel {
    _id: string;
    Name: string;
    Description: string;
    CreateDate: Date;
    CreatedBy: AppUser = new AppUser();
    Admins: AppUser[] = [];
    Backlog: ListModel = new ListModel();
    Members: AppUser[] = [];
    Lists: ListModel[] = [];
    Color: string;
}
