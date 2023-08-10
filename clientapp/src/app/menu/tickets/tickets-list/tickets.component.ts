import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService } from '@app/_services';
import { ApiResult } from '@app/_services/base.service';
import { TicketService } from '@app/_services/ticket.service';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';
import { User } from '@app/_models';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'tickets-component',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  @Input({required:true}) isSolved;
  tickets: Ticket[];
  authUserId: number;
  user: User;
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
    { key: 'Nomor Pendaftaran', value: 'nopen' },
    { key: 'Nama Perusahaan', value: 'name' },
    { key: 'Permasalahan', value: 'problem' },
    { key: 'Nama Pembuat', value: 'creator.name'},
    {key: 'Perusahaan Pembuat', value: 'creator.company'},
  ];


  constructor(
    private tService: TicketService,
    private authService: AuthenticationService,
    public dialog: MatDialog,
    
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe((u) => {
      this.user = u;
      if (this.user) {
        this.authUserId = u.id;
      }
    });
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
  const solved = this.isSolved;
  try {
    this.tService.getsData<ApiResult<Ticket>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      solved,
      filterColumn,
      filterQuery
    ).subscribe(result => {
      this.paginator.length = result.totalCount;
      this.paginator.pageIndex = result.pageIndex;
      this.paginator.pageSize = result.pageSize;
      this.tickets = result.data;
      //debug tickets
      //console.log(result.data);
    });
  } catch (error) {
    console.error(error);
  }
}

  openForm(tc: Ticket): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.restoreFocus = true;
    dialogConfig.minWidth = 400;
    dialogConfig.minHeight = 480;
    dialogConfig.maxHeight = 800;
    if (tc) {
      dialogConfig.data = { id: tc.id };
    }
    const dialogRef = this.dialog.open(TicketFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.loadData(null));
  }
  onFilterTextChanged(filterText: string) {
    if (this.filterTextChanged.observers.length === 0) {
        this.filterTextChanged
            .pipe(debounceTime(1000), distinctUntilChanged())
          .subscribe(query => {
            this.tickets = null;
              this.loadData(query);
            });
    }
    this.filterTextChanged.next(filterText);
   }
}