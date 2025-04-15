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
    {path: "tasks", component: TasksComponent, canActivate: [loginGuard]},
    {path: "login", component: LoginComponent},
    {path: "users",  component: UsersComponent, canActivate: [adminGuard, loginGuard]},
    {path: "**", redirectTo: "tasks", pathMatch: "full"}
];
