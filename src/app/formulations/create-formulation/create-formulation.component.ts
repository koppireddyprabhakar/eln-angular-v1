import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subject, takeWhile } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';

import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-create-formulation',
  templateUrl: './create-formulation.component.html',
  styleUrls: ['./create-formulation.component.scss'],
})
export class CreateFormulationComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

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
  private subscribeFlag: boolean = true;
  tests: any = [];

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

  dtResultTrigger: Subject<any> = new Subject<any>();
  dtResultOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
  };

  public startDate = new Date();

  constructor(
    private readonly projectService: ProjectService,
    private readonly experimentService: ExperimentService,
    private readonly inwardService: InwardManagementService,
    private readonly formulationService: FormulationsService,
    private toastr: ToastrService,
    private renderer2: Renderer2,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: Router,
    private loginService: LoginserviceService,
    private globalService: GlobalService,
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
      (this.activatedRoute.snapshot.queryParams['edit'] && this.activatedRoute.snapshot.queryParams['edit'] === "true" ? true : false) || false;
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
    this.isCreatedExperiment = this.experimentId ? true : false;
    this.getBatchNumber();
    this.getExperimentDetails(this.experimentId);
    this.getProjectDetails();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtResultTrigger.next(null);
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
    if (activeTab === 'results') {
      this.getTestResults();
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
          // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   // Destroy the table first
          //   dtInstance.destroy();
          //   // Call the dtTrigger to rerender again
          //   this.dtTrigger.next(this.tableData);
          // });

          this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
            dtElement.dtInstance.then((dtInstance: any) => {
              if (dtInstance.table().node().id === 'first-table') {
                dtInstance.destroy();
                this.dtTrigger.next(this.tableData);
              }
            });
          });
        }
      });
  }

  getExperimentDetailsById(tabValue) {
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
    const fileData = { ...file, experimentAttachmentId: file.attachmentId, projectId: this.projectId };
    this.experimentService
      .deleteExperimentAttachment(fileData)
      .subscribe((experimentDetails) => {
        if (experimentDetails['data'] === "Experiment Attachment Delete Successfully") {
          this.getAttachments();
        }
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
      status: 'Inprogress',
      projectId: this.project.projectId,
      teamId: this.project.teamId,
      userId: this.loginService.userDetails.userId,
      experimentName: this.summaryForm.get('experimentName')?.value,
      experimentStatus: 'Inprogress',
      summary: 'string',
      batchSize: this.summaryForm.get('batchSize')?.value,
      batchNumber: this.batchNumber,
      experimentDetailsList: [],
      excipients: [],
    };

    if (!this.summaryForm.invalid) {
      this.experimentService
        .saveExperiment(summary)
        .subscribe((experiment: any) => {
          this.getExperimentDetails(experiment.data, 'firstLoad');
          // redirect to 2

          this.toastr.success('Experiment Started Successfully', 'Success');
        });
    }
    else {
      this.summaryForm.get('experimentName')?.markAsDirty();
      this.summaryForm.get('batchSize')?.markAsDirty();
    }
  }

  updateSummary() {
    const summary = {
      experimentId: this.experimentDetails.expId,
      projectId: this.project.projectId,
      teamId: this.experimentDetails.teamId,
      userId: this.experimentDetails.userId,
      experimentName: this.summaryForm.get('experimentName')?.value,
      experimentStatus: this.experimentDetails.experimentStatus,
      summary: this.experimentDetails.summary,
      batchSize: this.summaryForm.get('batchSize')?.value,
      batchNumber: this.batchNumber,
      status: 'Active'
    };

    if (!this.summaryForm.invalid) {
      this.experimentService
        .updateExperiment(summary)
        .subscribe((experiment: any) => {
          this.getExperimentDetails(this.experimentDetails.expId, 'firstLoad');
          this.toastr.success('Experiment updated Successfully', 'Success');
        });
    } else {
      this.summaryForm.get('experimentName')?.markAsDirty();
      this.summaryForm.get('batchSize')?.markAsDirty();
    }
  }

  onItemSelect(item: any) {
    this.tableData = this.inwards
      .filter(({ excipientId: id1 }) =>
        this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
      )
      .map((data) => ({ ...data, experimentId: Number(this.experimentId) }));
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   // Destroy the table first
    //   dtInstance.destroy();
    //   // Call the dtTrigger to rerender again
    //   this.dtTrigger.next(this.tableData);
    // });
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
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   // Destroy the table first
    //   dtInstance.destroy();
    //   // Call the dtTrigger to rerender again
    //   this.dtTrigger.next(this.tableData);
    // });

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
    this.tableData = this.inwards;
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   // Destroy the table first
    //   dtInstance.destroy();
    //   // Call the dtTrigger to rerender again
    //   this.dtTrigger.next(this.tableData);
    // });
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'first-table') {
          dtInstance.destroy();
          this.dtTrigger.next(this.tableData);
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
    const sss = JSON.stringify(this.article[index].text);
    let tabValue: any = {
      status: 'string',
      experimentId: this.experimentId,
      name: data.label,
      fileContent: this.article[index].text,
    };

    tabValue = {
      ...tabValue,
      experimentDetailId:
        this.dummyTabs[index].value.substring(0, 3) === 'new'
          ? null
          : this.dummyTabs[index].value.substring(3),
    };

    this.experimentService.saveExperimentTabs(tabValue).subscribe((data) => {
      this.toastr.success(
        `Experiment Data ${this.dummyTabs[index].id ? 'updated' : 'Saved'
        } Successfully`,
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
      `${environment.API_BASE_PATH}` + `/experiment/get-experiment-attachment-content/${fileName}/${experimentId}/${this.projectId}`
    );
  }

  saveExcipients() {
    if (this.selectedItems.length === 0) {
      this.toastr.error('Please select at least one excipient', 'Error');
      return;
    }
    const isUpdate = this.tableData.some((data) => data.experimentId);
    if (!isUpdate) {
      this.tableData.forEach(data => {
        data['experimentId'] = this.experimentId;
      })
    }
    this.experimentService.saveExcipient(this.tableData).subscribe((data) => {
      this.toastr.success(data.data, 'Success');
    });

  }

  updateExperimentStatus() {
    let status = "Complete";


    this.experimentService.updateExperimentStatus(this.experimentId, status).subscribe((data) => {
      this.toastr.success(data['data'], 'Success');

      this.route.navigateByUrl(
        `/forms-page/experiments`
      );
    });
  }

  getTestResults() {
    this.globalService.showLoader();
    this.formulationService
      .getTrfResultsByExperimentId(this.experimentId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((tests) => {
        this.tests = tests;

        this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
          dtElement.dtInstance.then((dtInstance: any) => {
            if (dtInstance.table().node().id === 'second-table') {
              dtInstance.destroy();
              this.dtResultTrigger.next(this.tests);
            }
          });
        });

        this.globalService.hideLoader();
      });
  }

}
