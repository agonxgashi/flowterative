import { JwtManager } from './jwt-manager.service';
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingManager } from '../UI/loading.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {


    private base_url = '';
    constructor(private auth: JwtManager, private loading: LoadingManager) {
    }
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loading.changeValue(true);
        request = request.clone({
            setHeaders: {
                Authorization: this.auth.getJwt() || ''
            }
            // If you're running Angular client app separated from server,
            // uncomment below line
            , url: (request.url.indexOf('/api') === 0 ? 'http://localhost:3200' : '') + request.url
        });
        return next.handle(request);
    }
}
