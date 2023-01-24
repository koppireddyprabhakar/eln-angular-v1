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
  selector: 'app-analysis-new-experiment',
  templateUrl: './analysis-new-experiment.component.html',
  styleUrls: ['./analysis-new-experiment.component.scss'],
})
export class AnalysisNewExperimentComponent implements OnInit {
  @ViewChild('inputfields') inputfields!: ElementRef;
  dummyTabs: any = [];
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
  file: File;
  isCreatedExperiment = false;
  selectedTrfs$ = this.analysisService.selectedTrfs$;
  selectedTrfs: any = [];
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  public files: any = [];

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
    if (activeTab.substring(0, 3) === 'tab') {
      this.getAnalysisDetailsById(activeTab);
    }
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

  getAnalysisById(id) {
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
      experimentName: this.summaryForm.get('experimentName')?.value,
      experimentStatus: 'string',
      summary: 'string',
      batchSize: this.summaryForm.get('batchSize')?.value,
      batchNumber: this.batchNumber,
      experimentDetailsList: [],
      excipients: [],
    };

    this.analysisService.saveAnalysis(summary).subscribe((experiment: any) => {
      // change here
      console.log(experiment.data);
      this.getAnalysisById(6);
      this.activeTab = this.dummyTabs[0].value;
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
      experimentId: this.experimentId,
      name: data.label,
      fileContent: this.article[index].text,
    };

    tabValue = {
      ...tabValue,
      experimentDetailId: this.dummyTabs[index].value.substring(3),
    };
    this.analysisService.saveAnalysisDetails(tabValue).subscribe((data) => {
      this.toastr.success(
        `Experiment detail ${
          this.dummyTabs[index].id ? 'updated' : 'created'
        } successfully`,
        'Success'
      );
      this.dummyTabs[index]['id'] = data.data;
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
