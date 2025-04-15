import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ApiDbService } from '../../services/api.db/api.db.service';
import { IUser, Role } from '../../models/user';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ITask, State } from '../../models/task';
import { taskDataDialog } from '../tasks.component';

@Component({
  standalone: true,
  selector: 'app-create-task',
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatSelectModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateTaskComponent>);
  formTaskCreate: FormGroup;
  userList: IUser[] = []
  data = inject<taskDataDialog>(MAT_DIALOG_DATA)
  constructor(form: FormBuilder, private api: ApiDbService) {
    this.formTaskCreate = form.group({
      name: ['', Validators.required],
      user: [null, Validators.required],
      state: [State.Todo,]
    })
  }
  states = [State.Done, State.InProgress, State.Todo]

  ngOnInit(): void {
    this.api.getUsers().subscribe((response: IUser[]) => {
      this.userList = response
      if (this.data.edit) {
        this.formTaskCreate.get('name')?.setValue(this.data.task.name)
        this.formTaskCreate.get('user')?.setValue(this.userList.filter(user => user.id == this.data.task.userId)[0])
        this.formTaskCreate.get('state')?.setValue(this.data.task.state)

      }
    })

  }



  onNoClick(): void {
    this.dialogRef.close();
  }


  submit() {
    console.log(this.formTaskCreate.get('user')?.value)
    const user: IUser = this.formTaskCreate.get('user')?.value
    const task: ITask = {
      name: this.formTaskCreate.get('name')?.value,
      state: this.formTaskCreate.get('state')?.value,
      userId: user.id!,
      userName: user.name
    }
    if (this.data.edit) {
      this.api.editTask(this.data.task.id!, task).subscribe(response => {
        console.log(response)
      }
      )
    }
    else {
      this.api.createTask(task).subscribe(response => {
        console.log(response)
      }
      )
    }
    this.dialogRef.close()
  }
}
