import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService } from '@app/_services';
import { ApiResult } from '@app/_services/base.service';
import { TicketService } from '@app/_services/ticket.service';
// import { TicketFormComponent } from '../../consult/ticket-form/ticket-form.component';
import { User } from '@app/_models';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'tickets-component',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  @Input({required:true}) isSolved;
  tickets: Ticket[];
  authUserId: string;
  user: User;
  defaultPageIndex = 0;
  defaultPageSize = 10;
  defaultSortColumn = 'createdAt';
  defaultSortOrder: 'asc' | 'desc' = 'desc';
  defaultFilterColumn: string = 'name';
  filterQuery: string = null;
  filterColumn = new FormControl();
  filterQ = new FormControl();

  dateFilter = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl('')
  });

  sdate: string = null;
  edate: string = null;
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
    
  ) {
    this.authService.user.subscribe((u) => {
      this.user = u;
      if (this.user) {
        this.authUserId = u.id;
      }
    });
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
    if (this.dateFilter.value) {
      // console.log(typeof(this.dateFilter.value['startDate']));
      this.sdate = this.formatDate(this.dateFilter.value['startDate']);
      this.edate = this.formatDate(this.dateFilter.value['endDate']);
    }
    this.getData(pageEvent);
  }

async getData(event: PageEvent) {
  const sortColumn = this.sort ? this.sort.active : this.defaultSortColumn;
  const sortOrder = this.sort ? (this.sort.direction as 'asc' | 'desc') : this.defaultSortOrder;
  const filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
  const filterQuery = this.filterQuery ? this.filterQuery : null;
  const filterSDate = (this.sdate) ?? '';
  const filterEDate = (this.edate) ?? '';
  const solved = this.isSolved;
  try {
    this.tService.getsData<ApiResult<Ticket>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      solved,
      filterSDate,
      filterEDate,
      filterColumn,
      filterQuery
    ).subscribe(result => {
      this.paginator.length = result.totalCount;
      this.paginator.pageIndex = result.pageIndex;
      this.paginator.pageSize = result.pageSize;
      this.tickets = result.data;
      //debug tickets
      // console.log(result);
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
    // const dialogRef = this.dialog.open(TicketFormComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(() => this.loadData(null));
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
      //helper 
  formatDate(md: any) {
    const inputDate = new Date(md);
  
    // Check if the inputDate is a valid Date object
    if (isNaN(inputDate.getTime())) {
      return "null";
    }
    
    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = inputDate.getFullYear();
    
    return `${day}-${month}-${year}`;
  }
}