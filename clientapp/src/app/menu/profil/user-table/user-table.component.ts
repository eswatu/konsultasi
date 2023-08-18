import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from '@app/_models';
import { AuthenticationService, UserService } from '@app/_services';
import { ApiResult } from '@app/_services/base.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserPwFormComponent } from '../user-pw-form/user-pw-form.component';
import { DialogConfig } from '@angular/cdk/dialog';

@Component({
  selector: 'user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent {
  users: User[];
  defaultPageIndex = 0;
  defaultPageSize = 10;
  defaultSortColumn = 'createdAt';
  defaultSortOrder: 'asc' | 'desc' = 'desc';
  defaultFilterColumn: string = 'name';
  filterQuery: string = null;
  filterColumn = new FormControl();
  filterQ = new FormControl();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filterTextChanged: Subject<string> = new Subject<string>();

  selectedOption: {key:string, value: string};
  options: { key: string, value: string }[] = [
    { key: 'Nama Orang', value: 'name' },
    { key: 'Nama Perusahaan', value: 'company' },
    { key: 'Username', value: 'username' },
    { key: 'Role', value: 'role'},
  ];
  constructor(private userService: UserService,public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.loadData(null);
  }
  loadData(q: string = null): void {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    if (q && this.defaultFilterColumn !== '') {
      this.filterQuery = q;
      this.defaultFilterColumn = this.filterColumn.value;
    }
    this.getData(pageEvent);
  }
async getData(event: PageEvent) {
  const sortColumn = this.sort ? this.sort.active : this.defaultSortColumn;
  const sortOrder = this.sort ? (this.sort.direction as 'asc' | 'desc') : this.defaultSortOrder;
  const filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
  const filterQuery = this.filterQuery ? this.filterQuery : null;
  try {
    this.userService.getData<ApiResult<User>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery
    ).subscribe(result => {
      this.paginator.length = result.totalCount;
      this.paginator.pageIndex = result.pageIndex;
      this.paginator.pageSize = result.pageSize;
      this.users = result.data;
      //debug tickets
      console.log(result.data);
    });
  } catch (error) {
    console.error(error);
  }
}
onFilterTextChanged(filterText: string) {
  if (this.filterTextChanged.observers.length === 0) {
      this.filterTextChanged
          .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => {
          this.users = null;
            this.loadData(query);
          });
  }
  this.filterTextChanged.next(filterText);
 }
  openForm(usr: User){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.restoreFocus = true;
    dialogConfig.minWidth = 400;
    dialogConfig.minHeight = 480;
    dialogConfig.maxHeight = 800;
    if (usr) {
      dialogConfig.data = { id: usr.id };
    }
    const dialogRef = this.dialog.open(UserFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.loadData(null));
  }
  changePassword(usr:User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.restoreFocus = true;
    dialogConfig.minWidth = 400;
    dialogConfig.minHeight = 200;
    dialogConfig.maxHeight = 400;
    if (usr) {
      dialogConfig.data = { id: usr.id };
    }
    const dialogRef = this.dialog.open(UserPwFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.loadData(null));
  }
  displayedColumns: string[] = ['username', 'name', 'company', 'role', 'contact','isActive', 'aksi'];
}
