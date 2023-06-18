import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Subject, takeWhile } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-view-formulation-experiment',
  templateUrl: './view-formulation-experiment.component.html',
  styleUrls: ['./view-formulation-experiment.component.css']
})
export class ViewFormulationExperimentComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  private subscribeFlag: boolean = true;
  @ViewChild('inputfields') inputfields!: ElementRef;
  dummyTabs: any = [
    { label: 'Purpose and Conclusions', isEdit: false, value: 'primary' },
    { label: 'Formulation', isEdit: false, value: 'secondary' },
  ];
  inputValue: string;
  projectId: number;
  project: any;
  batchNumber: any;
  article = [
    {
      title: '',
      text: '',
    },
    {
      title: '',
      text: '',
    },
  ];

  testRequest = {
    testRequestId: '',
    department: '',
    dosageForm: '',
    projectName: '',
    productCode: '',
    strength: '',
    batchNumber: '',
    condition: '',
    stage: '',
    packaging: '',
    batchSize: '',
    quantity: '',
    labelClaim: '',
    manufacturingDate: '',
    expiryDate: ''
  };

  columns: any;
  options: any = {};
  inwards: any = [];
  tableData: any = [];
  editExperiment = false;
  experimentId: string;
  experimentDetails: any;
  file: File;
  isCreatedExperiment = false;
  activeTabIndex: number;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  public files: any = [];
  tests: any = [];

  activeTab = 'summary';

  summaryForm = this.formBuilder.group({
    experimentName: ['', [Validators.required]],
    batchSize: ['' as any, [Validators.required]],
  });

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

  dtResultTrigger: Subject<any> = new Subject<any>();
  dtResultOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
  };

  constructor(
    private readonly projectService: ProjectService,
    private readonly experimentService: ExperimentService,
    private readonly inwardService: InwardManagementService,
    private readonly formulationService: FormulationsService,
    private toastr: ToastrService,
    private renderer2: Renderer2,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: Router,
    private loginService: LoginserviceService,
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.getExcipients();
    this.columns = [
      { key: 'excipientsName', title: 'Inward Name' },
      { key: 'materialName', title: 'Material Name' },
      { key: 'materialType', title: 'Material Type' },
      { key: 'batchNo', title: 'Batch Number' },
      { key: 'sourceName', title: 'Source Name' },
      { key: 'potency', title: 'Potency' },
      { key: 'grade', title: 'Grade' },
    ];

    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'excipientId',
      textField: 'excipientsName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.experimentId =
      this.activatedRoute.snapshot.queryParams['experimentId'];
    this.editExperiment =
      (this.activatedRoute.snapshot.queryParams['edit'] && this.activatedRoute.snapshot.queryParams['edit'] === "true" ? true : false) || false;
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    this.isCreatedExperiment = this.experimentId ? true : false;
    this.getExperimentDetails(this.experimentId);
    this.getProjectDetails();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtResultTrigger.next(null);
  }

  getProjectDetails() {
    this.projectService.getProjectById(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  search(activeTab, index: number) {
    this.activeTab = activeTab;
    this.activeTabIndex = index;

    if (activeTab === 'attachments') {
      this.getAttachments();
    }
    if (activeTab === 'excipients') {
      this.getExcipientDetails();
    }
    if (activeTab.substring(0, 3) === 'tab') {
      this.getExperimentDetailsById(activeTab);
    }

    if (activeTab === 'results') {
      this.getTestResults();
    }
  }

  getExcipientDetails() {
    this.experimentService
      .getExcipientDetailsById(this.experimentId)
      .subscribe((data) => {
        console.log(data);
        if (data.length > 0) {
          this.tableData = data;
          this.selectedItems = data;

          this.dtElements.forEach(
            (dtElement: DataTableDirective, index: number) => {
              dtElement.dtInstance.then((dtInstance: any) => {
                if (dtInstance.table().node().id === 'first-table') {
                  dtInstance.destroy();
                  this.dtTrigger.next(this.tableData);
                }
              });
            }
          );

          // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   // Destroy the table first
          //   dtInstance.destroy();
          //   // Call the dtTrigger to rerender again
          //   this.dtTrigger.next(this.tableData);
          // });
        }
      });
  }

  getExperimentDetailsById(tabValue) {
    this.experimentService
      .getExperimentDetailsById(tabValue.substring(3))
      .subscribe((details) => {
        const index = this.dummyTabs.findIndex((tab) => tab.value == tabValue);
        console.log(index);
        this.article[index].text = details.fileContent;
        console.log(details);
      });
  }

  getAttachments() {
    this.experimentService
      .getAttachmentsById(this.experimentId)
      .subscribe((attachments) => {
        this.files = attachments;
      });
  }

  getExcipients() {
    this.inwardService.getInwards().subscribe((inwards) => {
      this.inwards = inwards;
    });
  }

  getExperimentDetails(id, firstLoad?: any) {
    this.experimentId = id;
    this.isCreatedExperiment = this.experimentId ? true : false;
    if (this.experimentId) {
      if (!this.editExperiment) {
        this.route.navigateByUrl(
          `/view-formulation-experiment?projectId=${this.projectId}&experimentId=${this.experimentId}`
        );
      }
      this.experimentService
        .getIndvExperimentById(this.experimentId)
        .subscribe((experimentDetails) => {
          this.experimentDetails = experimentDetails;
          // if (this.editExperiment) {

          this.article = experimentDetails.experimentDetails.map((exp) => ({
            title: '',
            text: '',
          }));
          this.dummyTabs = experimentDetails.experimentDetails.map((exp) => ({
            label: exp.name,
            isEdit: false,
            value: 'tab' + exp.experimentDetailId,
          }));
          if (firstLoad === 'firstLoad') {
            this.activeTab = this.dummyTabs[0].value;
          }

          this.tableData = experimentDetails.experimentExcipients;

          // }
          this.summaryForm.patchValue({
            experimentName: experimentDetails?.experimentName,
            batchSize: experimentDetails?.batchSize,
          });
        });
    }
  }

  onChange(event) {
    this.file = event.target.files[0];
  }

  getFileContent(fileName: string, experimentId: number) {
    window.location.assign(
      `${environment.API_BASE_PATH}` + `/experiment/get-experiment-attachment-content/${fileName}/${experimentId}/${this.projectId}`
    );
  }

  getTestResults() {
    this.globalService.showLoader();
    this.formulationService
      .getTrfResultsByExperimentId(this.experimentId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((tests) => {
        this.tests = tests;

        // this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
        //   dtElement.dtInstance.then((dtInstance: any) => {
        //     if (dtInstance.table().node().id === 'second-table') {
        //       dtInstance.destroy();
        //       this.dtResultTrigger.next(this.tests);
        //     }
        //   });
        // });

        this.globalService.hideLoader();
      });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }

  checkStatus(status: string) {
    let formulationStatuses = ["Analysis Submitted", "Inreview", "Review Completed", "COA Generated", "Archive"];

    let obj = formulationStatuses.find(f => f.toLocaleUpperCase() === status);

    return formulationStatuses.find(f => f.toLocaleUpperCase() === status) ? true : false;
  }

}
