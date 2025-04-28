import { Component, OnInit, ViewChild } from '@angular/core';
import { AuditlogService } from '@app/shared/services/auditlog/auditlog.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-auditlogs',
  templateUrl: './auditlogs.component.html',
  styleUrls: ['./auditlogs.component.css']
})
export class AuditlogsComponent implements OnInit {

   @ViewChild(DataTableDirective, { static: false })
   dtElement: DataTableDirective;

   auditLogs: any[] = [];
   filteredLogs: any[] = [];
   fromDate: string = '';
   toDate: string = '';
   selectedUser: string = '';
  
dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
  };
  users: unknown[];

  constructor(private auditLogService: AuditlogService) { }

  ngOnInit(): void {

    this.getAuditLogs();
  }
 
  // getAuditLogs(){
  //   this.auditLogService.getAuditLogs().subscribe((auditlogs) => {
  //     console.log("auditlogs"+this.getAuditLogs);
  //     this.auditLogs = auditlogs;
  //   });
  // }
  getAuditLogs() {
    this.auditLogService.getAuditLogs().subscribe((logs) => {
      this.auditLogs = logs;
      this.filteredLogs = logs;
      this.users = [...new Set(logs.map(log => log.userName))]; // Unique usernames
      this.dtTrigger.next(true);
    });
  }

  filterAuditLogs() {
    this.filteredLogs = this.auditLogs.filter(log => {
      const logDate = new Date(log.createdDate).toLocaleDateString('en-CA'); // YYYY-MM-DD
  
      const matchDate =
        (!this.fromDate || logDate >= this.fromDate) &&
        (!this.toDate || logDate <= this.toDate);
  
      const matchUser =
        !this.selectedUser || log.userName === this.selectedUser;
  
      return matchDate && matchUser;
    });
  
    // Re-render DataTable with new filtered logs
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear();
      dtInstance.rows.add(this.filteredLogs);
      dtInstance.draw();
    });
  }
  
  clearFilters() {
    this.fromDate = '';
    this.toDate = '';
    this.selectedUser = '';
    this.filteredLogs = [...this.auditLogs];
  
    // Re-render DataTable with original logs
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear();
      dtInstance.rows.add(this.filteredLogs);
      dtInstance.draw();
    });
  }

}
