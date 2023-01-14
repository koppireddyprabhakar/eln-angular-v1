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
import { tap } from 'rxjs';

@Component({
  selector: 'app-analysis-dashbaord',
  templateUrl: './analysis-dashbaord.component.html',
  styleUrls: ['./analysis-dashbaord.component.scss'],
})
export class AnalysisDashbaordComponent implements OnInit {
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
  tableData: any = [];
  experimentId: string;
  experimentDetails: any;
  file: File;
  isCreatedExperiment = false;
  selectedTrfs$ = this.analysisService.selectedTrfs$;
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
    console.log('inngonoit');
    this.selectedTrfs$.subscribe((trfs) => {
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
    this.experimentId =
      this.activatedRoute.snapshot.queryParams['experimentId'];
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    this.isCreatedExperiment = this.experimentId ? true : false;
    console.log('this.isCreatedExperiment', this.isCreatedExperiment);
    this.getBatchNumber();
    this.getExperimentDetails(this.experimentId);
    this.getProjectDetails();
  }

  getProjectDetails() {
    this.projectService.getProjectById(this.projectId).subscribe((project) => {
      console.log(project);
      this.project = project;
    });
  }

  search(activeTab) {
    this.activeTab = activeTab;
    if (activeTab === 'attachments') {
      this.getAttachments();
    }
  }

  getAttachments() {
    this.experimentService
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
        console.log(batchNumber.data);
        this.batchNumber = batchNumber.data;
      });
  }

  getExperimentDetails(id) {
    this.experimentId = id;
    this.isCreatedExperiment = this.experimentId ? true : false;
    if (this.experimentId) {
      this.route.navigateByUrl(
        `/exp-analysis/dashboard?projectId=${this.projectId}&experimentId=${id}`
      );
      this.experimentService
        .getIndvExperimentById(this.experimentId)
        .subscribe((experimentDetails) => {
          this.experimentDetails = experimentDetails;
          // Commented becaise of no resonse
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
        this.getExperimentDetails(experiment.data);
        this.activeTab = this.dummyTabs[0].value;
        this.toastr.success('Experiment Started Successfully', 'Success');
      });
    console.log(this.summaryForm.value);
  }

  onItemSelect(item: any) {
    console.log(item);
    this.tableData = this.inwards
      .filter(({ excipientId: id1 }) =>
        this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
      )
      .map((table) => ({ ...table, experimentId: Number(this.experimentId) }));
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

  saveTab(index, data) {
    const sss = JSON.stringify(this.article[index].text);
    console.log(index);
    console.log(data.label);
    console.log(sss);
    let tabValue: any = {
      status: 'string',
      experimentId: this.experimentId,
      name: data.label,
      fileContent: this.article[index].text,
    };

    console.log(this.article);
    if (this.dummyTabs[index].id) {
      tabValue = {
        ...tabValue,
        experimentDetailId: this.dummyTabs[index].id,
      };
    }
    this.experimentService.saveExperimentTabs(tabValue).subscribe((data) => {
      console.log(this.dummyTabs[index].id);

      console.log(this.dummyTabs);
      console.log(data);
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
    this.experimentService
      .saveExperimentAttachment(selectedFile, this.experimentId, this.projectId)
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
    this.experimentService.saveExcipient(this.tableData).subscribe((data) => {
      this.toastr.success(data.data, 'Success');
      console.log(data);
    });
  }
}
