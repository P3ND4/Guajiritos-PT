import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import {MatTabsModule} from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { IUser } from './models/user';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTabsModule, CommonModule, MatButtonModule, MatIcon, RouterLink, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
  
})
export class AppComponent implements OnInit{
  title = 'Guajiritos-PT';
  links = [{route:"tasks", name: "Tareas"}, {route:"users", name: "Usuarios"}];
  activeLink = this.links[0].route;
  user: IUser | undefined
  userName = signal('')
  
  constructor(private router: Router,private authServ: AuthService) {
  }

  ngOnInit(): void {
    this.authServ.currentUser$.subscribe(usuario => {
      if(!!usuario){
        this.user = usuario
        this.userName.set(usuario.name || '')
      }
    })
    if(!this.authServ.isLoggedIn()) {
      this.router.navigate(['login'])
    }else{
      this.user = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') || '') : undefined
      this.userName.set(this.user?.name || '')
    }

  }

  isLoggedIn(): boolean {
    return this.authServ.isLoggedIn()
  }
  logout() {
    this.authServ.logOut()
    this.router.navigate(['login'])
  }

}
