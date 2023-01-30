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
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-create-formulation',
  templateUrl: './create-formulation.component.html',
  styleUrls: ['./create-formulation.component.scss'],
})
export class CreateFormulationComponent implements OnInit {
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
  editExperiment = false;
  experimentId: string;
  experimentDetails: any;
  file: File;
  isCreatedExperiment = false;
  activeTabIndex: number;
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
    private readonly inwardService: InwardManagementService,
    private readonly formulationService: FormulationsService,
    private toastr: ToastrService,
    private renderer2: Renderer2,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: Router
  ) { }

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
    this.editExperiment =
      this.activatedRoute.snapshot.queryParams['edit'] || false;
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    this.isCreatedExperiment = this.experimentId ? true : false;
    this.getBatchNumber();
    this.getExperimentDetails(this.experimentId);
    this.getProjectDetails();
  }

  getProjectDetails() {
    this.projectService.getProjectById(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  search(activeTab, index: number) {
    this.activeTab = activeTab;
    this.activeTabIndex = index;

    if (activeTab === 'attachments') {
      this.getAttachments();
    }
    if (activeTab === 'excipients') {
      this.getExcipientDetails();
    }
    if (activeTab.substring(0, 3) === 'tab') {
      this.getExperimentDetailsById(activeTab);
    }
  }

  getExcipientDetails() {
    this.experimentService
      .getExcipientDetailsById(this.experimentId)
      .subscribe((data) => {
        console.log(data);
        if (data.length > 0) {
          this.tableData = data;
          this.selectedItems = data;
        }
      });
  }

  getExperimentDetailsById(tabValue) {
    // console.log(id);
    // const expDetailsId = Number(id.slice(-1));
    // this.experimentService
    //   .getExperimentDetailsById(expDetailsId)
    //   .subscribe((details) => {
    //     this.article[this.activeTabIndex].text = details?.fileContent;
    //   });

    this.experimentService
      .getExperimentDetailsById(tabValue.substring(3))
      .subscribe((details) => {
        const index = this.dummyTabs.findIndex((tab) => tab.value == tabValue);
        console.log(index);
        this.article[index].text = details.fileContent;
        console.log(details);
      });
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

  getExperimentDetails(id, firstLoad?: any) {
    this.experimentId = id;
    this.isCreatedExperiment = this.experimentId ? true : false;
    if (this.experimentId) {
      if (!this.editExperiment) {
        this.route.navigateByUrl(
          `/create-forms?projectId=${this.projectId}&experimentId=${this.experimentId}`
        );
      }
      this.experimentService
        .getIndvExperimentById(this.experimentId)
        .subscribe((experimentDetails) => {
          this.experimentDetails = experimentDetails;
          // if (this.editExperiment) {

          this.article = experimentDetails.experimentDetails.map((exp) => ({
            title: '',
            text: '',
          }));
          this.dummyTabs = experimentDetails.experimentDetails.map((exp) => ({
            label: exp.name,
            isEdit: false,
            value: 'tab' + exp.experimentDetailId,
          }));
          if (firstLoad === 'firstLoad') {
            this.activeTab = this.dummyTabs[0].value;
          }

          this.tableData = experimentDetails.experimentExcipients;
          // }
          this.summaryForm.patchValue({
            experimentName: experimentDetails?.experimentName,
            batchSize: experimentDetails?.batchSize,
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
      label: `New Tab - ${length + 1}`,
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
      userId: 3,
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
        this.getExperimentDetails(experiment.data, 'firstLoad');
        // redirect to 2

        this.toastr.success('Experiment Started Successfully', 'Success');
      });
  }

  onItemSelect(item: any) {
    this.tableData = this.inwards
      .filter(({ excipientId: id1 }) =>
        this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
      )
      .map((data) => ({ ...data, experimentId: Number(this.experimentId) }));
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
    // if (!this.editExperiment) {
    //   if (this.dummyTabs[index].id) {
    //     tabValue = {
    //       ...tabValue,
    //       experimentDetailId: this.dummyTabs[index].id,
    //     };
    //   }
    //   this.experimentService.saveExperimentTabs(tabValue).subscribe((data) => {
    //     this.toastr.success(
    //       `Experiment detail ${
    //         this.dummyTabs[index].id ? 'updated' : 'created'
    //       } successfully`,
    //       'Success'
    //     );
    //     this.dummyTabs[index]['id'] = data.data;
    //     this.getExperimentDetails(this.experimentId);
    //   });
    // } else {
    //   const id = Number(data.value.slice(-1));
    //   tabValue = {
    //     ...tabValue,
    //     experimentDetailId: id,
    //   };
    //   this.experimentService.saveExperimentTabs(tabValue).subscribe((data) => {
    //     this.toastr.success(
    //       'Experiment detail updated successfully',
    //       'Success'
    //     );
    //     this.getExperimentDetails(this.experimentId);
    //   });
    // }
    console.log(this.dummyTabs[index].value);
    console.log(this.dummyTabs[index].value.substring(0, 3));
    tabValue = {
      ...tabValue,
      experimentDetailId:
        this.dummyTabs[index].value.substring(0, 3) === 'new'
          ? null
          : this.dummyTabs[index].value.substring(3),
    };

    this.experimentService.saveExperimentTabs(tabValue).subscribe((data) => {
      this.toastr.success(
        `Experiment detail ${this.dummyTabs[index].id ? 'updated' : 'created'
        } successfully`,
        'Success'
      );
      // this.dummyTabs[index]['id'] = data.data;
      //
      if (this.dummyTabs[index].value.substring(0, 3) === 'new') {
        console.log('to summar');
        this.activeTab = 'summary';
        this.getExperimentDetails(this.experimentId);
      }
      // this.getExperimentDetails(this.experimentId, 'noTabLoad');
    });
  }

  saveAttachment() { }

  onChange(event) {
    this.file = event.target.files[0];
  }

  processFile(event) {
    const selectedFile = event.target.files[0];
    this.experimentService
      .saveExperimentAttachment(selectedFile, this.experimentId, this.projectId)
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
    const isUpdate = this.tableData.some((data) => data.experimentId);
    if (!isUpdate) {
      this.experimentService.saveExcipient(this.tableData).subscribe((data) => {
        this.toastr.success(data.data, 'Success');
      });
    } else {
      this.experimentService.saveExcipient(this.tableData).subscribe((data) => {
        this.toastr.success(data.data, 'Success');
      });
    }
  }

  updateExperimentStatus() {
    this.experimentService.updateExperimentStatus(this.experimentId, 'Complete').subscribe((data) => {
      this.toastr.success(data['data'], 'Success');
    });
  }

}
