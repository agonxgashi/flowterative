import { AppUser } from '../auth/appUser.model';

export class CommentModel {
    Content: string;
    CreatedBy: any;
    CreatedByModel: AppUser;
    CreateDate: Date;
}
