import { HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtManager } from './jwt-manager.service';
import { LoadingManager } from '../UI/loading.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private tokenManager: JwtManager, private loading: LoadingManager) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loading.changeValue(false);
        return next.handle(request).pipe(catchError(err => {
            console.log(err.status);
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.tokenManager.clearJwt();
                this.router.navigate(['/']);
            }
            if (err.status === 404) {
                this.router.navigate(['/not-found']);
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
