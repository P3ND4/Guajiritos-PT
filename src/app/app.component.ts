import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './services/auth/auth.service';
import {MatTabsModule} from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTabsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Guajiritos-PT';
  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];

  constructor(private router: Router,private authServ: AuthService) {
  }

  ngOnInit(): void {
    if(!this.authServ.isLoggedIn()) {
      this.router.navigate(['login'])
    };
  }

  isLoggedIn(): boolean {
    return this.authServ.isLoggedIn()
  }

}
