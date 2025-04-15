import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { IUser } from './models/user';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, MatTabsModule, CommonModule, RouterLink, MatButtonModule, MatIcon, MatMenuModule, MatProgressSpinnerModule, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent implements OnInit {
  user: IUser | undefined

  constructor(private router: Router, private authServ: AuthService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      this.user = this.authServ.getCurrentUser()
    })    
  }


  isLoggedIn(): boolean {
    return this.authServ.isLoggedIn()
  }
  logout() {
    this.authServ.logOut()
    this.router.navigate(['login'])
  }
}
