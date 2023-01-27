import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { TestService } from '@app/shared/services/test/test.service';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-analysis-new-experiment',
  templateUrl: './analysis-new-experiment.component.html',
  styleUrls: ['./analysis-new-experiment.component.scss'],
})
export class AnalysisNewExperimentComponent implements OnInit {
  @ViewChild('inputfields') inputfields!: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  dummyTabs: any = [
    { label: 'Purpose and Conclusions', isEdit: false, value: 'primary' },
    { label: 'Formulation', isEdit: false, value: 'secondary' },
  ];

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
    private route: Router
  ) {}

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
    this.experimentId = this.activatedRoute.snapshot.queryParams['analysis'];
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    this.isCreatedExperiment = this.experimentId ? true : false;
    this.getBatchNumber();
    this.getAnalysisById(this.experimentId);
    this.getProjectDetails();
    this.getTests();
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
    console.log(activeTab.substring(3));
    if (activeTab.substring(0, 3) === 'tab') {
      this.getAnalysisDetailsById(activeTab);
    }
  }

  addTests(): FormGroup {
    return this.formBuilder.group({
      testId: ['', [Validators.required]],
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
        console.log(this.resultData.analysisId);
        if (this.resultData.analysisId) {
          this.testRequestForm.patchValue({
            condition: this.resultData.condition,
            stage: this.resultData.stage,
            packaging: this.resultData.packaging,
            quantity: this.resultData.quantity,
            labelClaim: this.resultData.labelClaim,
            manufacturingDate: this.resultData.manufacturingDate,
            expiryDate: this.resultData.expiryDate,
          });
          this.tableTestData = this.resultData.trfTestResults;
          this.selectedTestItems = this.resultData.trfTestResults;
          console.log(this.tableTestData);
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
        console.log(data);
        if (data.length > 0) {
          this.tableData = data;
          this.selectedItems = data;
        }
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
      testResult: 'string',
    }));
  }
  onTestSelectAll(items: any) {
    console.log(items);
    this.tableTestData = this.tests.map((test, index) => ({
      ...test,
      testStatus: 'string',
      testNumber: `${this.staticTrfId}-A${index}`,
      testResult: 'string',
    }));
  }

  resultValue(event, index) {
    this.tableTestData[index]['result'] = event.target.value;
  }

  saveTestRequestForm() {
    const manDate = this.testRequestForm.get('manufacturingDate')?.value || '';
    const expiryDate = this.testRequestForm.get('expiryDate')?.value || '';

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
    };
    // if (!this.testRequestForm.invalid) {
    if (this.resultData.analysisId) {
      // this.analysisService.updateTestForm(newTestRequest).subscribe(() => {
      //   this.toastr.success('Test has been added succesfully', 'Success');
      //   this.getResultsDetailsById();
      //   // this.route.navigate(['/forms-page/new-formulation']);
      // });
    } else {
      this.analysisService.createTestForm(newTestRequest).subscribe(() => {
        this.toastr.success('Test has been added succesfully', 'Success');
        this.getResultsDetailsById();
        // this.route.navigate(['/forms-page/new-formulation']);
      });
    }

    // } else {
    //   this.testRequestForm.get('testRequestId')?.markAsDirty();
    //   this.testRequestForm.get('department')?.markAsDirty();
    //   this.testRequestForm.get('dosageForm')?.markAsDirty();
    //   this.testRequestForm.get('expiryDate')?.markAsDirty();
    //   this.testRequestForm.get('manufacturingDate')?.markAsDirty();
    //   this.testRequestForm.get('labelClaim')?.markAsDirty();
    //   this.testRequestForm.get('quantity')?.markAsDirty();
    //   // this.testRequestForm.get('batchSize')?.markAsDirty();
    //   this.testRequestForm.get('packaging')?.markAsDirty();
    //   this.testRequestForm.get('stage')?.markAsDirty();
    //   // this.testRequestForm.get('batchNumber')?.markAsDirty();
    //   this.testRequestForm.get('projectName')?.markAsDirty();
    //   this.testRequestForm.get('strength')?.markAsDirty();
    //   this.testRequestForm.get('projectCode')?.markAsDirty();
    //   this.testRequestForm.get('condition')?.markAsDirty();
    // }
  }

  getAttachments() {
    this.analysisService
      .getAttachmentsById(this.experimentId)
      .subscribe((attachments) => {
        this.files = attachments;
      });
  }

  removeAttachment(file) {
    const fileData = { ...file, projectId: this.projectId };
    this.experimentService
      .deleteExperimentAttachment(file)
      .subscribe((experimentDetails) => {});
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
          // this.summaryForm.patchValue({
          //   experimentName: experimentDetails.experimentName,
          //   batchSize: experimentDetails.batchSize,
          // });
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
      userId: this.project.userId,
      analysisName: this.summaryForm.get('experimentName')?.value,
      experimentStatus: 'string',
      summary: 'string',
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

  onItemSelect(item: any) {
    this.tableData = this.inwards
      .filter(({ excipientId: id1 }) =>
        this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
      )
      .map((table) => ({ ...table, analysisId: Number(this.experimentId) }));
  }
  deselect(item: any) {
    // this.tableData = this.inwards.filter(({ excipientId: id1 }) =>
    //   this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
    // );
    this.tableData = this.tableData.filter(
      (data) => data.excipientId !== item.excipientId
    );
  }
  onSelectAll(items: any) {
    this.tableData = this.inwards;
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
        `Experiment detail ${
          this.dummyTabs[index].id ? 'updated' : 'created'
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

  saveAttachment() {}

  onChange(event) {
    this.file = event.target.files[0];
  }

  processFile(event) {
    const selectedFile = event.target.files[0];
    this.analysisService
      .saveAnalysisAttachment(selectedFile, this.experimentId, this.projectId)
      .subscribe((response) => {
        this.files = response;
        this.toastr.success('File Uploaded Successfully', 'Success');
      });
  }

  getFileContent(fileName: string, experimentId: number) {
    window.location.assign(
      `http://localhost:4201/experiment/get-experiment-attachment-content/${fileName}/${experimentId}/${this.projectId}`
    );
  }

  saveExcipients() {
    this.analysisService
      .saveAnalysisExcipient(this.tableData)
      .subscribe((data) => {
        this.toastr.success(data.data, 'Success');
      });
  }
}
