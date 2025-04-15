import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError } from 'rxjs';
import { IUser } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { ITask } from '../../models/task';
import { url } from 'inspector';
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
        return throwError(() => new Error(err.error));
      })
    )
      
    }
    getUser(id: number): Observable<IUser>{
      return this.http.get<IUser>(`${this.apiUrl}${id}`).pipe(
      map(response =>{
        return response
      }),
      catchError((err) => {
        console.error('Error desde la API', err);
        return throwError(() => new Error(err.error));
      }))
    };
    editUser(id: number, body: IUser){
      return this.http.put(`${this.apiUrl}users/${id}`, body).pipe(
        map(response => {
          return response
        }),
        catchError((err) => {
          console.error('Error desde la API', err);
          return throwError(() => new Error(err.error));
        })
      )
    }


    createUsers(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}register`, data).pipe(
      map(response => {
        return response
      }),
      catchError((err) => {
        console.error('Error desde la API', err);
        return throwError(() => new Error(err.error));
      })
    )
  }
  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.apiUrl}tasks`).pipe(
      map(response => {
        return response
      }),
      catchError((err) => {
        console.error('Error desde la API', err);
        return throwError(() => new Error(err.error));
      }))
  }
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}users/${id}`).pipe(
      map(response => {
        return response
      }),
      catchError((err) => {
        console.error('Error desde la API', err);
        return throwError(() => new Error(err.error));
      }))
  }
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}tasks/${id}`).pipe(
      map(response => {
        return response
      }),
      catchError((err) => {
        console.error('Error desde la API', err);
        return throwError(() => new Error(err.error));
      }))
  }
  createTask(task: ITask) {
    return this.http.post(`${this.apiUrl}tasks`, task).pipe(
      map(response => {
        return response
      }),
      catchError((err) => {
        console.error('Error desde la API', err);
        return throwError(() => new Error(err.error));
      }))
  }
  editTask(id:number, task:ITask){
    return this.http.put(`${this.apiUrl}tasks/${id}`, task).pipe(
      map(response =>{
        return response
      }),
      catchError((err) => {
        console.error('Error desde la API', err);
        return throwError(() => new Error(err.error));
      }))
  }
}
