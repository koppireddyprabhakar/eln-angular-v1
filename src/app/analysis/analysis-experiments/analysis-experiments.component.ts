import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
    private readonly experimentService: ExperimentService,
    private readonly formulationService: FormulationsService
  ) {}

  ngOnInit(): void {
    this.getExperiments();
    this.expColumns = [
      { key: 'experimentName', title: 'Experiment Name' },
      { key: 'batchNumber', title: 'Batch No.' },
      { key: 'batchSize', title: 'Batch Size' },
      { key: 'projectId', title: 'Project ID' },
      { key: 'formulationName', title: 'Formulation Type' },
      { key: 'strength', title: 'Strength' },
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
      { key: 'experimentName', title: 'Experiment Name' },
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
    this.experimentService
      .getExperiments()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((experiments) => {
        this.experiments = experiments;
        this.globalService.hideLoader();
      });
  }

  getMyExperiments() {
    this.globalService.showLoader();
    this.formulationService
      .getExperimentsByUserId()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((myExperiments) => {
        this.myExperiments = myExperiments;
        this.globalService.hideLoader();
      });
  }
}
