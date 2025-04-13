import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ApiDbService } from '../../services/api.db/api.db.service';
import { IUser } from '../../models/user';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ITask, State } from '../../models/task';

@Component({
  selector: 'app-create-task',
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatSelectModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateTaskComponent>);
  formTaskCreate: FormGroup;
  userList: IUser[] = []

  constructor(form: FormBuilder, private api: ApiDbService){
    this.formTaskCreate = form.group({
      name: ['', Validators.required],
      user: [null, Validators.required ]
    })
  }

  ngOnInit(): void {
    this.api.getUsers().subscribe((response: IUser[]) => {
      this.userList = response
    })
  }



  onNoClick(): void {
    this.dialogRef.close();
  }


  submit(){
    console.log(this.formTaskCreate.get('user')?.value)
    const user : IUser = this.formTaskCreate.get('user')?.value
    console.log(user)
    const task: ITask = {
      name: this.formTaskCreate.get('name')?.value,
      state: State.Todo,
      userId: user.id,
      userName: user.name
    }
    this.api.createTask(task).subscribe(response => {
      console.log(response)
    }
    )
    this.dialogRef.close()
  }
}
