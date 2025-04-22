import {
  Component,
  ElementRef,
  OnInit,
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
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.css']
})
export class VersionHistoryComponent implements OnInit {

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
    ) {}
  
    ngOnInit(): void {
      this.userDetails = this.loginService.userDetails
      this.getProjects();
    }
  
    ngAfterViewInit(): void {
      this.dtTrigger.next(null);
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

    viewExperiment(event) {
      this.route.navigateByUrl(
        `/business-admin/version-history/project-experiments?projectId=${event.projectId}`
      );
    }

    // editProject(project) {
    //   this.route.navigateByUrl(
    //     `/business-admin/project-management/add-project?projectId=${project.projectId}`
    //   );
    // }

  
    ngOnDestroy(): void {
      this.subscribeFlag = false;
    }
}
