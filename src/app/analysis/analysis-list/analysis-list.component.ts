import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { TrfService } from '@app/shared/services/test-request-form/trf.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-analysis-list',
  templateUrl: './analysis-list.component.html',
  styleUrls: ['./analysis-list.component.css'],
})
export class AnalysisListComponent implements OnInit {
  trfList: any = [];
  selectedUser: any = {};
  subscribeFlag = true;
  columns: any;
  options: any = { checkboxes: true };
  isDuplicate = false;
  showAddForm = false;
  selectedRows: any = [];
  constructor(
    private readonly testRequestService: TrfService,
    private toastr: ToastrService,
    private route: Router,
    private analysisService: AnalysisService
  ) {}

  ngOnInit(): void {
    this.getAnalysisList();

    this.columns = [
      { key: 'projectName', title: 'Project Name' },
      { key: 'testRequestFormId', title: 'Trf Request Id' },
      { key: 'productName', title: 'Product Name' },
      { key: 'batchNumber', title: 'Batch Number' },
      { key: 'contactNo', title: 'Date Created' },
      { key: 'condition', title: 'Condition' },
      { key: 'testRequestFormStatus', title: 'Test Required' },
      { key: 'status', title: 'Status' },
      // {
      //   key: 'options',
      //   title: '<div class="blue">Options</div>',
      //   align: { head: 'center', body: 'center' },
      //   sorting: false,
      //   width: 150,
      //   cellTemplate: this.actionTpl,
      // },
    ];
  }

  getAnalysisList() {
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
      this.trfList = data;
      this.trfList = this.trfList.map((trf) => flatten(trf));
      console.log(this.trfList);
    });
  }

  onCheckboxClick(selectCheckBoxArr) {
    console.log(selectCheckBoxArr);
    this.selectedRows = selectCheckBoxArr;
    console.log(this.selectedRows);
    var valueArr = this.selectedRows.map((item) => item.projectName);
    console.log(valueArr);
    this.isDuplicate = valueArr.every((arr) => valueArr[0] === arr);
    this.analysisService.syncTrf(this.selectedRows);
    console.log(this.isDuplicate);
    this.analysisService.selectedTrfs$.subscribe((trfs) => {
      console.log(trfs);
    });
    // alert(JSON.stringify(selectCheckBoxArr));
  }

  createExperiment() {
    if (this.isDuplicate) {
      this.route.navigateByUrl(`/exp-analysis/dashboard?projectId=${38}`);
    } else {
      this.toastr.warning('Please Select TRFs of same projects', 'Warning');
    }
  }
}
