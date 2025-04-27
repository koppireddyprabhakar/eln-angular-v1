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
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject, finalize, takeWhile } from 'rxjs';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css'],
})
export class ProjectManagementComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
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
    teamName: [''],
    strngth: [''],
    formulationType: [''],
    formulationTeam: [''],
    market: [''],
  });
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

  @ViewChild('confirmOnHoldModal') confirmOnHoldModal: ElementRef;


  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;
  userDetails: any;

  constructor(
    private readonly projectService: ProjectService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService,
    private route: Router,
    private loginService: LoginserviceService,
  ) { }

  ngOnInit(): void {
    this.userDetails = this.loginService.userDetails
    this.getProjects();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
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
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.projects);
        });
        this.globalService.hideLoader();
      });
  }

  confirmInwardDeletetion(project) {
    this.selectedProject = project;
  }

  editProject(project) {
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
        this.toastr.success('Project has been deleted succesfully', 'Success');
      });
  }

  confirmOnHoldProject(project) {
    this.selectedProject = project;
  }

  OnHoldProject() {
    this.selectedProject = { ...this.selectedProject, status: 'onhold' };
    this.projectService
      .onHoldproject(this.selectedProject)
      .pipe(
        takeWhile(() => this.subscribeFlag),
        finalize(() => {
          this.globalService.hideLoader();
        })
      )
      .subscribe(() => {
        this.getProjects();
        this.confirmOnHoldModal.nativeElement.click();
        this.toastr.success('Project has been deleted succesfully', 'Success');
      });
  }

  generateProjectPdf(projectId) {
    this.projectService.generateProjectPdf(projectId).subscribe(() => {
      this.toastr.success('Project Details downloaded', 'Success');
    });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
