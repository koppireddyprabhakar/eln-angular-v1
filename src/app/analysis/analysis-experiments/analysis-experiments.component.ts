import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-analysis-experiments',
  templateUrl: './analysis-experiments.component.html',
  styleUrls: ['./analysis-experiments.component.scss'],
})
export class AnalysisExperimentsComponent implements OnInit {
  experiments: any = [];
  myExperiments: any = [];
  subscribeFlag = true;
  expColumns: any;
  myExpColumns: any;
  options: any = { rowClickEvent: true };

  @ViewChild('expActionTpl', { static: true }) expActionTpl: TemplateRef<any>;

  constructor(
    private readonly globalService: GlobalService,
    private readonly analysisService: AnalysisService,
    private readonly formulationService: FormulationsService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getExperiments();
    this.expColumns = [
      { key: 'analysisName', title: 'Analysis Name' },
      { key: 'projectId', title: 'Project Id' },

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
    this.myExpColumns = [
      { key: 'analysisName', title: 'Experiment Name' },
      { key: 'batchNumber', title: 'Batch No.' },
      { key: 'batchSize', title: 'Batch Size' },
      { key: 'projectId', title: 'Project ID' },
      { key: 'formulationName', title: 'Formulation Type' },
      { key: 'strength', title: 'Strength' },
      { key: 'status', title: 'Status' },
    ];
  }

  getExperiments() {
    this.globalService.showLoader();
    this.analysisService
      .getALlAnalysisExperiments()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((experiments) => {
        this.experiments = experiments;
        this.globalService.hideLoader();
      });
  }

  getMyExperiments() {
    // this.globalService.showLoader();
    this.analysisService
      .getAnalysisExperimentById(5)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((myExperiments) => {
        this.myExperiments = myExperiments;
        this.globalService.hideLoader();
      });
  }

  onRowClick(event) {
    this.route.navigateByUrl(
      `/exp-analysis/exp-dashboard?projectId=${event.projectId}&analysisId=${event.analysisId}&edit=true`
    );
  }
}
