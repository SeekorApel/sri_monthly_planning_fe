import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { UserDetails } from '../models/UserDetails';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { RestService } from './rest.service';
import { MarketingOrderService } from './transaksi/marketing order/marketing-order.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserDetails>;
  public currentUser: Observable<UserDetails>;
  private userData: User;
  private userDetail: UserDetails;
  public token: string;
  private data: any;

  constructor(private http: HttpClient, private rest: RestService, private mo: MarketingOrderService) {
    this.currentUserSubject = new BehaviorSubject<UserDetails>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserDetails {
    return this.currentUserSubject.value;
  }

  login(userName: string, password: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ userName: userName, password: password });

    return this.http.post(environment.apiUrlLocalAdmin + '/loginUser', body, { headers }).pipe(
      map((res: any) => {
        this.token = res.data;
        if (res && this.token) {
          this.fetchUsername(userName);
        }
      })
    );
  }

  // login(userName: string, pin: string) {
  //     // return this.http.post(environment.apiUrlWebAdmin+'/login', JSON.stringify({ userName: userName, password: pin }),{ observe: "response" }) // << PASSWORD
  //     return this.http.post(environment.apiUrlLocalAdmin+'/login', JSON.stringify({ userName: userName, pin: pin }),{ observe: "response" }) // PIN
  //         .pipe(map(res => {
  //           this.token = res.headers.get("authorization");
  //             // login successful if there's a jwt token in the response
  //             if (res && this.token) {
  //                   this.fetchUsername(userName)
  //             }

  //         }));
  // }

  fetchUsername(userName) {
    this.rest.getUserByUserName(userName).subscribe((res) => {
      this.data = res.data;
      localStorage.setItem('currentUser', JSON.stringify(this.data));
      localStorage.setItem('token', this.token);
      this.currentUserSubject.next(this.data);
      location.reload();
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }
}
