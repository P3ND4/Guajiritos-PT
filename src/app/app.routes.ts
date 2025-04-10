import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AppComponent } from './app.component';
import { TasksComponent } from './tasks/tasks.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
    {path: "", redirectTo: "tasks", pathMatch: "full"}, 
    {path: "tasks", component: TasksComponent},
    {path: "login", component: LoginComponent},
    {path: "users", component: UsersComponent},
    {path: "**", redirectTo: "tasks", pathMatch: "full"}
];
