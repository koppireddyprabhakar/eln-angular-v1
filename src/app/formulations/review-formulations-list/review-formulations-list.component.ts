import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject, takeWhile } from 'rxjs';

@Component({
  selector: 'app-review-formulations-list',
  templateUrl: './review-formulations-list.component.html',
  styleUrls: ['./review-formulations-list.component.scss'],
})
export class ReviewFormulationsListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  experiments: any = [];
  myExpColumns: any;
  options: any = { rowClickEvent: true };
  myExperiments: any = [];
  subscribeFlag = true;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

  @ViewChild('expActionTpl', { static: true }) expActionTpl: TemplateRef<any>;

  constructor(
    private readonly globalService: GlobalService,
    private readonly analysisService: AnalysisService,
    private readonly formulationService: FormulationsService,
    private readonly experimentService: ExperimentService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getMyExperiments();
    this.myExpColumns = [
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

  getMyExperiments() {
    // this.globalService.showLoader();

    this.experimentService
      .getExperimentsByStatus('Inreview')
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((myExperiments) => {
        this.myExperiments = myExperiments;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.myExperiments);
        });
        this.globalService.hideLoader();
      });
  }

  onRowClick(event) {
    this.route.navigateByUrl(
      `/forms-page/review?projectId=${event.projectId}&analysisId=${event.expId}&edit=true`
    );
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
