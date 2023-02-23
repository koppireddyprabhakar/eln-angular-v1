import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeWhile } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { GlobalService } from '@app/shared/services/global/global.service';

@Component({
  selector: 'app-coa-generation-list',
  templateUrl: './coa-generation-list.component.html',
  styleUrls: ['./coa-generation-list.component.css']
})
export class CoaGenerationListComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  private subscribeFlag = true;
  dtTrigger: Subject<any> = new Subject<any>();
  public reviewCompletedExps: any = [];
  public tableColumnNames: any = [];
  dtOptions = {
    pagingType: 'full_numbers',
  };

  constructor(
    private readonly globalService: GlobalService,
    private readonly experimentService: ExperimentService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.getReviewCompletedExps();
    this.tableColumnNames = [
      { key: 'experimentName', title: 'Experiment Name' },
      { key: 'batchNumber', title: 'Batch No.' },
      { key: 'batchSize', title: 'Batch Size' },
      { key: 'projectId', title: 'Project ID' },
      { key: 'formulationName', title: 'Formulation Type' },
      { key: 'strength', title: 'Strength' },
      { key: 'status', title: 'Status' },
    ];
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  getReviewCompletedExps() {
    this.globalService.showLoader();

    this.experimentService
      .getExperimentsByStatus('Review Completed')
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((reviewCompletedExps) => {
        this.reviewCompletedExps = reviewCompletedExps;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.reviewCompletedExps);
        });
        this.globalService.hideLoader();
      });
  }

  onRowClick(event) {
    this.route.navigateByUrl(
      `/forms-page/coa-generation?projectId=${event.projectId}&experimentId=${event.expId}`
    );
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
