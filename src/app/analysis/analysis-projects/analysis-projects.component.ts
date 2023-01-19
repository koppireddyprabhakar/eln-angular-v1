import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-analysis-projects',
  templateUrl: './analysis-projects.component.html',
  styleUrls: ['./analysis-projects.component.scss'],
})
export class AnalysisProjectsComponent implements OnInit {
  projects: any = [];
  myProjects: any = [];
  subscribeFlag = true;
  allProjColumns: any;
  myProjColumns: any;
  options: any = {};
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
    this.myProjColumns = [
      { key: 'projectName', title: 'Project Name' },
      { key: 'productName', title: 'Product Name' },
      { key: 'productCode', title: 'Product Code' },
      // { key: 'projectId', title: 'Project ID' },
      { key: 'dosageName', title: 'Dosage Name' },
      { key: 'formulationName', title: 'Formulation Type' },
      { key: 'strength', title: 'Strength' },
      // { key: 'formulationName', title: 'Formulation Department' },
      { key: 'status', title: 'Status' },
      {
        key: 'options',
        title: '<div class="blue">Options</div>',
        align: { head: 'center', body: 'center' },
        sorting: false,
        width: 120,
        cellTemplate: this.actionTpl,
      },
    ];
    this.allProjColumns = [
      { key: 'projectName', title: 'Project Name' },
      { key: 'productName', title: 'Product Name' },
      { key: 'productCode', title: 'Product Code' },
      { key: 'projectId', title: 'Project ID' },
      { key: 'dosageName', title: 'Dosage Name' },
      { key: 'formulationName', title: 'Formulation Type' },
      { key: 'strength', title: 'Strength' },
      { key: 'formulationName', title: 'Formulation Department' },
      { key: 'status', title: 'Status' },
    ];
  }

  getProjects() {
    this.globalService.showLoader();
    this.projectService
      .getProjects()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((projects) => {
        this.projects = projects;
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
        this.globalService.hideLoader();
      });
  }

  createFormulation(id) {
    this.route.navigateByUrl(
      `/exp-analysis/analysis-exp?projectId=${id}`
    );
  }
}
