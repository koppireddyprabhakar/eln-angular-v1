import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { TrfService } from '@app/shared/services/test-request-form/trf.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-analysis-list',
  templateUrl: './analysis-list.component.html',
  styleUrls: ['./analysis-list.component.css'],
})
export class AnalysisListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  trfList: any = [];
  unchangedTrfList: any = [];
  selectedUser: any = {};
  projectId: number;
  subscribeFlag = true;
  columns: any;
  options: any = { checkboxes: true };
  isDuplicate = false;
  showAddForm = false;
  selectedRows: any = [];
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {
    pagingType: 'full_numbers',
    select: true,
  };

  constructor(
    private readonly testRequestService: TrfService,
    private toastr: ToastrService,
    private route: Router,
    private analysisService: AnalysisService,
    private readonly globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.getAnalysisList();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  getAnalysisList() {
    this.globalService.showLoader();
    const flatten = (object) => {
      let value = {};
      for (var property in object) {
        if (typeof object[property] === 'object') {
          for (var p in object[property]) {
            value[p] = object[property][p];
          }
        } else {
          value[property] = object[property];
        }
      }
      return value;
    };
    this.testRequestService.getTestRequestForms().subscribe((data) => {
      this.unchangedTrfList = data;
      this.trfList = data;
      this.trfList = this.trfList.map((trf) => flatten(trf));
      console.log(this.trfList);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next(this.trfList);
      });
      this.globalService.hideLoader();
    });
  }

  onCheckboxClick(selectCheckBoxArr) {
    if (
      !this.selectedRows.some(
        (e) => e.testRequestFormId === selectCheckBoxArr.testRequestFormId
      )
    ) {
      this.selectedRows.push(selectCheckBoxArr);
      /* same result as above, but a different function return type */
    } else {
      this.selectedRows = this.selectedRows.filter(
        (e) => e.testRequestFormId !== selectCheckBoxArr.testRequestFormId
      );
    }
    console.log(this.selectedRows);
    var valueArr = this.selectedRows.map((item) => item.projectName);
    console.log(valueArr[0]);
    const selectedTrfList = this.unchangedTrfList.filter(
      (list) => list.project.projectName === valueArr[0]
    );
    console.log(selectedTrfList[0].project.projectId);
    this.projectId = selectedTrfList[0].project.projectId;
    this.isDuplicate = valueArr.every((arr) => valueArr[0] === arr);
    this.analysisService.syncTrf(this.selectedRows);
  }

  createExperiment() {
    if (this.isDuplicate) {
      this.route.navigateByUrl(
        `/exp-analysis/dashboard?projectId=${this.projectId}`
      );
    } else {
      this.toastr.warning('Please Select TRFs of same projects', 'Warning');
    }
  }
}
