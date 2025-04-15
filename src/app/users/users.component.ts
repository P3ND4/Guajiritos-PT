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
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateUserComponent } from './create-user/create-user.component';

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
  imports: [MatTableModule, MatCheckboxModule, MatCardModule, MatButtonModule, MatIconModule],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  usersList: IUser[] = []

  dataSource = new MatTableDataSource<IUser>(this.usersList);
  selection = new SelectionModel<IUser>(true, []);


  constructor(private api: ApiDbService) { }




  ngOnInit(): void {
    this.api.getUsers().subscribe((response: IUser[]) => {
      this.usersList = response
      this.dataSource = new MatTableDataSource<IUser>(this.usersList)
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
      this.usersList = this.usersList.filter(elem => elem.id != sel.id)
      this.dataSource = new MatTableDataSource<IUser>(this.usersList)
      this.selection.toggle(sel)
      this.api.deleteUser(sel.id!).subscribe(response => {
        console.log(response)
      }
      )
    }
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
