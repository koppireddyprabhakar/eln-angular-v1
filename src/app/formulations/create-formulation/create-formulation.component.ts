import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-create-formulation',
  templateUrl: './create-formulation.component.html',
  styleUrls: ['./create-formulation.component.scss'],
})
export class CreateFormulationComponent implements OnInit {
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

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};

  summaryForm = this.formBuilder.group({
    experimentName: ['', [Validators.required]],
    batchSize: ['' as any, [Validators.required]],
  });

  constructor(
    private readonly projectService: ProjectService,
    private readonly experimentService: ExperimentService,
    private readonly inwardService: InwardManagementService,
    private readonly formulationService: FormulationsService,

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
    this.experimentId =
      this.activatedRoute.snapshot.queryParams['experimentId'];
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    this.isCreatedExperiment = this.experimentId ? true : false;
    console.log('this.isCreatedExperiment', this.isCreatedExperiment);
    this.getBatchNumber();
    this.getExperimentDetails(this.experimentId);
    this.getProjectDetails();
    this.dummyTabs = [
      { label: 'Purpose and Conclusion', isEdit: false, value: 'primary' },
      { label: 'Formulation', isEdit: false, value: 'secondary' },
    ];
  }

  getProjectDetails() {
    this.projectService.getProjectById(this.projectId).subscribe((project) => {
      console.log(project);
      this.project = project;
    });
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
        `/create-forms?projectId=${this.projectId}&experimentId=${this.experimentId}`
      );
      this.experimentService
        .getExperimentById(this.experimentId)
        .subscribe((experimentDetails) => {
          this.experimentDetails = experimentDetails;
          this.summaryForm.patchValue({
            experimentName: experimentDetails.experimentName,
            batchSize: experimentDetails.batchSize,
          });
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
  onSelectAll(items: any) {
    console.log(items);
    this.tableData = this.inwards;
  }

  saveTab(index, label) {
    const sss = JSON.stringify(this.article[index].text);
    console.log(index);
    console.log(label);
    console.log(sss);
    const tabValue = {
      status: 'string',
      experimentId: this.experimentId,
      name: label,
      fileContent: this.article[index].text,
    };
    console.log(this.article);
    this.experimentService.saveExperimentTabs(tabValue).subscribe((data) => {
      console.log(data);
    });
  }

  saveAttachment() {}

  onChange(event) {
    this.file = event.target.files[0];
  }

  processFile(event) {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
  }

  saveExcipients() {
    console.log(this.tableData);
    this.experimentService.saveExcipient(this.tableData).subscribe((data) => {
      console.log(data);
    });
  }
}
