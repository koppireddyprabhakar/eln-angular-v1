import { Component, OnInit, ViewChild } from '@angular/core';
import { AuditlogService } from '@app/shared/services/auditlog/auditlog.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
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
  loading: boolean = true;
  users: unknown[];
  toastr: any;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  userId: number;
  deptId: number;

  constructor(private auditLogService: AuditlogService,
    private loginService: LoginserviceService
  ) { }

  ngOnInit(): void {
    this.userId = this.loginService.userDetails.userId;
    this.deptId = this.loginService.userDetails.deptId;
    if (this.deptId === 3) {
      this.getAuditLogs();
    } else {
      this.getAuditLogsByUserId(this.userId);
    }
  }


  getAuditLogsByUserId(userId: number) {
    this.loading = true;
    this.auditLogService.getAuditLogsByUserId(userId).subscribe(
      (logs) => {
        this.auditLogs = logs;
        this.filteredLogs = logs;
        this.users = [...new Set(logs.map(log => log.userName))];

        setTimeout(() => {
          if (this.dtElement && this.dtElement.dtInstance) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.clear().destroy();
              this.dtTrigger.next(null); // Re-render with new logs
            });
          } else {
            this.dtTrigger.next(null); // First time render
          }
        });

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.toastr?.error('Failed to fetch audit logs by user', 'Error');
      }
    );
  }


  getAuditLogs() {
    this.loading = true;
    this.auditLogService.getAuditLogs().subscribe((logs) => {
      this.auditLogs = logs;
      this.filteredLogs = logs;
      this.users = [...new Set(logs.map(log => log.userName))];
      setTimeout(() => {
        // Destroy existing instance if present
        if (this.dtElement && this.dtElement.dtInstance) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.clear().destroy();
            this.dtTrigger.next(null); // Re-render after cleanup
          });
        } else {
          this.dtTrigger.next(null); // First time render
        }
      });
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toastr?.error('Failed to fetch audit logs', 'Error');
    });
  }

  filterAuditLogs() {
    this.filteredLogs = this.auditLogs
      .filter(log => {
        const logDate = new Date(log.createdDate).toISOString().split('T')[0]; // YYYY-MM-DD

        const matchDate =
          (!this.fromDate || logDate >= this.fromDate) &&
          (!this.toDate || logDate <= this.toDate);
        const matchUser =
          !this.selectedUser || log.userName === this.selectedUser;
        return matchDate && matchUser;
      })
      .map(log => {
        // Attach filter info for PDF header
        return {
          ...log,
          fromDate: this.fromDate ? this.fromDate : null,
          toDate: this.toDate ? this.toDate : null,
          userName: this.selectedUser || log.userName
        };
      });

    // Re-render DataTable with new filtered logs
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.users);
    });
  }


  clearFilters() {
    this.fromDate = '';
    this.toDate = '';
    this.selectedUser = '';
    this.filteredLogs = [...this.auditLogs];
    //Re-render DataTable with original logs
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      //Reinitialize the DataTable after destroying it
      setTimeout(() => {
        this.dtTrigger.next(true);
      });
    });
  }

  downloadAuditPdf() {
    if (!this.filteredLogs || this.filteredLogs.length === 0) {
      this.toastr.warning('No logs to download', 'Warning');
      return;
    }
    const request = {
      logs: this.filteredLogs,
      fromDate: this.fromDate || undefined, 
      toDate: this.toDate || undefined,    
      userName: this.selectedUser || undefined
    };
    this.auditLogService.downloadAuditPdf(request).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'AUDIT_REPORT.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('Audit Report PDF downloaded successfully', 'Success');
      },
      (error) => {
        this.toastr.error('Failed to download Audit Report PDF', 'Error');
      }
    );
  }

}
