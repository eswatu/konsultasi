import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService } from '@app/_services';
import { ApiResult } from '@app/_services/base.service';
import { TicketService } from '@app/_services/ticket.service';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';

@Component({
  selector: 'tickets-component',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  public displayedColumns;
  public tickets: MatTableDataSource<Ticket>;

  authUserId: number;
  isAdmin: boolean;
  user;
  defaultPageIndex: number = 0;
  defaultPageSize: number = 5;
  public defaultSortColumn: string = "id";
  public defaultSortOrder : SortDirection = "desc";

  defaultFilterColumn: string = null;
  filterQuery: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tService:TicketService,
    private authService: AuthenticationService,
    public dialog: MatDialog) {
      this.authService.user.subscribe(u => {
        this.user = u;
        if (this.user) {
          this.authUserId = u.id;
          this.isAdmin = ( u.role === "Admin") ? true : false;
        }
      });
    }

  ngOnInit(): void {
    this.loadData(null);
  }
  loadData(q: string = null) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    if (q) { 
      this.filterQuery = q;
    }
    this.getData(pageEvent);
  }
  editable(uid:number){
    return this.authUserId == uid;
  }
  getData(event: PageEvent) { 
    this.tickets = null;
    var sortColumn = (this.sort) ? this.sort.active : this.defaultSortColumn;
    var sortOrder = (this.sort) ? this.sort.direction : this.defaultSortOrder;
    var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
    var filterQuery = (this.filterQuery) ? this.filterQuery : null;
  
    //use service
    this.tService.getData<ApiResult<Ticket>>(
      event.pageIndex, event.pageSize,
      sortColumn, sortOrder,
      filterColumn, filterQuery).subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.tickets = new MatTableDataSource<Ticket>(result.data);
      }, error => console.error(error));
  }
  openForm(tc:Ticket){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.restoreFocus; true;
    dialogConfig.minWidth = 400;
    dialogConfig.minHeight = 400;
    if (tc) {
      dialogConfig.data = {  id: tc.id};
    }
    const dialogRef = this.dialog.open(TicketFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.loadData(null) );
  }
}
