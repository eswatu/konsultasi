import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService } from '@app/_services';
import { ApiResult } from '@app/_services/base.service';
import { TicketService } from '@app/_services/ticket.service';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';
import { User } from '@app/_models';
@Component({
  selector: 'tickets-component',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[];
  authUserId: number;
  user: User;
  defaultPageIndex = 0;
  defaultPageSize = 5;
  defaultSortColumn = 'createdAt';
  defaultSortOrder: 'asc' | 'desc' = 'desc';
  @Input() isSolved;
  defaultFilterColumn: string = null;
  filterQuery: string = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selectedOption: string;
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  searchTerm: string;

  search() {
    // your search logic here
  }

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
    this.loadData('null');

  }

  loadData(q: string = null): void {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    if (q) {
      this.filterQuery = q;
    }
    this.getData(pageEvent);

  }

async getData(event: PageEvent) {
  const sortColumn = this.sort ? this.sort.active : this.defaultSortColumn;
  const sortOrder = this.sort ? (this.sort.direction as 'asc' | 'desc') : this.defaultSortOrder;
  const filterColumn = this.filterQuery ? this.defaultFilterColumn : null;
  const filterQuery = this.filterQuery ? this.filterQuery : null;
  const isSolved = this.isSolved ?? false;
  try {
    this.tService.getsData<ApiResult<Ticket>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      isSolved,
      filterColumn,
      filterQuery
    ).subscribe(result => {
      this.paginator.length = result.totalCount;
      this.paginator.pageIndex = result.pageIndex;
      this.paginator.pageSize = result.pageSize;
      this.tickets = result.data;
      //debug tickets
      // console.log(this.tickets);
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
}