import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';

import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { TestService } from '@app/shared/services/test/test.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-review-experiments',
  templateUrl: './review-experiments.component.html',
  styleUrls: ['./review-experiments.component.scss'],
})
export class ReviewExperimentsComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  @ViewChild('inputfields') inputfields!: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  dummyTabs: any = [
    { label: 'Purpose and Details', isEdit: false, value: 'primary' },
    { label: 'Analysis Details', isEdit: false, value: 'secondary' },
  ];
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  dtMyProjectsTrigger: Subject<any> = new Subject<any>();
  dtMyProjectsOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
  };

  testRequestForm = this.formBuilder.group({
    testRequestId: ['', [Validators.required]],
    department: ['', [Validators.required]],
    dosageForm: ['', [Validators.required]],
    projectName: ['', [Validators.required]],
    projectCode: ['', [Validators.required]],
    strength: ['', [Validators.required]],
    batchNumber: [''],
    condition: ['', [Validators.required]],
    stage: ['', [Validators.required]],
    packaging: ['', [Validators.required]],
    batchSize: [''],
    quantity: ['', [Validators.required]],
    labelClaim: ['', [Validators.required]],
    manufacturingDate: ['', [Validators.required]],
    expiryDate: ['', [Validators.required]],
    testRequestRow: this.formBuilder.array([this.addTests()]),
  });

  inputValue: string;
  projectId: number;
  project: any;
  batchNumber: any;
  result: any = '';
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
  columns: any;
  testColumns: any;
  options: any = {};
  inwards: any = [];
  tableData: any = [];
  tableTestData: any = [];
  experimentId: string;
  experimentDetails: any;
  file: File;
  isCreatedExperiment = false;
  selectedTrfs$ = this.analysisService.selectedTrfs$;
  selectedTrfs: any = [];
  resultData: any = {};
  reviewData: any = {};
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  dropdownTestSettings: any = {};
  public files: any = [];
  tests: any = [];
  activeTab = 'summary';
  staticTrfId = 'TRF123';
  selectedTestItems: any = [];
  summaryForm = this.formBuilder.group({
    experimentName: ['', [Validators.required]],
    batchSize: ['' as any, [Validators.required]],
  });
  summary: string;
  public reviewStatus: string;
  userValidateForm = this.formBuilder.group({
    userName: [''],
    password: [''],
  });

  constructor(
    private readonly projectService: ProjectService,
    private readonly experimentService: ExperimentService,
    private readonly analysisService: AnalysisService,
    private readonly inwardService: InwardManagementService,
    private readonly testService: TestService,
    private readonly formulationService: FormulationsService,
    private toastr: ToastrService,
    private renderer2: Renderer2,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: Router,
    private loginService: LoginserviceService
  ) { }

  ngOnInit(): void {
    this.selectedTrfs$.subscribe((trfs) => {
      this.selectedTrfs = trfs;
      console.log(trfs);
    });
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
    this.dropdownTestSettings = {
      singleSelection: false,
      idField: 'testId',
      textField: 'testName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.testColumns = [
      { key: 'testNumber', title: 'Test Id' },
      { key: 'testName', title: 'Test Name' },
      {
        key: 'results',
        title: '<div class="blue">Result</div>',
        align: { head: 'center', body: 'center' },
        sorting: false,
        width: 150,
        cellTemplate: this.actionTpl,
      },
    ];
    this.experimentId = this.activatedRoute.snapshot.queryParams['analysisId'];
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    this.isCreatedExperiment = this.experimentId ? true : false;
    this.getBatchNumber();
    this.getAnalysisById(this.experimentId);
    this.getProjectDetails();
    this.getTests();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtMyProjectsTrigger.next(null);
  }

  getProjectDetails() {
    this.projectService.getProjectById(this.projectId).subscribe((project) => {
      console.log(project);
      this.project = project;
      this.testRequestForm.patchValue({
        batchNumber: this.project.batchNumber,
        dosageForm: this.project.dosageName,
        projectName: this.project.projectName,
        strength: this.project.strength,
        batchSize: this.project.batchSize,
        testRequestId: this.staticTrfId,
        department: 'string',
        projectCode: 'string',
      });
    });
  }

  search(activeTab) {
    this.activeTab = activeTab;
    if (activeTab === 'attachments') {
      this.getAttachments();
    }
    if (activeTab === 'excipients') {
      this.getExcipientDetails();
    }
    if (activeTab === 'results') {
      this.getResultsDetailsById();
    }
    if (activeTab === 'review') {
      this.getAnalysisReview();
    }
    console.log(activeTab.substring(3));
    if (activeTab.substring(0, 3) === 'tab') {
      this.getAnalysisDetailsById(activeTab);
    }
  }

  addTests(): FormGroup {
    return this.formBuilder.group({
      testId: [''],
      test: [''],
      results: [null],
    });
  }

  getResultsDetailsById() {
    this.analysisService
      .getTestFormResults(this.experimentId)
      .subscribe((data) => {
        console.log(data);
        this.resultData = data;
        console.log(data);
        console.log(this.experimentDetails);

        this.testRequestForm.patchValue({
          condition: this.resultData.condition,
          stage: this.resultData.stage,
          packaging: this.resultData.packaging,
          quantity: this.resultData.quantity,
          labelClaim: this.resultData.labelClaim,
          manufacturingDate: this.resultData.manufacturingDate,
          expiryDate: this.resultData.expireDate,
          batchNumber: this.experimentDetails.batchNumber,
          batchSize: this.experimentDetails.batchSize,
        });
        if (this.resultData.analysisId) {
          this.tableTestData = this.resultData.trfTestResults;
          this.selectedTestItems = this.resultData.trfTestResults;

          this.dtElements.forEach(
            (dtElement: DataTableDirective, index: number) => {
              dtElement.dtInstance.then((dtInstance: any) => {
                if (dtInstance.table().node().id === 'second-table') {
                  dtInstance.destroy();
                  this.dtMyProjectsTrigger.next(this.tableTestData);
                }
              });
            }
          );

          // this.tableTestData = this.resultData.trfTestResults.map((result) => ({
          //   ...result,
          //   testResult: result.testResult,
          // }));
        }
      });
  }

  getExcipientDetails() {
    this.analysisService
      .getExcipientDetailsById(this.experimentId)
      .subscribe((data) => {
        this.tableData = data;
        // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //   // Destroy the table first
        //   dtInstance.destroy();
        //   // Call the dtTrigger to rerender again
        //   this.dtTrigger.next(this.tableData);
        // });
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
      });
  }

  getAnalysisDetailsById(tabValue) {
    this.analysisService
      .getAnalysisDeatilsById(tabValue.substring(3))
      .subscribe((details) => {
        const index = this.dummyTabs.findIndex((tab) => tab.value == tabValue);
        console.log(index);
        this.article[index].text = details.fileContent;
        console.log(details);
      });
  }

  getAnalysisReview() {
    this.analysisService
      .getAnalysisReview(this.experimentId)
      .subscribe((details) => {
        this.reviewData = details;

        let userName = this.loginService.userDetails ? this.loginService.userDetails['mailId'] : '';
        this.userValidateForm = this.formBuilder.group({
          userName: [userName, [Validators.required]],
          password: ['', [Validators.required]],
        });

      });
  }

  resultChange(event, index) {
    this.tableTestData[index].testResult = event.value;
  }

  getTests() {
    this.testService.getTests().subscribe((tests) => {
      this.tests = tests;
    });
  }

  onTestItemSelect(item: any) {
    console.log(item);
    const tableTestData = this.tableTestData;
    const newItem = this.tests.filter((test) => test.testId === item.testId)[0];
    tableTestData.push(newItem);
    this.tableTestData = this.tableTestData.map((test, index) => ({
      ...test,
      testStatus: 'string',
      testNumber: `${this.staticTrfId}-A${index}`,
    }));
  }
  testdeselect(item: any) {
    console.log(item);
    this.tableTestData = this.tableTestData.filter(
      (data) => data.testId !== item.testId
    );
    this.tableTestData = this.tableTestData.map((test, index) => ({
      ...test,
      testStatus: 'string',
      testNumber: `${this.staticTrfId}-A${index}`,
      testResult: '',
    }));
  }
  onTestSelectAll(items: any) {
    console.log(items);
    this.tableTestData = this.tests.map((test, index) => ({
      ...test,
      testStatus: 'string',
      testNumber: `${this.staticTrfId}-A${index}`,
      testResult: '',
    }));
  }

  resultValue(event, index) {
    this.tableTestData[index]['result'] = event.target.value;
  }

  updateAnalysisStatus(status: string) {
    // let analysisRequest = {
    //   analysisId: this.experimentId,
    //   status: status,
    //   summary: this.summary ? this.summary : status
    // }

    if (!this.summary || !this.summary.trim().length) {
      this.summary = '';
      this.toastr.error('Please enter comments.', 'Error');
      return;
    }

    if (!this.userValidateForm.invalid) {

      const reviewRequest = {
        analysisReviewId: this.reviewData['analysisReviewId'],
        reviewUserId: this.reviewData['reviewUserId'],
        analysisId: this.reviewData['analysisId'],
        comments: this.summary,
        status: this.reviewStatus
      };

      const request = {
        mailId: this.userValidateForm.value.userName || '',
        password: this.userValidateForm.value.password || ''
      };

      this.loginService.login(request).subscribe(response => {
        if (response) {
          this.analysisService.updateAnalysisReview(reviewRequest).subscribe((data) => {
            this.toastr.success(data['data'], 'Success');
            this.route.navigateByUrl(`/exp-analysis/review-list`);
          });
        }
      });
    } else {
      this.userValidateForm.get('userName')?.markAsDirty();
      this.userValidateForm.get('password')?.markAsDirty();
    }



  }

  getAttachments() {
    this.analysisService
      .getAttachmentsById(this.experimentId)
      .subscribe((attachments) => {
        this.files = attachments;
      });
  }

  removeAttachment(file) {
    const fileData = { ...file, experimentAttachmentId: file.attachmentId, projectId: this.projectId };
    this.experimentService
      .deleteExperimentAttachment(fileData)
      .subscribe((experimentDetails) => { });
  }

  getExcipients() {
    this.inwardService.getInwards().subscribe((inwards) => {
      this.inwards = inwards;
    });
  }

  getBatchNumber() {
    this.formulationService
      .getFormulationBatchNumber()
      .subscribe((batchNumber) => {
        this.batchNumber = batchNumber.data;
      });
  }

  getAnalysisById(id, is?: any) {
    this.experimentId = id;
    this.isCreatedExperiment = this.experimentId ? true : false;
    console.log(this.experimentId);
    if (this.experimentId) {
      this.analysisService
        .getAnalysisById(this.experimentId)
        .subscribe((experimentDetails) => {
          this.experimentDetails = experimentDetails;
          this.article = experimentDetails.analysisDetails.map((exp) => ({
            title: '',
            text: '',
          }));
          this.dummyTabs = experimentDetails.analysisDetails.map((exp) => ({
            label: exp.name,
            isEdit: false,
            value: 'tab' + exp.analysisDetailId,
          }));
          // Commented becaise of no resonse
          this.summaryForm.patchValue({
            experimentName: experimentDetails.analysisName,
            batchSize: experimentDetails.batchSize,
          });
        });
    }
  }

  editMode(index) {
    this.inputValue = '';
    const d = this.dummyTabs.map((tab, i) => {
      if (i === index) {
        return { ...tab, isEdit: true };
      } else {
        return { ...tab, isEdit: false };
      }
    });
    this.dummyTabs = d;
  }

  resetEditMode(index, value) {
    const d = this.dummyTabs.map((tab, i) => {
      return {
        ...tab,
        label: i === index ? this.inputValue || value : tab.label,
        isEdit: false,
      };
    });
    this.dummyTabs = d;
    let elemetClass = document.getElementById('summary-tab');
    this.renderer2.addClass(document.getElementById('summary-tab'), 'active');
    this.renderer2.addClass(document.getElementById('summary'), 'active');
    this.renderer2.addClass(document.getElementById('summary'), 'show');
  }

  addNew() {
    const length = this.dummyTabs.length;
    this.article.push({
      title: '',
      text: '',
    });
    this.dummyTabs.push({
      label: `Add On - ${length + 1}`,
      isEdit: false,
      value: `newTab-${(length + 1).toString()}`,
    });
  }

  saveSummary() {
    // if () {
    const summary = {
      status: 'string',
      projectId: this.project.projectId,
      teamId: this.project.teamId,
      userId: this.loginService.userDetails.userId,
      analysisName: this.summaryForm.get('experimentName')?.value,
      experimentStatus: 'New',
      summary: 'Active',
      batchSize: this.summaryForm.get('batchSize')?.value,
      batchNumber: this.batchNumber,
      experimentDetailsList: [],
      excipients: [],
      testRequestFormList: [],
    };

    this.analysisService.saveAnalysis(summary).subscribe((experiment: any) => {
      // change here
      this.getAnalysisById(experiment.data, 'firstLoad');
      // this.activeTab = this.dummyTabs[0].value;
      this.toastr.success('Experiment Started Successfully', 'Success');
    });
  }

  saveTab(index, data) {
    const sss = JSON.stringify(this.article[index].text);
    let tabValue: any = {
      status: 'string',
      analysisId: this.experimentId,
      name: data.label,
      fileContent: this.article[index].text,
    };

    tabValue = {
      ...tabValue,
      analysisDetailId:
        this.dummyTabs[index].value.substring(0, 3) === 'new'
          ? null
          : this.dummyTabs[index].value.substring(3),
    };
    this.analysisService.saveAnalysisDetails(tabValue).subscribe((data) => {
      this.toastr.success(
        `Experiment detail ${this.dummyTabs[index].id ? 'updated' : 'created'
        } successfully`,
        'Success'
      );
      if (this.dummyTabs[index].value.substring(0, 3) === 'new') {
        this.activeTab = 'summary';
        console.log(this.experimentId);
        this.getAnalysisById(this.experimentId);
      }
    });
  }

  saveAttachment() { }

  onChange(event) {
    this.file = event.target.files[0];
  }

  processFile(event) {
    const selectedFile = event.target.files[0];
    this.analysisService
      .saveAnalysisAttachment(selectedFile, this.experimentId, this.projectId, null)
      .subscribe((response) => {
        this.files = response;
        this.toastr.success('File Uploaded Successfully', 'Success');
      });
  }

  getFileContent(fileName: string, experimentId: number) {
    window.location.assign(
      `${environment.API_BASE_PATH}` + `/experiment/get-experiment-attachment-content/${fileName}/${experimentId}/${this.projectId}`
    );
  }
}
