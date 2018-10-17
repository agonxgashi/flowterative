import { AppUser } from '../auth/appUser.model';

export class CommentModel {
    Content       : string;
    CreatedBy     : string;
    CreatedByModel: AppUser;
    CreateDate    : Date;
}
