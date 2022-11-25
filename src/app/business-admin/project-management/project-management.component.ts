import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from '@app/shared/services/global/global.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeWhile } from 'rxjs';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css'],
})
export class ProjectManagementComponent implements OnInit {
  projects: any = [];
  selectedProject: any = {};
  subscribeFlag = true;
  projectForm = this.formBuilder.group({
    projectName: ['', [Validators.required]],
    status: [''],
    productName: [''],
    productCode: [''],
    projectID: [''],
    dosageForm: [''],
    strngth: [''],
    formulationType: [''],
    formulationTeam: [''],
    market: [''],
  });
  columns: any;
  options: any = {};

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor(
    private readonly projectService: ProjectService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService,
    private route: Router
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
      {
        key: 'options',
        title: '<div class="blue">Options</div>',
        align: { head: 'center', body: 'center' },
        sorting: false,
        width: 150,
        cellTemplate: this.actionTpl,
      },
    ];
  }

  addProject() {
    this.selectedProject = {};
    this.projectForm.reset();
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

  confirmInwardDeletetion(project) {
    this.selectedProject = project;
  }

  editProject(project) {
    console.log(project);
    this.route.navigateByUrl(
      `/business-admin/project-management/add-project?projectId=${project.projectId}`
    );
  }

  deleteProject() {
    this.selectedProject = { ...this.selectedProject, status: 'Inactive' };
    this.projectService
      .deleteProject(this.selectedProject)
      .pipe(
        takeWhile(() => this.subscribeFlag),
        finalize(() => {
          this.globalService.hideLoader();
        })
      )
      .subscribe(() => {
        this.getProjects();
        this.closeDeleteButton.nativeElement.click();
        this.toastr.success('Inward has been deleted succesfully', 'Success');
      });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
