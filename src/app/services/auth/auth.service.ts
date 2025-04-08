import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../../models/user';
import { catchError, Observable, map, throwError } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/';
  currentUser: IUser | undefined
  user_token: string | undefined

  constructor(private http: HttpClient) {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  login(userName: string, password: string): Observable<{ user: IUser, accessToken: string } | any> {
    return this.http.post<{ user: IUser, accessToken: string }>(`${this.apiUrl}/login`, { name: `${userName}@fake`, password: `${password}` }).pipe(
      map(response => {
        if (response && response.accessToken) {
          this.currentUser = response.user
          localStorage.setItem('currentUser', JSON.stringify(response.user))
          localStorage.setItem('accesToken', response.accessToken)
          return response
        }
        else return throwError(() => new Error("Usuario o contraseña incorrectos"))
      })
    )
  }
  register(user: IUser): Observable<{ user: IUser, accessToken: string }> {
    return this.http.post<{ user: IUser, accessToken: string } | any>(`${this.apiUrl}/register`, user).pipe(
      map(response => {
        if (response && response.accessToken) {
          this.currentUser = response.user
          localStorage.setItem('currentUser', JSON.stringify(response.user))
          localStorage.setItem('accessToken', response.accessToken)
          return response
        }
        else return throwError(() => new Error("Usuario o contraseña incorrectos"))
      })

    )
  }

  logOut(): void{
    localStorage.removeItem('auth_token');
    this.currentUser = undefined
  }

  isLoggedIn(){
    return localStorage.getItem('accessToken') != null
  }






}
