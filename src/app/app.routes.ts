import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AppComponent } from './app.component';
import { TasksComponent } from './tasks/tasks.component';
import { UsersComponent } from './users/users.component';
import { adminGuard } from './guards/admin.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
    {path: "", redirectTo: "tasks", pathMatch: "full"}, 
    {path: "tasks", canActivate: [loginGuard], loadComponent:() => import('./tasks/tasks.component').then(m => m.TasksComponent)},
    {path: "login", loadComponent:() => import('./auth/login/login.component').then(m=> m.LoginComponent)},
    {path: "users", canActivate: [adminGuard, loginGuard], loadComponent:() => import('./users/users.component').then(m => m.UsersComponent)},
    {path: "**", redirectTo: "tasks", pathMatch: "full"}
];
