import { BoardComponent } from './app/board/board.component';
import { Routes } from '@angular/router';
import { BoardsComponent } from './app/boards/boards.component';
import { UiHelpComponent } from './app/ui-help/ui-help.component';
import { BlogComponent } from './app/blog/blog.component';
import { BlogPostComponent } from './app/blog-post/blog-post.component';
import { PageNotFoundComponent } from './app/page-not-found/page-not-found.component';
import { LandingComponent } from './app/landing/landing.component';
import { TestComponent } from './app/test/test.component';


export const appRoutes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'boards', component: BoardsComponent },
    { path: 'boards/:id', component: BoardComponent },
    { path: 'help', component: UiHelpComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'blog/post', component: BlogPostComponent },
    { path: 'blog/:page', component: BlogComponent },
    { path: 'test', component: TestComponent },
    { path: '**', component: PageNotFoundComponent }
  ];

