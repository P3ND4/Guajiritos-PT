import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { IUser } from '../models/user';
import { ApiDbService } from '../services/api.db/api.db.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { response } from 'express';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from './create-user/create-user.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';



export interface DialogData {
  edit: boolean,
  user: IUser
}

/**
 * @title Table with selection
 */
@Component({
  standalone: true,
  selector: 'users-table',
  styleUrl: 'users.component.css',
  templateUrl: 'users.component.html',
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  usersList: IUser[] = []

  dataSource = new MatTableDataSource<IUser>(this.usersList);
  selection = new SelectionModel<IUser>(true, []);

  isLoading = false
  constructor(private api: ApiDbService, private auth: AuthService, private snackB: MatSnackBar) { }




  ngOnInit(): void {
    this.isLoading = true
    this.api.getUsers().subscribe({
      next: (response: IUser[]) => {
        this.usersList = response
        this.dataSource = new MatTableDataSource<IUser>(this.usersList)
        this.isLoading = false
      },
      error: (err: Error) => {
        this.isLoading = false
        this.showError(`Error al cargar los usuarios: ${err.message}`)
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

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: IUser): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  isAnySelected() {
    return this.selection.selected.length == 0
  }
  deleteSelected() {
    for (let sel of this.selection.selected) {
      if (sel.id == this.auth.getCurrentUser().id) {
        this.showError('No puedes eliminar tu propio usuario');
        continue
      }
      this.api.deleteUser(sel.id!).subscribe({
        next: (response) => {
          this.usersList = this.usersList.filter(elem => elem.id != sel.id)
          this.dataSource = new MatTableDataSource<IUser>(this.usersList)
          this.selection.toggle(sel)
          console.log(response)
        },
        error: (error: Error) => {
          console.log(error)
          this.showError(`No se pudo eliminar el usuario:${error.message} `);
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
    var sel: IUser | undefined;
    if (edit) {
      sel = this.selection.selected[0]
    }
    for (const select of this.selection.selected) {
      this.selection.toggle(select)
    }
    const dialogRef = this.dialog.open(CreateUserComponent, {
      data: { edit: edit, user: edit ? sel : null }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.selection.deselect(this.selection.selected[0])
      this.api.getUsers().subscribe(response => {
        this.usersList = response
        this.dataSource = new MatTableDataSource<IUser>(this.usersList)
      })

    });
  }

  canEdit() {
    return this.selection.selected.length == 1
  }
}
