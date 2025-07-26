import {
  Component,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject, takeWhile } from 'rxjs';

@Component({
  selector: 'app-project-experiments',
  templateUrl: './project-experiments.component.html',
  styleUrls: ['./project-experiments.component.css']
})
export class ProjectExperimentsComponent implements OnInit {

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  @ViewChildren(DataTableDirective)
  dtElementsForAnalysis: QueryList<DataTableDirective>;
  experiments: any = [];
  analysisDetails: any = [];
  subscribeFlag = true;
  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerForAnalysis: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  dtTriggerForAnalysisOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
  };
  projectId: number;

  constructor(
    private readonly globalService: GlobalService,
    private readonly experimentService: ExperimentService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    this.getExperimentsByProjectId();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtTriggerForAnalysis.next(null);
  }

  getExperimentsByProjectId() {
    this.globalService.showLoader();
    this.experimentService
      .getExperimentHistory(this.projectId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((experiments) => {
        this.experiments = experiments;
        /*this.dtElements.forEach(
          (dtElement: DataTableDirective, index: number) => {
            dtElement.dtInstance.then((dtInstance: any) => {
              if (dtInstance.table().node().id === 'first-table') {
                dtInstance.destroy();
                this.dtTrigger.next(this.experiments);
              }
            });
          }
        );*/
        this.globalService.hideLoader();
      });


    // this.globalService.showLoader();
    // this.experimentService
    //   .getExperimentsByProjectId(this.projectId)
    //   .pipe(takeWhile(() => this.subscribeFlag))
    //   .subscribe((experiments) => {
    //     this.experiments = experiments;
    //     this.dtElements.forEach(
    //       (dtElement: DataTableDirective, index: number) => {
    //         dtElement.dtInstance.then((dtInstance: any) => {
    //           if (dtInstance.table().node().id === 'first-table') {
    //             dtInstance.destroy();
    //             this.dtTrigger.next(this.experiments);
    //           }
    //         });
    //       }
    //     );
    //     this.globalService.hideLoader();
    //   });
  }

  viewExperiment(event) {
    this.route.navigateByUrl(
      `/view-formulation-experiment?projectId=${event.projectId}&experimentId=${event.experimentHistoryId}&isVersionHistory=true`
    );
  }

  getAnalysisDetailHistoryByExperimentId(experimentId) {
    this.globalService.showLoader();
    this.experimentService
      .getAnalysisDetailHistoryByExperimentId(experimentId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((analysisDetails) => {
        this.analysisDetails = analysisDetails;

        this.dtElementsForAnalysis.forEach(
          (dtElement: DataTableDirective, index: number) => {
            dtElement.dtInstance.then((dtInstance: any) => {
              if (dtInstance.table().node().id === 'second-table') {
                dtInstance.destroy();
                this.dtTriggerForAnalysis.next(this.analysisDetails);
              }
            });
          }
        );
        this.globalService.hideLoader();
      });

  }

  viewAnalysisExperiment(event) {
    this.route.navigateByUrl(
      `/exp-analysis/view-analysis-experiment?projectId=${event.projectId}&analysisId=${event.analysisHistoryId}&isVersionHistory=true`
    );
  }

}
