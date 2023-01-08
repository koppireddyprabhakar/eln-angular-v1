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
    { label: 'Purpose and Conclusion', isEdit: false, value: 'primary' },
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
  dropdownSettings: any = {};
  public files: any = [];
  analysisID: any;
  activeTab = 'summary';

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
    console.log('inngonoit');
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
    this.analysisID = this.activatedRoute.snapshot.queryParams['analysisId'];
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    // this.isCreatedExperiment = this.experimentId ? true : false;
    console.log('this.isCreatedExperiment', this.isCreatedExperiment);
    this.getBatchNumber();
    this.getAnalysisExperimentDetails(this.analysisID);
  }

  search(activeTab) {
    this.activeTab = activeTab;
    if (activeTab === 'attachments') {
      this.getAttachments();
    }
  }

  getAttachments() {
    console.log('here');
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
      console.log(this.inwards);
    });
  }

  getBatchNumber() {
    this.formulationService
      .getFormulationBatchNumber()
      .subscribe((batchNumber) => {
        console.log(batchNumber.data);
        this.batchNumber = batchNumber.data;
      });
  }

  getAnalysisExperimentDetails(id) {
    this.analysisID = id;
    if (this.analysisID) {
      this.analysisService
        .getAnalysisById(this.analysisID)
        .subscribe((analysisExperimentDetails) => {
          console.log(analysisExperimentDetails);
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
          this.resultsData = analysisExperimentDetails.testRequestForms;
          this.selectedItems = analysisExperimentDetails.analysisExcipients;
          this.tableData = analysisExperimentDetails.analysisExcipients;
          // console.log(this.article);
          // this.experimentDetails = experimentDetails;
          // this.summaryForm.patchValue({
          //   experimentName: experimentDetails.experimentName,
          //   batchSize: experimentDetails.batchSize,
          // });
        });
    }
  }

  editMode(index) {
    console.log(index);
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
    console.log(index);
    console.log('input value', this.inputValue);
    const d = this.dummyTabs.map((tab, i) => {
      console.log(tab);
      console.log(tab.label);
      console.log(value);
      return {
        ...tab,
        label: i === index ? this.inputValue || value : tab.label,
        isEdit: false,
      };
    });
    this.dummyTabs = d;
    console.log(this.dummyTabs);

    let elemetClass = document.getElementById('summary-tab');
    this.renderer2.addClass(document.getElementById('summary-tab'), 'active');
    this.renderer2.addClass(document.getElementById('summary'), 'active');
    this.renderer2.addClass(document.getElementById('summary'), 'show');
    console.log(document.getElementById('summary-tab'));
    console.log(document.getElementById('summary'));
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
    console.log(this.dummyTabs);
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
        // console.log(data);
        this.getAnalysisExperimentDetails(experiment.data);
        this.activeTab = this.dummyTabs[0].value;
        this.toastr.success('Experiment Started Successfully', 'Success');
      });
    console.log(this.summaryForm.value);
  }

  onItemSelect(item: any) {
    console.log(item);
    this.tableData = this.inwards.filter(({ excipientId: id1 }) =>
      this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
    );
    console.log(this.tableData);
  }
  deselect(item: any) {
    console.log(item);
    // this.tableData = this.inwards.filter(({ excipientId: id1 }) =>
    //   this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
    // );
    this.tableData = this.tableData.filter(
      (data) => data.excipientId !== item.excipientId
    );
    console.log(this.tableData);
  }
  onSelectAll(items: any) {
    console.log(items);
    this.tableData = this.inwards;
  }

  saveTab(index, label) {
    const sss = JSON.stringify(this.article[index].text);
    console.log(index);
    console.log(label);
    console.log(sss);
    let tabValue: any = {
      status: 'ACTIVE',
      analysisId: Number(this.analysisID),
      analysisDetailId:
        this.analysisExperimentDetails.analysisDetails[index].analysisDetailId,
      name: label,
      fileContent: this.article[index].text,
    };
    console.log(this.article);
    this.analysisService.saveAnalysisDetails(tabValue).subscribe((data) => {
      console.log(data);
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
        this.analysisID,
        this.analysisExperimentDetails.projectId
      )
      .subscribe((response) => {
        console.log(response);
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
    console.log(this.tableData);
    this.analysisService
      .saveAnalysisExcipient(this.tableData)
      .subscribe((data) => {
        this.toastr.success(data.data, 'Success');
        console.log(data);
      });
  }
}
