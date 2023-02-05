import {
  Component,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject, takeWhile } from 'rxjs';

@Component({
  selector: 'app-formulations-experiment',
  templateUrl: './formulations-experiment.component.html',
  styleUrls: ['./formulations-experiment.component.css'],
})
export class FormulationsExperimentComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  experiments: any = [];
  myExperiments: any = [];
  subscribeFlag = true;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  dtMyProjectsTrigger: Subject<any> = new Subject<any>();
  dtMyProjectsOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
  };

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('expActionTpl', { static: true }) expActionTpl: TemplateRef<any>;

  constructor(
    private readonly globalService: GlobalService,
    private readonly projectService: ProjectService,
    private readonly formulationService: FormulationsService,
    private readonly experimentService: ExperimentService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getExperiments();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtMyProjectsTrigger.next(null);
  }

  getExperiments() {
    this.globalService.showLoader();
    this.experimentService
      .getExperiments()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((experiments) => {
        this.experiments = experiments;
        this.dtElements.forEach(
          (dtElement: DataTableDirective, index: number) => {
            dtElement.dtInstance.then((dtInstance: any) => {
              if (dtInstance.table().node().id === 'first-table') {
                dtInstance.destroy();
                this.dtTrigger.next(this.experiments);
              }
            });
          }
        );
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
        this.dtElements.forEach(
          (dtElement: DataTableDirective, index: number) => {
            dtElement.dtInstance.then((dtInstance: any) => {
              if (dtInstance.table().node().id === 'second-table') {
                dtInstance.destroy();
                this.dtMyProjectsTrigger.next(this.myExperiments);
              }
            });
          }
        );
        this.globalService.hideLoader();
      });
  }

  createFormulation(id) {
    this.route.navigateByUrl(`/create-forms?projectId=${id}`);
  }

  onRowClick(event) {
    console.log(event);
    this.route.navigateByUrl(
      `/create-forms?projectId=${event.projectId}&experimentId=${event.expId}&edit=true`
    );
  }

  addTrf(row) {
    this.route.navigateByUrl(`/forms-page/add-trf?expId=${row.expId}`);
    // var someTabTriggerEl = document.querySelector('#projects');
    // var tab = new bootstrap.Tab(someTabTriggerEl)
    // someTabTriggerEl.show()
  }
}
