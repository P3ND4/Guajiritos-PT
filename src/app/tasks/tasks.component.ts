import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { ITask } from '../models/task';
import { ApiDbService } from '../services/api.db/api.db.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from './create-task/create-task.component';
import { AuthService } from '../services/auth/auth.service';
import { IUser, Role } from '../models/user';
import { CommonModule } from '@angular/common';
import { After } from 'v8';



export interface taskDataDialog{
  edit: Boolean,
  task: ITask
}

/**
 * @title Table with selection
 */
@Component({
  standalone: true,
  selector: 'tasks-table',
  styleUrl: 'tasks.component.css',
  templateUrl: 'tasks.component.html',
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatCardModule, MatButtonModule, MatIconModule],
})
export class TasksComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = []
  tasks: ITask[] = []
  dataSource = new MatTableDataSource<ITask>(this.tasks);
  selection = new SelectionModel<ITask>(true, []);
  currUs: IUser | undefined

  constructor(private api: ApiDbService, private auth: AuthService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.api.getTasks().subscribe((response: ITask[]) => {
      this.tasks = this.currUs?.role == Role.Admin? response: response.filter(task=> task.userId == this.currUs?.id)
      this.dataSource = new MatTableDataSource<ITask>(this.tasks);
      this.cdRef.detectChanges()
    })
  }
  ngAfterViewInit(): void {
    this.currUs = this.auth.getCurrentUser()
    this.displayedColumns = this.currUs?.role == Role.Admin? ['select', 'name', 'userName', 'user', 'state']: ['name', 'state'];
    this.cdRef.detectChanges()
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }



  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  isAnySelected() {
    return this.selection.selected.length == 0
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ITask): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id! + 1}`;
  }

  deleteSelected() {
    for (let sel of this.selection.selected) {
      this.tasks = this.tasks.filter(elem => elem.id != sel.id)
      this.dataSource = new MatTableDataSource<ITask>(this.tasks)
      this.selection.toggle(sel)
      this.api.deleteTask(sel.id!).subscribe(response => {
        console.log(response)
      }
      )
    }
  }

  readonly dialog = inject(MatDialog);
  openDialog(edit: boolean): void {
    var sel:ITask;
    if(edit) {sel = this.selection.selected[0]}
    for(var select of this.selection.selected){
      this.selection.toggle(select)
    }
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      data: {edit: edit, task: edit? sel!: null},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.getTasks().subscribe(response => {
        this.tasks = response
        this.dataSource = new MatTableDataSource<ITask>(this.tasks)
      })

    });
  }

  canEdit() {
    return this.selection.selected.length == 1
  }
}
