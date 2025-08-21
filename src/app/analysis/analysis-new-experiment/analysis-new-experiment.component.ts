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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, interval, Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '@app/shared/services/global/global.service';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { TestService } from '@app/shared/services/test/test.service';
import { environment } from "src/environments/environment";
import { departmentMapping } from '@app/shared/constants/mappings';
import { CommonFunctionsService } from '@app/shared/services/common-functions/common-functions.service';

@Component({
  selector: 'app-analysis-new-experiment',
  templateUrl: './analysis-new-experiment.component.html',
  styleUrls: ['./analysis-new-experiment.component.scss'],
})
export class AnalysisNewExperimentComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  @ViewChild('inputfields') inputfields!: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  dummyTabs: any = [
    { label: 'Purpose and Details', isEdit: false, value: 'primary' },
    { label: 'Analysis Details', isEdit: false, value: 'secondary' },
  ];

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
  isSaveClicked: boolean = false;
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
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  dtMyProjectsTrigger: Subject<any> = new Subject<any>();
  dtMyProjectsOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
  };

  public startDate = new Date();
  errorMessage: string = "Please enter details.";
  public intervalSubscripton$: Subscription;
  experimentName: string;
    showPassword: boolean = false;
  userValidateForm = this.formBuilder.group({
    userName: [''],
     password: ['', Validators.required]
  });
    tempFiles: File[] = []; // temp list before upload
  reviewPwdErrorMessage: any;


  constructor(
    private readonly projectService: ProjectService,
    private readonly analysisService: AnalysisService,
    private readonly inwardService: InwardManagementService,
    private readonly testService: TestService,
    private readonly formulationService: FormulationsService,
    private toastr: ToastrService,
    private renderer2: Renderer2,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: Router,
    private loginService: LoginserviceService,
    private commonFunctionsService: CommonFunctionsService,
    private globalService: GlobalService,

  ) { }

  ngOnInit(): void {
    const saveDataForEveryFiveMinutes = 5 * 60 * 1000;
    this.intervalSubscripton$ = interval(saveDataForEveryFiveMinutes).subscribe((v) => {
      if (this.experimentDetails) {
        this.autoSave();
      }
    });

    this.selectedTrfs$.subscribe((trfs) => {
      this.selectedTrfs = trfs;
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
    this.experimentId = this.activatedRoute.snapshot.queryParams['analysis'];
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    this.isCreatedExperiment = this.experimentId ? true : false;
    this.getBatchNumber();
    this.getAnalysisById(this.experimentId);
    this.getProjectDetails();
    this.getTests();
    this.generateUniqueAnalysisExperimentId();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtMyProjectsTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.intervalSubscripton$.unsubscribe();
  }

  public editorConfig = {
    customConfig: '/assets/ckeditor/config.js', // Path to the config.js file
  };
 

  getProjectDetails() {
    this.projectService.getProjectById(this.projectId).subscribe((project) => {
      this.project = project;
      this.testRequestForm.patchValue({
        batchNumber: this.project.batchNumber,
        dosageForm: this.project.dosageName,
        projectName: this.project.projectName,
        strength: this.project.strength,
        batchSize: this.project.batchSize,
        testRequestId: this.staticTrfId,
        department: "ANALYSIS",
        productCode:  this.project.productCode,
        market: this.project.markertName
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
    if (activeTab.substring(0, 3) === 'tab') {
      this.getAnalysisDetailsById(activeTab);
    }
  }

  addTests(): FormGroup {
    return this.formBuilder.group({
      testId: [''],
      test: [''],
      results: [null],
      description: ['']
    });
  }

  getResultsDetailsById() {
    this.analysisService
      .getTestFormResults(this.experimentId)
      .subscribe((data) => {
       this.resultData = Array.isArray(data) && data.length ? data[0] : null;
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
        }
      });
  }

  getExcipientDetails() {
    this.analysisService
      .getExcipientDetailsById(this.experimentId)
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
        }
      });
  }

  getAnalysisDetailsById(tabValue) {
    this.analysisService
      .getAnalysisDeatilsById(tabValue.substring(3))
      .subscribe((details) => {
        const index = this.dummyTabs.findIndex((tab) => tab.value == tabValue);
        this.article[index].text = details.fileContent;
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

  resultValue(event, index) {
    this.tableTestData[index]['result'] = event.target.value;
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'second-table') {
          dtInstance.destroy();
          this.dtMyProjectsTrigger.next(this.tableTestData);
        }
      });
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
      analysisId: this.experimentId,
      insertUser: this.loginService.userDetails.userId,
    };
    // if (!this.selectedTestItems || this.selectedTestItems.length === 0) {
    //   this.toastr.error('Please select at least one lab test', 'Error');
    //   return;
    // }
    if (!this.testRequestForm.invalid) {
      if (this.resultData.analysisId) {
        this.analysisService.updateTestForm(newTestRequest).subscribe(() => {
          this.toastr.success('Test has been added succesfully', 'Success');
          this.getResultsDetailsById();
        });
      } else {
        this.analysisService.createTestForm(newTestRequest).subscribe(() => {
          this.toastr.success('Test has been added succesfully', 'Success');
          this.getResultsDetailsById();
        });
      }
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

  getAttachments() {
    this.analysisService
      .getAttachmentsById(this.experimentId)
      .subscribe((attachments) => {
        this.files = attachments;
      if (this.experimentDetails?.status === 'Inprogress') {
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
          this.getAttachments();
        }
      });
  }

  getExcipients() {
    this.inwardService.getInwardsByCreationSource(departmentMapping[2]).subscribe((inwards) => {
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
    if (this.experimentId) {
      this.route.navigateByUrl(
        `/exp-analysis/analysis-exp?projectId=${this.projectId}&analysis=${id}`
      );
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
    // if () {
    const summary = {
      status: 'Active',
      projectId: this.project.projectId,
      teamId: this.project.teamId,
      userId: this.loginService.userDetails.userId,
      analysisName: this.summaryForm.get('experimentName')?.value,
      experimentStatus: 'New',
      summary: 'string',
      batchSize: this.summaryForm.get('batchSize')?.value,
      batchNumber: this.batchNumber,
      experimentDetailsList: [],
      excipients: [],
      testRequestFormList: [],
      insertUser: this.loginService.userDetails.firstName
    };

    if (!this.summaryForm.invalid) {
      this.analysisService.saveAnalysis(summary).subscribe((experiment: any) => {
        // change here
        this.getAnalysisById(experiment.data, 'firstLoad');
        // this.activeTab = this.dummyTabs[0].value;
           if (this.tempFiles.length > 0) {
          const uploadObservables = this.tempFiles.map(file =>
            this.analysisService.saveAnalysisAttachment(file, experiment['data'], this.projectId, "Y")
          );
            this.tempFiles = [];
          forkJoin(uploadObservables).subscribe((responses) => {
            // Combine all uploaded file responses
            this.files = responses.flat();
            this.getAnalysisById(experiment.data, 'firstLoad');
            this.toastr.success('Files Uploaded Successfully', 'Success');
          });
        } else {
          this.getAnalysisById(experiment.data, 'firstLoad');
        }
        this.toastr.success('Experiment Started Successfully', 'Success');
      });
    } else {
      this.summaryForm.get('experimentName')?.markAsDirty();
      this.summaryForm.get('batchSize')?.markAsDirty();
    }
  }

  onItemSelect(item: any) {

    this.tableData.push(...this.inwards.filter(i => i.excipientId === item.excipientId)
      .map((data) => ({ ...data, analysisId: Number(this.experimentId), experimentQuantity: 0, excipientQuantity: data.remainingQuantity })));

    this.tableData.forEach(e => {
      if (e.excipientId === item.excipientId) {
        e.quantity = 0;
        e.errorMessage = "Please enter quantity.";
      }
    });

    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'first-table') {
          dtInstance.destroy();
          this.dtTrigger.next(this.tableData);
        }
      });
    });
  }
  deselect(item: any) {
    // this.tableData = this.inwards.filter(({ excipientId: id1 }) =>
    //   this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
    // );
    this.tableData = this.tableData.filter(
      (data) => data.excipientId !== item.excipientId
    );
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'first-table') {
          dtInstance.destroy();
          this.dtTrigger.next(this.tableData);
        }
      });
    });
  }
  onSelectAll(items: any) {
    this.tableData = this.inwards.map((inward) => {
    // Try to find matching row in existing tableData
    const existing = this.tableData.find(t => t.excipientId === inward.excipientId);
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
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'first-table') {
          dtInstance.clear();
          dtInstance.draw();
        }
      });
    });
  }
  isValid(index: number): boolean {
    return !this.article[index].text || this.article[index].text.trim().length === 0;
  }

  saveTab(index, data) {
    if (this.isValid(index)) {
      this.toastr.error('Please enter some content before attempting to save.', 'Error');
      return;
    }
     const currentContent = this.article[index]?.text ?? '';
     const lastSaved = this.dummyTabs[index]?.lastSavedContent ?? '';

  // Check if content is unchanged
  if (currentContent === lastSaved) {
    this.toastr.warning("No changes detected. Update not required.", "Warning");
    return;
  }
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
        `Experiment details ${this.dummyTabs[index].id ? 'updated' : 'created'
        } successfully`,
        'Success'
      );
      // if (this.dummyTabs[index].value.substring(0, 3) === 'new') {
      //   this.activeTab = `${this.dummyTabs[index].value}-tab`;
      //   this.getAnalysisById(this.experimentId);
      // }
      if (this.dummyTabs[index].value.startsWith('new') && data?.analysisDetailId) {
        this.dummyTabs[index].value = `id${data.analysisDetailId}`;
        this.activeTab = `id${data.analysisDetailId}-tab`;
      }
      this.dummyTabs[index].showDeleteIcon = false;
       this.dummyTabs[index].lastSavedContent = currentContent;
    });
  }

  private autoSave() {

    let saveCalls: any = [];
    for (let index = 0; index < this.dummyTabs.length; index++) {
      if (this.article[index].text && this.article[index].text.trim().length) {
        let tabValue: any = {
          status: 'Active',
          analysisId: this.experimentId,
          name: this.dummyTabs[index].label,
          fileContent: this.article[index].text,
          autoSave: 'Y'
        };

        tabValue = {
          ...tabValue,
          analysisDetailId:
            this.dummyTabs[index].value.substring(0, 3) === 'new'
              ? null
              : this.dummyTabs[index].value.substring(3),
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

  onChange(event) {
    this.file = event.target.files[0];
  }

   removeTempFile(file: File) {
    this.tempFiles = this.tempFiles.filter(f => f.name !== file.name);
  }

   attachFile(event: any) {
    const selectedFiles: FileList = event.target.files;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const alreadyExists = this.tempFiles.some(f => f.name === file.name);

      if (!alreadyExists) {
        this.tempFiles.push(file);
      } else {
        this.toastr.warning(`File "${file.name}" already selected`, 'Duplicate File');
      }
    }
    // Reset input value so same file can be re-selected if removed
    event.target.value = '';
  }

  processFile(event) {
    const selectedFile = event.target.files[0];
     if (!selectedFile) return;

  const uploadedInSummary = this.files.some(
    f => f.name === selectedFile.name && f.fromSummary === 'Y'
  );

  if (uploadedInSummary) {
    this.toastr.warning(`"${selectedFile.name}" was already uploaded in the Summary page`, 'File Exists');
    event.target.value = ''; // Reset input
    return;
  }

  const alreadyUploaded = this.files.some(
    f => f.name === selectedFile.name
  );

  if (alreadyUploaded) {
    this.toastr.warning(`"${selectedFile.name}" is already uploaded`, 'Duplicate File');
    event.target.value = '';
    return;
  }

    this.analysisService
      .saveAnalysisAttachment(selectedFile, this.experimentId, this.projectId, "N")
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

  saveExcipients() {
    if (this.selectedItems.length === 0) {
      this.toastr.error('Please select at least one excipient', 'Error');
      return;
    }
    this.isSaveClicked = true;

    if (this.tableData.find(excipient => !this.commonFunctionsService.isEmptyOrUndefined(excipient.errorMessage))) {
      return;
    }

    const isUpdate = this.tableData.some((data) => data.analysisId);
    if (!isUpdate) {
      this.tableData.forEach(data => {
        data['experimentId'] = this.experimentId;
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
        this.toastr.success(data.data, 'Success');
      });
  }

  updateAnalysisStatus(status: string, summary?: string) {
    let analysisRequest = {
      analysisId: this.experimentId,
      status: status,
      summary: summary ? summary : status,
      userId: this.loginService.userDetails.userId,
    };
   if (this.userValidateForm.valid) {
    const request = {
      mailId: this.userValidateForm.value.userName ?? '',
      password: this.userValidateForm.value.password ?? ''
    };
    this.loginService.login(request).subscribe({
      next:(response) => {
        if (response) {
          this.analysisService.updateAnalysisStatus(analysisRequest).subscribe((data) => {
            this.toastr.success('Experiment Completed Successfully', 'Success');
            this.route.navigateByUrl('/exp-analysis/list');
          });
        }
      },
     error: (err) => {
          this.globalService.hideLoader();
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
        }
      });
  } else {
    this.userValidateForm.get('userName')?.markAsDirty();
    this.userValidateForm.get('password')?.markAsDirty();
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
  generateUniqueAnalysisExperimentId() {
    this.analysisService.generateUniqueAnalysisExperimentId().subscribe({
      next: (data) => {
        this.summaryForm.get('experimentName')?.setValue(data);
        this.experimentName = data;
      }
    });
  }

}
