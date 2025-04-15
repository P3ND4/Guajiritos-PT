import { CommonModule } from '@angular/common';
import { Component, inject, model, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router'
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Role, IUser } from '../../models/user';
import { ApiDbService } from '../../services/api.db/api.db.service';
import { DialogData } from '../users.component';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatCardModule, CommonModule,
    ReactiveFormsModule, MatFormFieldModule, MatError, MatDialogContent, MatInputModule, MatSelectModule, MatDialogModule, MatDialogTitle],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  formCreation: FormGroup
  currentUser: string = "Perdro"
  errorMessage = signal('');
  userEdition: IUser | undefined;
  readonly dialogRef = inject(MatDialogRef<CreateUserComponent>);
  roles: string[] = [Role.Admin, Role.User]
  data = inject<DialogData>(MAT_DIALOG_DATA)
  onNoClick(): void {
    this.dialogRef.close();
  }


  constructor(private form: FormBuilder, private route: Router, private api: ApiDbService) {
    this.formCreation = this.form.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordC: ['', [Validators.required, this.passwordsMatchValidator]],
      role: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    if (this.data.edit) {
      this.formCreation.get('name')?.setValue(this.data.user.name)
      this.formCreation.get('email')?.setValue(this.data.user.email)
      this.formCreation.get('role')?.setValue(this.data.user.role)

    }

    this.formCreation.get('passwordC')?.valueChanges.subscribe(() => {
      this.formCreation.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });

    this.formCreation.get('password')?.valueChanges.subscribe(() => {
      this.formCreation.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });
  }

  updateErrorMessage() {
    if (this.formCreation.get('email')?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.formCreation.get('email')?.hasError('email')) {
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

  passwordsMatchValidator = (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  };

  errMsg: string = ''
  submit() {
    if (this.formCreation.invalid) {
      // Marca todos los campos como tocados para que se muestren los errores
      this.formCreation.markAllAsTouched();
      return; // Detiene el submit
    }

    const result = {
      name: this.formCreation.get('name')?.value,
      password: this.formCreation.get('password')?.value,
      role: this.formCreation.get('role')?.value,
      email: this.formCreation.get('email')?.value
    }
    if (this.data.edit) {
      this.api.editUser(this.data.user.id!, result).subscribe({
        next: (response) => {
          console.log(response)
          this.errMsg = ''
          this.dialogRef.close();
        },
        error: (err: Error) => {
          this.errMsg = err.message
        }
      })
    }
    else {
      this.api.createUsers(result).subscribe({
        next: (response) => {
          console.log(response)
          this.errMsg = ''
          this.dialogRef.close();
        },
        error: (err: Error) => {
          console.log(err)
          this.errMsg = err.message
          
        }
      })}

  }
}