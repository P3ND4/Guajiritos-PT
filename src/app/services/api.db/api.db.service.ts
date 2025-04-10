import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError } from 'rxjs';
import { IUser } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { ITask } from '../../models/task';
@Injectable({
  providedIn: 'root'
})
export class ApiDbService {
  private apiUrl = 'http://localhost:3000/';
  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}users`).pipe(
      map(response => {
        return response
      }),
      catchError((err) => {
        console.error('Error desde la API', err);
        return throwError(() => new Error(err.message));
      }))

  }
  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.apiUrl}users`).pipe(
      map(response => {
        return response
      }),
      catchError((err) => {
        console.error('Error desde la API', err);
        return throwError(() => new Error(err.message));
      }))
    }
  }
