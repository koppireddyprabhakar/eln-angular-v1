import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrfService } from '@app/shared/services/test-request-form/trf.service';

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
  showAddForm = false;
  selectedRows = [];
  constructor(
    private readonly testRequestService: TrfService,
    private route: Router
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
    // alert(JSON.stringify(selectCheckBoxArr));
  }

  createExperiment() {
    this.route.navigateByUrl(
      `/exp-analysis/dashboard?projectId=${33}&experimentId=${94}`
    );
  }
}
