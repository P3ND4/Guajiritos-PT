import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { ITask } from '../models/task';
import { ApiDbService } from '../services/api.db/api.db.service';
import { response } from 'express';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from './create-task/create-task.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

/**
 * @title Table with selection
 */
@Component({
  selector: 'tasks-table',
  styleUrl: 'tasks.component.css',
  templateUrl: 'tasks.component.html',
  imports: [MatTableModule, MatCheckboxModule, MatCardModule, MatButtonModule, MatIconModule],
})
export class TasksComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'userName', 'user', 'state'];
  tasks: ITask[] = []
  dataSource = new MatTableDataSource<ITask>(this.tasks);
  selection = new SelectionModel<ITask>(true, []);

  constructor(private api: ApiDbService) { }

  ngOnInit(): void {
    this.api.getTasks().subscribe((response: ITask[]) => {
      this.tasks = response
      this.dataSource = new MatTableDataSource<ITask>(this.tasks);
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
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.api.getTasks().subscribe(response=>{
       this.tasks = response
        this.dataSource = new MatTableDataSource<ITask>(this.tasks)
      })
      
    });
  }


}
