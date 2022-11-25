import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  myProjects: any = [];
  subscribeFlag = true;
  columns: any;
  expColumns: any;
  options: any = {};

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor(
    private readonly globalService: GlobalService,
    private readonly projectService: ProjectService,
    private readonly formulationService: FormulationsService
  ) {}

  ngOnInit(): void {
    this.getProjects();
    this.columns = [
      { key: 'projectName', title: 'Project Name' },
      { key: 'productName', title: 'Product Name' },
      { key: 'productCode', title: 'Product Code' },
      { key: 'projectId', title: 'Project ID' },
      { key: 'dosageName', title: 'Dosage Name' },
      { key: 'formulationName', title: 'Formulation Type' },
      { key: 'strength', title: 'Strength' },
      { key: 'formulationName', title: 'Formulation Department' },
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
    this.expColumns = [
      { key: 'projectName', title: 'Project Name' },
      { key: 'productName', title: 'Product Name' },
      { key: 'productCode', title: 'Product Code' },
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
}
