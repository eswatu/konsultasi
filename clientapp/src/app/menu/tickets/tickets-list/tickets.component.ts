import { Component, Injector, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService } from '@app/_services';
import { ApiResult } from '@app/_services/base.service';
import { TicketService } from '@app/_services/ticket.service';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';
import { ReplyTableComponent } from '@app/menu/reply/reply-table/reply-table.component';
@Component({
  selector: 'tickets-component',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  panelStatus: boolean[] = [false, false, false]; // False: Panel ditutup, True: Panel terbuka
  public displayedColumns;
  public tickets : Ticket[];
  showTable = false;
  replyTableComponent = ReplyTableComponent;
  lazyLoadInjector : Injector;
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
    public dialog: MatDialog, private parentInjector: Injector) {
      this.authService.user.subscribe(u => {
        this.user = u;
        if (this.user) {
          this.authUserId = u.id;
        }
      });
      this.lazyLoadInjector = Injector.create({
        providers:[],
        parent: this.parentInjector,
        name: 'replyTableComponent'
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
    const sortColumn = this.sort ? this.sort.active : this.defaultSortColumn;
    const sortOrder = this.sort ? this.sort.direction as 'asc' | 'desc' : this.defaultSortOrder;
    const filterColumn = this.filterQuery ? this.defaultFilterColumn : null;
    const filterQuery = this.filterQuery ? this.filterQuery : null;
    const isSolved = this.isSolved ?? false;
  
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
        error: error => console.error(error)
      });
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
