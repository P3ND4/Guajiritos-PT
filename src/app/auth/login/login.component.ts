import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from "@angular/material/button"
import { AuthService } from '../../services/auth/auth.service';
import { error } from 'node:console';
import { isNumberObject } from 'node:util/types';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatCardModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formLogin: FormGroup
  currentUser: string = "Perdro"
  errorMessage = signal('');

  constructor(private form: FormBuilder,private _authS: AuthService, private route: Router) {
    this.formLogin = this.form.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }


  updateErrorMessage() {
    if (this.formLogin.get('email')?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.formLogin.get('email')?.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }
  hide = signal(true);
  hideBt(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  errMsg: string = ''
  submit(){
    this._authS.login(this.formLogin.get('email')?.value, this.formLogin.get('password')?.value).subscribe({
      next: (response) => {
      console.log(response)
      this.errMsg = ''
      this.route.navigate([''])
      },
      error: (err:Error) => {
        this.errMsg = err.message
      }}
    )
  }
}
