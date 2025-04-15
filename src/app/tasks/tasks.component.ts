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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';



export interface taskDataDialog {
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
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
})
export class TasksComponent implements OnInit {
  displayedColumns: string[] = []
  tasks: ITask[] = []
  dataSource = new MatTableDataSource<ITask>(this.tasks);
  selection = new SelectionModel<ITask>(true, []);
  currUs: IUser | undefined
  isLoading: boolean = false
  constructor(private api: ApiDbService, private auth: AuthService, private snackB: MatSnackBar) { }

  ngOnInit(): void {
    this.isLoading = true
    this.currUs = this.auth.getCurrentUser()
    this.displayedColumns = this.currUs?.role == Role.Admin ? ['select', 'name', 'userName', 'user', 'state'] : ['name', 'state'];
    this.api.getTasks().subscribe({
      next: (response: ITask[]) => {
        this.tasks = this.currUs?.role == Role.Admin ? response : response.filter(task => task.userId == this.currUs?.id)
        this.dataSource = new MatTableDataSource<ITask>(this.tasks);
        this.isLoading = false
      },
      error: (err: Error) => {
        this.isLoading = false
        this.showError(`Error al cargar las tareas: ${err.message}`)
      }
    })
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
      this.api.deleteTask(sel.id!).subscribe({
        next: (response) => {
          console.log(response)
          this.tasks = this.tasks.filter(elem => elem.id != sel.id)
          this.dataSource = new MatTableDataSource<ITask>(this.tasks)
          this.selection.toggle(sel)
        },
        error: (err: Error) => {
          this.showError(`Error al eliminar la tarea: ${err.message}`)
        }
      }
      )
    }
  }
  showError(message: string) {
    this.snackB.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }

  readonly dialog = inject(MatDialog);
  openDialog(edit: boolean): void {
    var sel: ITask;
    if (edit) { sel = this.selection.selected[0] }
    for (var select of this.selection.selected) {
      this.selection.toggle(select)
    }
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      data: { edit: edit, task: edit ? sel! : null },
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
