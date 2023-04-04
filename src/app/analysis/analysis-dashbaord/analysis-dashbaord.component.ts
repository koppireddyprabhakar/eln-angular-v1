import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, tap } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-analysis-dashbaord',
  templateUrl: './analysis-dashbaord.component.html',
  styleUrls: ['./analysis-dashbaord.component.scss'],
})
export class AnalysisDashbaordComponent implements OnInit {
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
  tableData: any = [];
  experimentId: string;
  experimentDetails: any;
  file: File; aveSummary
  isCreatedExperiment = false;
  selectedTrfs$ = this.analysisService.selectedTrfs$;
  selectedTrfs: any = [];
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  public files: any = [];
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  activeTab = 'summary';

  summaryForm = this.formBuilder.group({
    experimentName: ['', [Validators.required]],
    batchSize: ['' as any, [Validators.required]],
  });

  public selectedFile: any;
  public startDate = new Date();

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
    this.experimentId = this.activatedRoute.snapshot.queryParams['analysis'];
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    this.isCreatedExperiment = this.experimentId ? true : false;
    this.getBatchNumber();
    this.getAnalysisById(this.experimentId);
    this.getProjectDetails();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  getProjectDetails() {
    this.projectService.getProjectById(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  search(activeTab) {
    this.activeTab = activeTab;
    if (activeTab === 'attachments') {
      this.getAttachments();
    }
    console.log(activeTab.substring(3));
    if (activeTab === 'excipients') {
      this.getExcipientDetails();
    }
    if (activeTab === 'results') {
      this.getTrfDetailsById();
    }
    if (activeTab.substring(0, 3) === 'tab') {
      this.getAnalysisDetailsById(activeTab);
    }
  }

  getExcipientDetails() {
    this.analysisService
      .getExcipientDetailsById(this.experimentId)
      .subscribe((data) => {
        console.log(data);
        if (data.length > 0) {
          this.tableData = data;
          this.selectedItems = data;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.tableData);
          });
        }
      });
  }
  getTrfDetailsById() {
    this.analysisService
      .getTrfDetailsById(this.experimentId)
      .subscribe((data) => {
        console.log(data);
        if (data.length > 0) {
          this.selectedTrfs = data;
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

  getAttachments() {
    this.analysisService
      .getAttachmentsById(this.experimentId)
      .subscribe((attachments) => {
        this.files = attachments;
      });
  }

  removeAttachment(file) {
    const fileData = { ...file, analysisAttachmentId: file.attachmentId, projectId: this.projectId };
    this.analysisService
      .deleteAnalysisAttachment(fileData)
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

  getAnalysisById(id, firstLoad?: any) {
    this.experimentId = id;
    this.isCreatedExperiment = this.experimentId ? true : false;
    if (this.experimentId) {
      this.route.navigateByUrl(
        `/exp-analysis/dashboard?projectId=${this.projectId}&analysis=${id}`
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
          if (firstLoad === 'firstLoad') {
            this.activeTab = this.dummyTabs[0].value;
          }
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
      label: `New Tab - ${length + 1}`,
      isEdit: false,
      value: `newTab-${(length + 1).toString()}`,
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
      testRequestFormList: this.selectedTrfs,
    };
    if (!this.summaryForm.invalid) {
      this.analysisService.saveAnalysis(summary).subscribe((experiment: any) => {
        if (this.selectedFile) {
          this.analysisService
            .saveAnalysisAttachment(this.selectedFile, experiment['data'], this.projectId,
              "Y")
            .subscribe((response) => {
              this.files = response;
              this.getAnalysisById(experiment.data, 'firstLoad');
            });
        } else {
          this.getAnalysisById(experiment.data, 'firstLoad');
        }


        // this.activeTab = this.dummyTabs[0].value;
        this.toastr.success('Experiment Started Successfully', 'Success');
      });
    }
    else {
      this.summaryForm.get('experimentName')?.markAsDirty();
      this.summaryForm.get('batchSize')?.markAsDirty();
    }
  }

  onItemSelect(item: any) {
    this.tableData = this.inwards
      .filter(({ excipientId: id1 }) =>
        this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
      )
      .map((table) => ({ ...table, analysisId: Number(this.experimentId) }));
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.tableData);
    });
  }
  deselect(item: any) {
    // this.tableData = this.inwards.filter(({ excipientId: id1 }) =>
    //   this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
    // );
    this.tableData = this.tableData.filter(
      (data) => data.excipientId !== item.excipientId
    );
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.tableData);
    });
  }
  onSelectAll(items: any) {
    this.tableData = this.inwards;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.tableData);
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
    const sss = JSON.stringify(this.article[index].text);
    let tabValue: any = {
      status: 'string',
      analysisId: this.experimentId,
      name: data.label,
      fileContent: this.article[index].text,
    };
    console.log(this.dummyTabs[index].value.substring(0, 3));
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

  attachFile(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  processFile(event) {
    const attachedFile = event.target.files[0];
    this.analysisService
      .saveAnalysisAttachment(attachedFile, this.experimentId, this.projectId, null)
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
    this.analysisService
      .saveAnalysisExcipient(this.tableData)
      .subscribe((data) => {
        this.toastr.success(data.data, 'Success');
      });
  }

  trfResultChange(result, index) {
    console.log(this.selectedTrfs);
    console.log(result.value, index);
    this.selectedTrfs[index].testResult = result.value;

    console.log(this.selectedTrfs);
  }

  saveResults() {
    this.analysisService.saveTrfResults(this.selectedTrfs).subscribe((data) => {
      this.toastr.success(data.data, 'Success');
    });
  }

  updateAnalysisStatus(status: string, summary?: string) {

    let analysisRequest = {
      analysisId: this.experimentId,
      status: status,
      summary: summary ? summary : status
    }

    this.analysisService.updateAnalysisStatus(analysisRequest).subscribe((data) => {
      this.toastr.success(data['data'], 'Success');
      this.route.navigateByUrl(`/exp-analysis/list`);
    });

  }

}
