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
  selector: 'app-analysis-projects',
  templateUrl: './analysis-projects.component.html',
  styleUrls: ['./analysis-projects.component.scss'],
})
export class AnalysisProjectsComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  projects: any = [];
  myProjects: any = [];
  subscribeFlag = true;
  allProjColumns: any;
  myProjColumns: any;
  options: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  dtMyProjectsTrigger: Subject<any> = new Subject<any>();
  dtMyProjectsOptions = {
    pagingType: 'full_numbers',
  };

  constructor(
    private readonly globalService: GlobalService,
    private readonly projectService: ProjectService,
    private readonly formulationService: FormulationsService,
    private readonly experimentService: ExperimentService,
    private readonly route: Router
  ) {}

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  ngOnInit(): void {
    this.getProjects();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtMyProjectsTrigger.next(null);
  }

  getProjects() {
    this.globalService.showLoader();
    this.projectService
      .getProjects()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((projects) => {
        this.projects = projects;
        this.dtElements.forEach(
          (dtElement: DataTableDirective, index: number) => {
            dtElement.dtInstance.then((dtInstance: any) => {
              if (dtInstance.table().node().id === 'first-table') {
                dtInstance.destroy();
                this.dtTrigger.next(this.projects);
              }
            });
          }
        );
        this.globalService.hideLoader();
      });
  }

  getMyProjects() {
    this.globalService.showLoader();
    this.formulationService
      .getProjectsTeamsId()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((myProjects) => {
        this.myProjects = myProjects;
        this.dtElements.forEach(
          (dtElement: DataTableDirective, index: number) => {
            dtElement.dtInstance.then((dtInstance: any) => {
              if (dtInstance.table().node().id === 'second-table') {
                dtInstance.destroy();
                console.log(this.myProjects);
                this.dtMyProjectsTrigger.next(this.myProjects);
              }
            });
          }
        );
        this.globalService.hideLoader();
      });
  }

  createFormulation(id) {
    this.route.navigateByUrl(`/exp-analysis/analysis-exp?projectId=${id}`);
  }
}
