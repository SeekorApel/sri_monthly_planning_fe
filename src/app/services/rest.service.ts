import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/User';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  constructor(private http: HttpClient, private router: Router) {}

  //----START OF GET
  public getUserByUserName(userName): Observable<User> {
    return this.http.get(environment.apiUrlLocalAdmin + '/getUsername/' + userName).pipe(
      map((response) => {
        return new User(response);
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  public getRoles(): Observable<Role> {
    return this.http.get(environment.apiUrlWebAdmin + '/roles').pipe(
      map((response) => {
        return new Role(response);
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  public getPermissions(): Observable<Permission> {
    return this.http.get(environment.apiUrlWebAdmin + '/permissions').pipe(
      map((response) => {
        return new Permission(response);
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  //----END OF GET
  //----START OF POST
  public addUser(userType, userName, password, email): Observable<User> {
    return this.http
      .post(
        environment.apiUrlWebAdmin + '/user',
        JSON.stringify({
          userType: userType,
          userName: userName,
          password: password,
          email: email,
        })
      )
      .pipe(
        map((response) => {
          return new User(response);
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public resetPass(userName, password): Observable<User> {
    return this.http
      .post(
        environment.apiUrlWebAdmin + '/user/resetpass',
        JSON.stringify({
          userName: userName,
          password: password,
        })
      )
      .pipe(
        map((response) => {
          return new User(response);
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public resetPin(userName, pin): Observable<User> {
    return this.http
      .post(
        environment.apiUrlLocalAdmin + '/user/pin/reset',
        JSON.stringify({
          userName: userName,
          pin: pin,
        })
      )
      .pipe(
        map((response) => {
          return new User(response);
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public addRole(roleName, roleDesc): Observable<Role> {
    return this.http
      .post(
        environment.apiUrlWebAdmin + '/role',
        JSON.stringify({
          roleName: roleName,
          description: roleDesc,
        })
      )
      .pipe(
        map((response) => {
          return new Role(response);
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public addPermission(permissionName, permissionDesc): Observable<Permission> {
    return this.http
      .post(
        environment.apiUrlWebAdmin + '/permission',
        JSON.stringify({
          permissionName: permissionName,
          description: permissionDesc,
        })
      )
      .pipe(
        map((response) => {
          return new Permission(response);
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public addUserRoles(userId, roleId, activeDate): Observable<Role> {
    return this.http
      .post(
        environment.apiUrlWebAdmin + '/user/roles/' + userId,
        JSON.stringify({
          userId: userId,
          roleId: roleId,
          activeDate: activeDate,
        })
      )
      .pipe(
        map((response) => {
          return new Role(response);
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  //----END OF POST

  //PUT

  //----END OF PUT

  //DELETE
  public deleteRole(roleId): Observable<Role> {
    return this.http.delete(environment.apiUrlWebAdmin + '/role/' + roleId).pipe(
      map((response) => {
        return new Role(response);
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  public deletePermission(permissionId): Observable<Permission> {
    return this.http.delete(environment.apiUrlWebAdmin + '/permission/' + permissionId).pipe(
      map((response) => {
        return new Permission(response);
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  //---END OF DELETE
}
