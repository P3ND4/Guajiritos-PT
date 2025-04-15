import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { IUser, Role } from './models/user';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, MatTabsModule, CommonModule, MatButtonModule, MatIcon, RouterLink, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Guajiritos-PT';
  links = [{ route: "tasks", name: "Tareas" }];
  activeLink = this.links[0].route;
  user: IUser | undefined

  constructor(private router: Router, private authServ: AuthService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.activeLink = this.router.url.split('/')[1]

  }
  ngAfterViewInit(): void {
        this.router.events.subscribe(event =>{
      this.user = this.authServ.getCurrentUser()
      if (this.user?.role == Role.Admin) this.links = [{ route: "tasks", name: "Tareas" }, { route: "users", name: "Usuarios" }]
    }
    )
    this.cdRef.detectChanges()
  }

  isLoggedIn(): boolean {
    return this.authServ.isLoggedIn()
  }
  logout() {
    this.authServ.logOut()
    this.router.navigate(['login'])
  }
  isActive(route: string) {
    return this.router.url.split('/')[1] === route
  }

}
