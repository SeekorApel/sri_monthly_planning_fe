import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = currentUser && localStorage.getItem('token');
    const token = localStorage.getItem('token');
    // const isApiUrl = request.url.startsWith(environment.apiUrlWebAdmin);

    if (isLoggedIn) {
      // Set Authorization header
      let headers = {
        Authorization: `Bearer ${token}`,
      };

      // Conditionally add Content-Type if the request body is not FormData
      if (!(request.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      // Clone the request and set the headers
      request = request.clone({
        setHeaders: headers,
      });
    }

    return next.handle(request);
  }
}