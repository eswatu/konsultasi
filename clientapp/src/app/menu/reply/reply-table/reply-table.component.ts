import { Component } from '@angular/core';
import { Reply } from '@app/_models/reply';
import { ReplyService } from '@app/_services';

@Component({
  selector: 'app-reply-table',
  templateUrl: './reply-table.component.html',
  styleUrls: ['./reply-table.component.css']
})
export class ReplyTableComponent {
  private replies: [Reply];
  public displayedColumns;
  public defaultSortColumn: string = "createdAt";
  public defaultSortOrder: SortDirection = "asc";
  defaultFilterColumn: string = null;
  filterQuery: string = null;

  constructor(private rplService:ReplyService,
    private authService: AuthenticationService,
    public dialog: MatDialog) {
  
      
    };

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
    getData(event: PageEvent) { 
      this.replies = null;
      var sortColumn = 'ceratedAt';
      var sortOrder = "asc";
      var filterColumn = null;
      var filterQuery = null;
  
      //use service
      this.rplService.getData<ApiResult<assignLetter>>(
        event.pageIndex, event.pageSize,
        sortColumn, sortOrder,
        filterColumn, filterQuery).subscribe(result => {
          result.data.forEach(d => {
            if (d.ltActive == true) {
              this.alService.getFileInfo(d.id).subscribe(r => {
                if (r) {
                  d.hasFile = true;
                } else {
                  d.hasFile = false;
                }
              });
            }
          });
  
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.asgnLtrs = new MatTableDataSource<assignLetter>(result.data);
        }, error => console.error(error));
    }
    openForm(al:assignLetter){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.restoreFocus; true;
      dialogConfig.minWidth = 400;
      dialogConfig.minHeight = 400;
      if (al) {
        dialogConfig.data = {  id: al.id};
      }
      const dialogRef = this.dialog.open(AssignLetterFormComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => this.loadData(null) );
    }
}
