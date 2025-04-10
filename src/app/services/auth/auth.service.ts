import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common'
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { IUser } from '../../models/user';
import { catchError, Observable, map, throwError, BehaviorSubject } from 'rxjs';
import { response } from 'express';
import { error } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/';
  
  private usuarioSubject: BehaviorSubject<IUser | undefined> = new BehaviorSubject<IUser | undefined>(undefined); // Inicializa el BehaviorSubject
  currentUser$ = this.usuarioSubject.asObservable();
  user_token: string | undefined


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
  }

  login(userEmail: string, password: string): Observable<{ user: IUser, accessToken: string } | any> {
    return this.http.post<{ user: IUser, accessToken: string }>(`${this.apiUrl}login`, { email: `${userEmail}`, password: `${password}` }).pipe(
      map(response => {
        this.usuarioSubject.next(response.user); // Actualiza el BehaviorSubject con el nuevo usuario
        this.storeLocal('currentUser', JSON.stringify(response.user))
        this.storeLocal('accessToken', response.accessToken)
        return response
      }),
      catchError(err => {
        console.error('Error desde la API', err);
        return throwError(() => new Error(this.getErrorMessage(err)));
      })
    )
  }
  register(user: IUser): Observable<{ user: IUser, accessToken: string }> {
    return this.http.post<{ user: IUser, accessToken: string } | any>(`${this.apiUrl}/register`, user).pipe(
      map(response => {

        this.usuarioSubject.next(response.user)
        this.storeLocal('currentUser', JSON.stringify(response.user))
        this.storeLocal('accessToken', response.accessToken)
        return response
      }),
      catchError(err =>{
        console.error('Error desde la API', err);
        return throwError(() => new Error(this.getErrorMessage(err)));

      })

    )
  }

  logOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
      this.usuarioSubject.next(undefined); // Actualizar el observable
      this.user_token = undefined
    }
  }

  public isLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken') != null
    }
    else return false
  }

  private storeLocal(key: string, value: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value)
    }
  }

  private getErrorMessage(error: any): string {
    if (error && error.error) {
      return error.error;
    } else if (error.status === 0) {
      return 'No se pudo conectar al servidor';
    } else {
      return 'Ocurrió un error inesperado';
    }
  }



}
