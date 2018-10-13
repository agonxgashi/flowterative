import { AppUser } from '../auth/appUser.model';

export class BoardModel {
    _id: string;
    Name: string;
    Description: string;
    CreateDate: Date;
    CreatedBy: AppUser = new AppUser();
    Admins: AppUser[] = [];
    Members: AppUser[] = [];
    Lists: any[] = [];
    Color: string;
}
