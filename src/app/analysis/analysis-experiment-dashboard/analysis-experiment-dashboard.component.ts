import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  QueryList
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { forkJoin, interval, Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { environment } from "src/environments/environment";
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { departmentMapping } from '@app/shared/constants/mappings';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { TestService } from '@app/shared/services/test/test.service';
import { CommonFunctionsService } from '@app/shared/services/common-functions/common-functions.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-analysis-experiment-dashboard',
  templateUrl: './analysis-experiment-dashboard.component.html',
  styleUrls: ['./analysis-experiment-dashboard.component.scss'],
})
export class AnalysisExperimentDashboardComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  @ViewChild('inputfields') inputfields!: ElementRef;
  dummyTabs: any = [
    { label: 'Purpose and Details', isEdit: false, value: 'primary' },
    { label: 'Analysis Details', isEdit: false, value: 'secondary' },
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
  columns: any;
  options: any = {};
  inwards: any = [];
  resultsData: any = [];
  tableData: any = [];
  experimentDetails: any;
  file: File;
  isCreatedExperiment = false;
  analysisExperimentDetails: any;
  dropdownList: any = [];
  selectedItems: any = [];
  savedSelectedItems: any = [];
  dropdownSettings: any = {};
  public files: any = [];
  analysisID: any;
  activeTab = 'summary';
  selectedTrfs = [];
  summaryForm = this.formBuilder.group({
    experimentName: ['', [Validators.required]],
    batchSize: ['' as any, [Validators.required]],
  });
  isSaveClicked: boolean = false;
  experimentId: string;
  showPassword: boolean = false;
  reviewData: any = {};
  userValidateForm = this.formBuilder.group({
    userName: [''],
    password: [''],
  });
  tempFiles: File[] = []; // temp list before upload
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

  public selectedFile: any;
  public startDate = new Date();
  errorMessage: string = "Please enter details.";
  public intervalSubscripton$: Subscription;

  testRequestForm = this.formBuilder.group({
    testRequestId: ['', [Validators.required]],
    department: ['', [Validators.required]],
    dosageForm: ['', [Validators.required]],
    projectName: ['', [Validators.required]],
    productCode: ['', [Validators.required]],
    market: ['', Validators.required],
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
    labTests: [[], Validators.required],
  });

  dtMyProjectsTrigger: Subject<any> = new Subject<any>();
  dtMyProjectsOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
  };
  tableTestData: any = [];
  dropdownTestSettings: any = {};
  tests: any = [];
  staticTrfId = 'TRF123';
  dtElements: QueryList<DataTableDirective>;
  selectedTestItems: any = [];
  reviewPwdErrorMessage: any;

  constructor(
    private readonly projectService: ProjectService,
    private readonly experimentService: ExperimentService,
    private readonly analysisService: AnalysisService,
    private readonly inwardService: InwardManagementService,
    private readonly formulationService: FormulationsService,
    private toastr: ToastrService,
    private renderer2: Renderer2,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: Router,
    private loginService: LoginserviceService,
    private readonly testService: TestService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getExcipients();

    const saveDataForEveryFiveMinutes = 1 * 60 * 1000;
    this.intervalSubscripton$ = interval(saveDataForEveryFiveMinutes).subscribe((v) => {
      if (this.analysisExperimentDetails) {
        this.autoSave();
      }
      this.getAnalysisReview();
    });


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
    this.savedSelectedItems = [];
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
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    this.analysisID = this.activatedRoute.snapshot.queryParams['analysisId'];
    this.isCreatedExperiment = this.analysisID ? true : false;
    this.getProjectDetails();
    this.getAnalysisExperimentDetails(this.analysisID);
    this.getAttachments();
    this.getTests();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.intervalSubscripton$.unsubscribe();
  }

  public editorConfig = {
    customConfig: '/assets/ckeditor/config.js',
  };

  getProjectDetails() {
    this.projectService.getProjectById(this.projectId).subscribe((project) => {
      this.project = project;
      this.testRequestForm.patchValue({
        dosageForm: this.project.dosageName,
        projectName: this.project.projectName,
        strength: this.project.strength,
        testRequestId: this.staticTrfId,
        department: "ANALYSIS",
        productCode: this.project.productCode,
        market: this.project.markertName
      });
    });
  }


  addTests(): FormGroup {
    return this.formBuilder.group({
      testId: [''],
      test: [''],
      results: [null],
      description: ['']
    });
  }

  onTestSelectAll(items: any) {
    this.tableTestData = this.tests.map((test, index) => ({
      ...test,
      testStatus: 'string',
      testNumber: `${this.staticTrfId}-A${index}`,
      testResult: '',
    }));
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'second-table') {
          dtInstance.destroy();
          this.dtMyProjectsTrigger.next(this.tableTestData);
        }
      });
    });
  }

  testdeselect(item: any) {
    this.tableTestData = this.tableTestData.filter(
      (data) => data.testId !== item.testId
    );
    this.tableTestData = this.tableTestData.map((test, index) => ({
      ...test,
      testStatus: 'string',
      testNumber: `${this.staticTrfId}-A${index}`,
      testResult: '',
    }));
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'second-table') {
          dtInstance.destroy();
          this.dtMyProjectsTrigger.next(this.tableTestData);
        }
      });
    });
  }

  onTestDeSelectAll(items: any) {
    this.tableTestData = [];
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'second-table') {
          dtInstance.destroy();
          this.dtMyProjectsTrigger.next(this.tableTestData);
        }
      });
    });
  }

  resultChange(event, index) {
    this.tableTestData[index].testResult = event.value;
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'second-table') {
          dtInstance.destroy();
          this.dtMyProjectsTrigger.next(this.tableTestData);
        }
      });
    });
  }

  getTests() {
    this.testService.getTests().subscribe((tests) => {
      this.tests = tests;
    });
  }

  saveTestRequestForm() {
    const manDate = this.testRequestForm.get('manufacturingDate')?.value || '';
    const expiryDate = this.testRequestForm.get('expiryDate')?.value || '';
    const hasEmptyResults = this.tableTestData.some(user => !user.testResult);

    if (hasEmptyResults) {
      this.isSaveClicked = true;
      this.toastr.error('Please enter details in results', 'Error');
      return;
    }

    let newTestRequest = {
      status: 'string',
      testRequestFormStatus: 'active',
      condition: this.testRequestForm.get('condition')?.value || '',
      stage: this.testRequestForm.get('stage')?.value || '',
      packaging: this.testRequestForm.get('packaging')?.value || '',
      labelClaim: this.testRequestForm.get('labelClaim')?.value || '',
      quantity: this.testRequestForm.get('quantity')?.value || 0,
      manufacturingDate: manDate,
      expireDate: expiryDate,
      trfTestResults: this.tableTestData,
      analysisId: this.analysisID,
      insertUser: this.loginService.userDetails.userId,
    };

    if (!this.testRequestForm.invalid) {
      this.analysisService.createTestForm(newTestRequest).subscribe(() => {
        this.toastr.success('Test has been added succesfully', 'Success');
        this.getTrfDetailsById();
      });
    } else {
      this.isSaveClicked = true;
      this.testRequestForm.get('testRequestId')?.markAsDirty();
      this.testRequestForm.get('department')?.markAsDirty();
      this.testRequestForm.get('dosageForm')?.markAsDirty();
      this.testRequestForm.get('expiryDate')?.markAsDirty();
      this.testRequestForm.get('manufacturingDate')?.markAsDirty();
      this.testRequestForm.get('labelClaim')?.markAsDirty();
      this.testRequestForm.get('quantity')?.markAsDirty();
      this.testRequestForm.get('batchSize')?.markAsDirty();
      this.testRequestForm.get('packaging')?.markAsDirty();
      this.testRequestForm.get('stage')?.markAsDirty();
      this.testRequestForm.get('batchNumber')?.markAsDirty();
      this.testRequestForm.get('projectName')?.markAsDirty();
      this.testRequestForm.get('strength')?.markAsDirty();
      this.testRequestForm.get('productCode')?.markAsDirty();
      this.testRequestForm.get('condition')?.markAsDirty();
      this.testRequestForm.get('market')?.markAsDirty();
    }
  }

  onTestItemSelect(item: any) {
    const tableTestData = this.tableTestData;
    const newItem = this.tests.filter((test) => test.testId === item.testId)[0];
    tableTestData.push(newItem);
    this.tableTestData = this.tableTestData.map((test, index) => ({
      ...test,
      testStatus: 'string',
      testNumber: `${this.staticTrfId}-A${index}`,
    }));
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'second-table') {
          dtInstance.destroy();
          this.dtMyProjectsTrigger.next(this.tableTestData);
        }
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
    if (activeTab.substring(0, 3) === 'tab') {
      this.getAnalysisDetailsById(activeTab);
    }
    if (activeTab === 'results') {
      this.getTrfDetailsById();
    }
    if (activeTab === 'review-comments') {
      this.getAnalysisReview();
    }
  }

  getTrfDetailsById() {
    this.analysisService
      .getTrfDetailsById(this.analysisID)
      .subscribe((data) => {
        if (data.length > 0) {
          this.resultsData = data;
          this.tableTestData = !data[0].trfTestResults ? [] : data[0].trfTestResults;//check
          this.selectedTestItems = !data[0].trfTestResults ? [] : data[0].trfTestResults;
        }
      });
  }

  getExcipientDetails() {
    this.analysisService
      .getExcipientDetailsById(this.analysisID)
      .subscribe((data) => {
        if (data.length > 0) {
          this.tableData = data.map(d => {
            let inward = this.inwards.find(i => i.excipientId == d.excipientId);
            return ({ ...d, experimentQuantity: d.quantity, excipientQuantity: inward.remainingQuantity, expiryDate: inward.expiryDate })
          });
          this.selectedItems = data.map(d => {
            let inward = this.inwards.find(i => i.excipientId == d.excipientId);
            return ({ ...d, experimentQuantity: d.quantity, excipientQuantity: inward.remainingQuantity })
          });
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next(this.tableData);
          });
        }
      });
  }

  getAnalysisDetailsById(tabValue) {
    this.analysisService
      .getAnalysisDeatilsById(tabValue.substring(3))
      .subscribe((details) => {
        const index = this.dummyTabs.findIndex((tab) => tab.value == tabValue);
        this.article[index].text = details.fileContent;
        this.dummyTabs[index].lastSavedContent = details.fileContent;
      });
  }

  getAttachments() {
    this.analysisService
      .getAttachmentsById(this.analysisID)
      .subscribe((attachments) => {
        this.files = attachments;
        if (this.analysisExperimentDetails && this.analysisExperimentDetails.status &&
          ((this.analysisExperimentDetails.status.toUpperCase() === 'Review Completed'.toUpperCase()) ||
            (this.analysisExperimentDetails.status.toUpperCase() === 'Inprogress'.toUpperCase())
            || (this.analysisExperimentDetails.status.toUpperCase() === 'Need Correction'.toUpperCase()))) {
          let userName = this.loginService.userDetails ? this.loginService.userDetails['mailId'] : '';
          this.userValidateForm = this.formBuilder.group({
            userName: [userName, [Validators.required]],
            password: ['', [Validators.required]],
          });
        }

      });
  }

  removeAttachment(file) {
    const fileData = { ...file, analysisAttachmentId: file.attachmentId, projectId: this.projectId };
    this.analysisService
      .deleteAnalysisAttachment(fileData)
      .subscribe((experimentDetails) => {
        if (experimentDetails['data'] === "Analysis Attachment Delete Successfully") {
          this.files = this.files.filter(f => f.name !== file.name);
          this.tempFiles = this.tempFiles.filter(f => f.name !== file.name);
          this.toastr.success(`"${file.name}" removed successfully`, 'Deleted');
        }
      });
  }

  getExcipients() {
    this.inwardService.getInwardsByCreationSource(departmentMapping[2]).subscribe((inwards) => {
      this.inwards = inwards.map((inward) => ({
        ...inward,
        analysisId: Number(this.analysisID),
      }));
    });
  }

  getAnalysisExperimentDetails(id) {
    this.analysisID = id;
    if (this.analysisID) {
      this.analysisService
        .getAnalysisById(this.analysisID)
        .subscribe((analysisExperimentDetails) => {
          this.analysisExperimentDetails = analysisExperimentDetails;
          this.article = analysisExperimentDetails.analysisDetails.map(
            (exp) => ({
              title: '',
              text: '',
            })
          );
          this.dummyTabs = analysisExperimentDetails.analysisDetails.map(
            (exp) => ({
              label: exp.name,
              isEdit: false,
              value: 'tab' + exp.analysisDetailId,
            })
          );
          this.selectedItems = analysisExperimentDetails.analysisExcipients;
          this.savedSelectedItems =
            analysisExperimentDetails.analysisExcipients;
          this.tableData = analysisExperimentDetails.analysisExcipients;
          this.dtElement && this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next(this.tableData);
          });
          this.batchNumber = analysisExperimentDetails.batchNumber;
          this.testRequestForm.patchValue({
            batchNumber: analysisExperimentDetails.batchNumber,
            batchSize: analysisExperimentDetails.batchSize
          });
          this.summaryForm.patchValue({
            experimentName: analysisExperimentDetails.analysisName,
            batchSize: analysisExperimentDetails.batchSize,
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
    this.renderer2.addClass(document.getElementById(`${this.dummyTabs[index].value}-tab`), 'active');
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
      showDeleteIcon: true,
      lastSavedContent: ''
    });
  }

  saveSummary() {
    const summary = {
      analysisId: this.analysisExperimentDetails.analysisId,
      analysisName: this.summaryForm.get('experimentName')?.value,
      status: this.analysisExperimentDetails.status,
      projectId: this.project.projectId,
      teamId: this.project.teamId,
      userId: this.analysisExperimentDetails.userId,
      experimentName: this.summaryForm.get('experimentName')?.value,
      summary: this.analysisExperimentDetails.summary,
      batchSize: this.summaryForm.get('batchSize')?.value,
      batchNumber: this.analysisExperimentDetails.batchNumber,
      analysisDetailsList: this.analysisExperimentDetails.analysisDetails,
    };
    this.analysisService
      .updateAnalysis(summary)
      .subscribe((experiment: any) => {
        this.getAnalysisExperimentDetails(this.analysisExperimentDetails.analysisId);
        this.toastr.success(experiment.data, 'Success');
        this.activeTab = this.dummyTabs[0].value;
      });
  }

  onItemSelect(item: any) {
    if (!this.tableData) {
      this.tableData = [];
    }
    this.tableData.push(...this.inwards.filter(i => i.excipientId === item.excipientId)
      .map((data) => ({
        ...data, analysisId: Number(this.analysisID),
        experimentQuantity: 0, excipientQuantity: data.remainingQuantity
      })));
    this.tableData.forEach(e => {
      if (e.excipientId === item.excipientId) {
        e.quantity = 0;
        e.errorMessage = "Please enter quantity.";
      }
    });
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.tableData);
    });
  }
  deselect(item: any) {
    this.tableData = this.tableData.filter(
      (data) => data.excipientId !== item.excipientId
    );
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.tableData);
    });
  }
  onSelectAll(items: any) {
    this.tableData = this.inwards;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.tableData);
    });
    const existingData = this.tableData || [];

    this.tableData = this.inwards.map((inward) => {
      const existing = existingData.find(t => t.excipientId === inward.excipientId);
      return {
        ...inward,
        analysisId: Number(this.experimentId),
        experimentQuantity: existing?.experimentQuantity ?? 0,
        excipientQuantity: inward.remainingQuantity,
        quantity: existing?.quantity ?? 0,
        errorMessage: existing?.errorMessage ?? "Please enter quantity."
      };
    });
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'first-table') {
          dtInstance.destroy();
          this.dtTrigger.next(this.tableData);
        }
      });
    });
  }

  onDeSelectAll() {
    this.tableData = [];
    if (this.dtElement) {
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.clear();
        dtInstance.draw();
      });
    }
  }


  isValid(index: number): boolean {
    return !this.article[index].text || this.article[index].text.trim().length === 0;
  }

  saveTab(index, label) {
    if (this.isValid(index)) {
      this.toastr.error('Please enter some content before attempting to save.', 'Error');
      return;
    }
    const currentContent = this.article[index]?.text ?? '';
    const lastSaved = this.dummyTabs[index]?.lastSavedContent ?? '';
    if (currentContent === lastSaved) {
      this.toastr.warning("No changes detected. Update not required.", "Warning");
      return;
    }
    const isNewTab = this.dummyTabs[index].value.startsWith('new');
    let analysisDetailId: number | null = null;
    if (!isNewTab) {
      analysisDetailId = Number(this.dummyTabs[index].value.substring(3));
    }
    let tabValue: any = {
      status: 'ACTIVE',
      analysisId: Number(this.analysisID),
      analysisDetailId: isNewTab ? null : analysisDetailId,
      name: label,
      fileContent: this.article[index].text,
    };
    this.analysisService.saveAnalysisDetails(tabValue).subscribe((data) => {
      this.toastr.success(`Experiment details updated successfully`, 'Success');
      if (isNewTab && data?.analysisDetailId) {
        this.dummyTabs[index].value = `tab${data.analysisDetailId}`;
        this.activeTab = `tab${data.analysisDetailId}`;
      }
      this.dummyTabs[index].showDeleteIcon = false;
      this.dummyTabs[index].lastSavedContent = currentContent;
    });
  }

  private autoSave() {
    let saveCalls: any = [];
    for (let index = 0; index < this.dummyTabs.length; index++) {
      if (this.article[index].text && this.article[index].text.trim().length) {
        const tabValue: any = {
          status: 'ACTIVE',
          analysisId: Number(this.analysisID),
          analysisDetailId:
            this.analysisExperimentDetails.analysisDetails[index].analysisDetailId,
          name: this.dummyTabs[index].label,
          fileContent: this.article[index].text,
          autoSave: 'Y'
        };
        saveCalls.push(this.analysisService.saveAnalysisDetails(tabValue));
      }
    }

    if (saveCalls.length) {
      forkJoin(saveCalls).subscribe(response => {
        this.toastr.success('Auto Saved Successfully', 'Success');
      })
    }

  }


  deleteNewTab(index: number, tab: any) {
    if (index >= 2) {
      this.dummyTabs.splice(index, 1);
    }
  }


  saveAttachment() { }

  attachFile(event: any) {
    const selectedFiles: FileList = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0)
      return;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      const alreadyUploaded = this.files?.some(f => f.name === file.name);

      if (alreadyUploaded) {
        this.toastr.warning(`"${file.name}" is already uploaded`, 'Duplicate File');
      } else {

        this.analysisService
          .saveAnalysisAttachment(file, this.analysisExperimentDetails.analysisId, this.projectId, "Y")
          .subscribe({
            next: (response: any) => {
              this.files = response;
              this.toastr.success(`"${file.name}" uploaded successfully`, 'Success');
              this.getAnalysisExperimentDetails(this.analysisExperimentDetails.analysisId);
            },
            error: () => {
              this.toastr.error(`"${file.name}" failed to upload`, 'Upload Failed');
            }
          });
      }
    }
    event.target.value = '';
  }

  onChange(event) {
    this.file = event.target.files[0];
  }

  removeTempFile(file: File) {
    this.tempFiles = this.tempFiles.filter(f => f.name !== file.name);
  }


  processFile(event) {
    const attachedFile = event.target.files[0];
    if (!attachedFile) return;
    const uploadedInSummary = this.files.some(
      f => f.name === attachedFile.name && f.fromSummary === 'Y'
    );
    if (uploadedInSummary) {
      this.toastr.warning(`File "${attachedFile.name}" was already uploaded in Summary page`, 'Duplicate File');
      event.target.value = '';
      return;
    }
    const alreadyUploaded = this.files.some(
      f => f.name === attachedFile.name
    );
    if (alreadyUploaded) {
      this.toastr.warning(`File "${attachedFile.name}" already uploaded`, 'Duplicate File');
      event.target.value = '';
      return;
    }
    this.analysisService
      .saveAnalysisAttachment(
        attachedFile,
        this.analysisID.toString(),
        this.analysisExperimentDetails.projectId.toString(),
        "N"
      )
      .subscribe((response) => {
        this.files = response;
        this.toastr.success('File Uploaded Successfully', 'Success');
      });
    event.target.value = '';
  }

  getFileContent(fileName: string, experimentId: number) {
    const url = `${environment.API_BASE_PATH}/experiment/get-experiment-attachment-content/${fileName}/${experimentId}/${this.projectId}`;
    this.http.get(url, {
      responseType: 'blob'
    }).subscribe(blob => {
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    }, error => {
      console.error('Download failed', error);
      this.toastr.error('Failed to download file');
    });
  }

  trfResultChange(result, index) {
    this.resultsData[index].testResult = result.value;
  }

  private isEmptyOrUndefined = (value): boolean => {
    return value === "" || value === undefined;
  }

  saveExcipients() {
    if (this.selectedItems.length === 0) {
      this.toastr.error('Please select at least one excipient', 'Error');
      return;
    }
    this.isSaveClicked = true;

    if (this.tableData.find(excipient => !this.isEmptyOrUndefined(excipient.errorMessage))) {
      return;
    }

    const isUpdate = this.tableData.some((data) => data.analysisId);
    if (!isUpdate) {
      this.tableData.forEach(data => {
        data['experimentId'] = this.analysisID;
        data['experimentQuantity'] = 0;
      })
    }

    this.tableData.forEach(e => {
      if (e.experimentQuantity >= 0) {
        e['changedQuantity'] = e.quantity - e.experimentQuantity;
      }
    });

    this.analysisService
      .saveAnalysisExcipient(this.tableData)
      .subscribe((data) => {
        this.toastr.success('Excipients Updated successfully', 'Success');
        this.getExcipientDetails();
      });
  }
  saveResults() {
    this.isSaveClicked = true;
    const hasEmptyResults = this.resultsData.some(result => !result.testResult);
    if (hasEmptyResults) {
      this.toastr.error('Please enter a value for all results.', 'Error');
      return;
    }
    this.analysisService.saveTrfResults(this.resultsData).subscribe((data) => {
      this.toastr.success(data.data, 'Success');
    });
  }

  updateAnalysisStatus(status: string, summary?: string) {
    let analysisRequest = {
      analysisId: this.analysisID,
      status: status,
      summary: summary ? summary : status,
      userId: this.loginService.userDetails.userId,
    }
    if (this.analysisExperimentDetails && this.analysisExperimentDetails.status &&
      (this.analysisExperimentDetails.status.toUpperCase() === 'Review Completed'.toUpperCase()) ||
      (this.analysisExperimentDetails.status.toUpperCase() === 'Inprogress'.toUpperCase())
      || (this.analysisExperimentDetails.status.toUpperCase() === 'Need Correction'.toUpperCase())) {
      if (!this.userValidateForm.invalid) {

        const request = {
          mailId: this.userValidateForm.value.userName || '',
          password: this.userValidateForm.value.password || ''
        };
        this.loginService.login(request).subscribe({
          next: (response) => {
            if (response) {
              this.analysisService.updateAnalysisStatus(analysisRequest).subscribe((data) => {
                this.toastr.success('Analysis Details Submitted successfully', 'Success');
                this.route.navigateByUrl(
                  `/exp-analysis/analysis-experiments`
                );
              });
            }
          }, error: (err) => {
            let errorMessage =
              typeof err.error === 'string'
                ? err.error
                : err?.error?.message || err?.message || 'Something went wrong. Please try again.';
            if (err.status === 403) {
              errorMessage = 'Your account has been locked due to multiple failed login attempts.';
              this.toastr.error(errorMessage, 'Account Locked');
              this.route.navigateByUrl('');
            }
            this.reviewPwdErrorMessage = errorMessage;
          },
        });
      } else {
        this.userValidateForm.get('userName')?.markAsDirty();
        this.userValidateForm.get('password')?.markAsDirty();
      }
    } else {
      this.analysisService.updateAnalysisStatus(analysisRequest).subscribe((data) => {
        this.toastr.success(data['data'], 'Success');
        this.route.navigateByUrl(
          `/exp-analysis/analysis-experiments`
        );
      });
    }

  }

  excipientQuantityChange(result, index) {
    this.tableData[index]['errorMessage'] = "";

    if ((+result.value - this.tableData[index].experimentQuantity) > this.tableData[index].excipientQuantity) {
      this.tableData[index]['errorMessage'] = "Please enter <= remaining qty " + (this.tableData[index].excipientQuantity ? this.tableData[index].excipientQuantity : this.tableData[index].experimentQuantity);
      return;
    } else if (+result.value <= 0) {
      this.tableData[index]['errorMessage'] = "Please enter quantity.";
      return;
    }

    this.tableData[index].quantity = +result.value;
  }

  getAnalysisReview() {
    this.analysisService
      .getAnalysisReview(this.analysisID)
      .subscribe((details) => {
        this.reviewData = details;
      });
  }

}
