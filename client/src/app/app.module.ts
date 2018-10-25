// Angular Modules and Components
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

// Costum Components
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { UiHelpComponent } from './ui-help/ui-help.component';
import { BlogComponent } from './blog/blog.component';
import { BoardsComponent } from './boards/boards.component';
import { BoardComponent } from './board/board.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LandingComponent } from './landing/landing.component';
import { TestComponent } from './test/test.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';

// Pipes
import { SafePipe } from '../pipes/safe.pipe';
import { TruncatePipe } from '../pipes/truncate.pipe';

// 3rd party compoents or modules
import { QuillModule } from 'ngx-quill';
import { DragulaModule } from 'ng2-dragula';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DragScrollModule } from 'ngx-drag-scroll';
import { A2Edatetimepicker } from 'ng2-eonasdan-datetimepicker';
import { MarkdownModule } from 'angular2-markdown';

// Variables
import { appRoutes } from './../routes';
import { LanguageService } from '../services/language/lang.service';
import { JwtManager } from './../services/auth/jwt-manager.service';
import { TokenInterceptor } from '../services/auth/http-interceptor';
import { ErrorInterceptor } from '../services/auth/auth-guard';
import { LoadingManager } from '../services/UI/loading.service';



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavBarComponent,
    UiHelpComponent,
    BlogComponent,
    BlogPostComponent,
    BoardsComponent,
    BoardComponent,
    BlogPostComponent,
    SafePipe,
    TruncatePipe,
    LandingComponent,
    TestComponent,
    LoadingIndicatorComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    RouterModule.forRoot(appRoutes),
    MarkdownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    A2Edatetimepicker,
    DragulaModule,
    QuillModule,
    DragScrollModule
  ],
  providers: [
    LanguageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    JwtManager,
    LoadingManager
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

