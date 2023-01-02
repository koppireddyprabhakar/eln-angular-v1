import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-formulations',
  templateUrl: './formulations.component.html',
  styleUrls: ['./formulations.component.css'],
})
export class FormulationsComponent implements OnInit {
  projects: any = [];
  experiments: any = [];
  myExperiments: any = [];
  myProjects: any = [];
  subscribeFlag = true;
  allProjColumns: any;
  myProjColumns: any;
  expColumns: any;
  myExpColumns: any;
  options: any = { rowClickEvent: true };

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
    this.getProjects();
    this.getExperiments();
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
      {
        key: 'options',
        title: '<div class="blue">Options</div>',
        align: { head: 'center', body: 'center' },
        sorting: false,
        width: 120,
        cellTemplate: this.expActionTpl,
      },
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

  createFormulation(id) {
    console.log(id);
    this.route.navigateByUrl(`/create-forms?projectId=${id}`);
  }

  onRowClick(event) {
    console.log(event);
    this.route.navigateByUrl(
      `/create-forms?projectId=${event.projectId}&experimentId=${event.expId}&edit=true`
    );
  }

  addTrf(row) {
    console.log(row);
    this.route.navigateByUrl(`/forms-page/add-trf?expId=${row.expId}`);
    // var someTabTriggerEl = document.querySelector('#projects');
    // var tab = new bootstrap.Tab(someTabTriggerEl)
    // console.log(someTabTriggerEl);
    // someTabTriggerEl.show()
  }
}
