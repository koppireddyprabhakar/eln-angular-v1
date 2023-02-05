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
  selector: 'app-formulations-projects',
  templateUrl: './formulations-projects.component.html',
  styleUrls: ['./formulations-projects.component.css'],
})
export class FormulationsProjectsComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  projects: any = [];
  myProjects: any = [];
  subscribeFlag = true;
  allProjColumns: any;
  myProjColumns: any;
  options: any = { rowClickEvent: true };

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  dtMyProjectsTrigger: Subject<any> = new Subject<any>();
  dtMyProjectsOptions = {
    pagingType: 'full_numbers',
  };

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor(
    private readonly globalService: GlobalService,
    private readonly projectService: ProjectService,
    private readonly formulationService: FormulationsService,
    private readonly experimentService: ExperimentService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getProjects();
    this.getMyProjects();
    this.myProjColumns = [
      { key: 'projectName', title: 'Project Name' },
      { key: 'productName', title: 'Product Name' },
      { key: 'productCode', title: 'Product Code' },
      { key: 'dosageName', title: 'Dosage Name' },
      { key: 'formulationName', title: 'Formulation Type' },
      { key: 'strength', title: 'Strength' },
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
                console.log(
                  `The DataTable ${index} instance ID is: ${
                    dtInstance.table().node().id
                  }`
                );
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
    this.route.navigateByUrl(`/create-forms?projectId=${id}`);
  }

  onRowClick(event) {
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

  // ngOnDestroy(): void {
  //   // Do not forget to unsubscribe the event
  //   this.dtTrigger.unsubscribe();
  // }
}
