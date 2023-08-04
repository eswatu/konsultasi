import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  public tickets : Ticket[];
  showTable = false;
  @Input() isSolved :boolean; 

  authUserId: number;
  user;
  defaultPageIndex: number = 0;
  defaultPageSize: number = 5;
  public defaultSortColumn: string = "id";
  public defaultSortOrder: 'asc' | 'desc' = "desc";

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
        }
      });
    }

  ngOnInit(): void {
    this.loadData('null');
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
  getData(event: PageEvent) { 
    var sortColumn = (this.sort) ? this.sort.active : this.defaultSortColumn;
    var sortOrder = (this.sort) ? this.sort.direction as 'asc' | 'desc' : this.defaultSortOrder;
    var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
    var filterQuery = (this.filterQuery) ? this.filterQuery : null;
    var isSolved = this.isSolved!;
    //use service
    this.tService.getsData<ApiResult<Ticket>>(
      event.pageIndex, event.pageSize,
      sortColumn, sortOrder,
      isSolved,
      filterColumn, filterQuery).subscribe({
        next: (result) => {
            this.paginator.length = result.totalCount;
            this.paginator.pageIndex = result.pageIndex;
            this.paginator.pageSize = result.pageSize;
            this.tickets = result.data;
            },
        error: error => console.error(error)});
  }
  openForm(tc:Ticket){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.restoreFocus = true;
    dialogConfig.minWidth = 400;
    dialogConfig.minHeight = 480;
    dialogConfig.maxHeight = 800;
    if (tc) {
      dialogConfig.data = {  id: tc.id};
    }
    const dialogRef = this.dialog.open(TicketFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.loadData(null) );
  }
  toggleTable() {
    this.showTable = !this.showTable;
  }
}
