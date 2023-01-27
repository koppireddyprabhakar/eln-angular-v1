import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-analysis-experiment-dashboard',
  templateUrl: './analysis-experiment-dashboard.component.html',
  styleUrls: ['./analysis-experiment-dashboard.component.scss'],
})
export class AnalysisExperimentDashboardComponent implements OnInit {
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
    private route: Router
  ) {}

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
    this.analysisID = this.activatedRoute.snapshot.queryParams['analysisId'];
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    // this.isCreatedExperiment = this.experimentId ? true : false;
    this.getAnalysisExperimentDetails(this.analysisID);
    this.getProjectDetails();
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
    if (activeTab === 'excipients') {
      this.getExcipientDetails();
    }
    if (activeTab.substring(0, 3) === 'tab') {
      this.getAnalysisDetailsById(activeTab);
    }
    if (activeTab === 'results') {
      this.getTrfDetailsById();
    }
  }

  getTrfDetailsById() {
    this.analysisService
      .getTrfDetailsById(this.analysisID)
      .subscribe((data) => {
        console.log(data);
        if (data.length > 0) {
          this.selectedTrfs = data;
        }
      });
  }

  getExcipientDetails() {
    this.analysisService
      .getExcipientDetailsById(this.analysisID)
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

  getAttachments() {
    this.analysisService
      .getAttachmentsById(this.analysisID)
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
          this.resultsData = analysisExperimentDetails.testRequestForms.map(
            (result) => ({
              ...result,
              testRequestFormStatus: 'active',
              analysisId: Number(this.analysisID),
            })
          );
          console.log(' this.resultsData', this.resultsData);
          this.selectedItems = analysisExperimentDetails.analysisExcipients;
          this.savedSelectedItems =
            analysisExperimentDetails.analysisExcipients;
          this.tableData = analysisExperimentDetails.analysisExcipients;
          // this.experimentDetails = experimentDetails;
          this.batchNumber = analysisExperimentDetails.batchNumber;
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
      experimentName: this.summaryForm.get('experimentName')?.value,
      experimentStatus: 'string',
      summary: 'string',
      batchSize: this.summaryForm.get('batchSize')?.value,
      batchNumber: this.batchNumber,
      experimentDetailsList: [],
      excipients: [],
    };

    this.experimentService
      .saveExperiment(summary)
      .subscribe((experiment: any) => {
        this.getAnalysisExperimentDetails(experiment.data);
        this.activeTab = this.dummyTabs[0].value;
        this.toastr.success('Experiment Started Successfully', 'Success');
      });
  }

  onItemSelect(item: any) {
    this.tableData = this.inwards
      .filter(({ excipientId: id1 }) =>
        this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
      )
      .map((table) => ({ ...table, analysisId: Number(this.analysisID) }));
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

  saveTab(index, label) {
    const sss = JSON.stringify(this.article[index].text);
    let tabValue: any = {
      status: 'ACTIVE',
      analysisId: Number(this.analysisID),
      analysisDetailId:
        this.analysisExperimentDetails.analysisDetails[index].analysisDetailId,
      name: label,
      fileContent: this.article[index].text,
    };

    this.analysisService.saveAnalysisDetails(tabValue).subscribe((data) => {
      this.toastr.success(`Experiment detail updated successfully`, 'Success');
      this.getAnalysisExperimentDetails(this.analysisID);
    });
  }

  saveAttachment() {}

  onChange(event) {
    this.file = event.target.files[0];
  }

  processFile(event) {
    const selectedFile = event.target.files[0];
    this.analysisService
      .saveAnalysisAttachment(
        selectedFile,
        this.analysisID.toString(),
        this.analysisExperimentDetails.projectId.toString()
      )
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

  trfResultChange(result, index) {
    this.resultsData[index].testResult = result.value;

    console.log(this.resultsData);
  }

  saveExcipients() {
    this.analysisService
      .saveAnalysisExcipient(this.tableData)
      .subscribe((data) => {
        this.toastr.success(data.data, 'Success');
      });
  }
  saveResults() {
    this.analysisService.saveTrfResults(this.resultsData).subscribe((data) => {
      this.toastr.success(data.data, 'Success');
    });
  }
}
