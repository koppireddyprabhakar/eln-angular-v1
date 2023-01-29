import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-review-formulations-list',
  templateUrl: './review-formulations-list.component.html',
  styleUrls: ['./review-formulations-list.component.scss'],
})
export class ReviewFormulationsListComponent implements OnInit {
  experiments: any = [];
  myExpColumns: any;
  options: any = { rowClickEvent: true };
  myExperiments: any = [];
  subscribeFlag = true;

  @ViewChild('expActionTpl', { static: true }) expActionTpl: TemplateRef<any>;

  constructor(
    private readonly globalService: GlobalService,
    private readonly analysisService: AnalysisService,
    private readonly formulationService: FormulationsService,
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

  getMyExperiments() {
    // this.globalService.showLoader();

    this.formulationService
      .getExperimentsByUserId()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((myExperiments) => {
        this.myExperiments = myExperiments;
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
