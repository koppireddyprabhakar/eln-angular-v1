import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';

import { ActivatedRoute, Router } from '@angular/router';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { environment } from "src/environments/environment";
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { departmentMapping } from '@app/shared/constants/mappings';

@Component({
  selector: 'app-analysis-experiment-dashboard',
  templateUrl: './analysis-experiment-dashboard.component.html',
  styleUrls: ['./analysis-experiment-dashboard.component.scss'],
})
export class AnalysisExperimentDashboardComponent implements OnInit {
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
  isSaveClicked: boolean = false;

  userValidateForm = this.formBuilder.group({
    userName: [''],
    password: [''],
  });

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

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
    this.isCreatedExperiment = this.analysisID ? true : false;
    this.getAnalysisExperimentDetails(this.analysisID);
    this.getProjectDetails();
    this.getAttachments();
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
          this.resultsData = data;
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
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.tableData);
          });
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

        if (this.analysisExperimentDetails && (this.analysisExperimentDetails.status.toUpperCase() === 'Review Completed'.toUpperCase()) ||
          (this.analysisExperimentDetails.status.toUpperCase() === 'Inprogress'.toUpperCase())
          || (this.analysisExperimentDetails.status.toUpperCase() === 'Need Correction'.toUpperCase())) {
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
          // this.resultsData = analysisExperimentDetails.testRequestForms.map(
          //   (result) => ({
          //     ...result,
          //     testRequestFormStatus: 'active',
          //     analysisId: Number(this.analysisID),
          //   })
          // );
          // console.log(' this.resultsData', this.resultsData);
          this.selectedItems = analysisExperimentDetails.analysisExcipients;
          this.savedSelectedItems =
            analysisExperimentDetails.analysisExcipients;
          this.tableData = analysisExperimentDetails.analysisExcipients;
          this.dtElement && this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.tableData);
          });
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
    });
  }

  saveSummary() {
    // if () {
    const summary = {
      analysisId: this.analysisExperimentDetails.analysisId,
      analysisName: this.summaryForm.get('experimentName')?.value,
      status: this.analysisExperimentDetails.status,
      projectId: this.project.projectId,
      teamId: this.project.teamId,
      userId: this.analysisExperimentDetails.userId,
      experimentName: this.summaryForm.get('experimentName')?.value,
      summary: this.analysisExperimentDetails.summary,
      batchSize: this.summaryForm.get('batchSize')?.value,
      batchNumber: this.analysisExperimentDetails.batchNumber,
      analysisDetailsList: this.analysisExperimentDetails.analysisDetails,
    };

    this.analysisService
      .updateAnalysis(summary)
      .subscribe((experiment: any) => {

        if (this.selectedFile) {
          this.analysisService
            .saveAnalysisAttachment(this.selectedFile, this.analysisExperimentDetails.analysisId, this.projectId,
              "Y")
            .subscribe((response) => {
              this.files = response;
              this.getAnalysisExperimentDetails(experiment.data);
              this.toastr.success('Updated Analysis Successfully', 'Success');
              this.activeTab = this.dummyTabs[0].value;
            });
        } else {
          this.getAnalysisExperimentDetails(experiment.data);
          this.toastr.success('Updated Analysis Successfully', 'Success');
          this.activeTab = this.dummyTabs[0].value;
        }

      });
  }

  onItemSelect(item: any) {
    this.tableData = this.inwards
      .filter(({ excipientId: id1 }) =>
        this.selectedItems.some(({ excipientId: id2 }) => id2 === id1)
      )
      .map((table) => ({ ...table, analysisId: Number(this.analysisID) }));
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
  onDeSelectAll() {
    this.tableData = [];

    if (this.dtElement) {
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.clear();
        dtInstance.draw();
      });
    }
  }




  isValid(index: number): boolean {
    return !this.article[index].text || this.article[index].text.trim().length === 0;
  }

  saveTab(index, label) {
    if (this.isValid(index)) {
      this.toastr.error('Please enter some content before attempting to save.', 'Error');
      return;
    }
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
      this.toastr.success(`Experiment details updated successfully`, 'Success');
      this.getAnalysisExperimentDetails(this.analysisID);
    });
  }

  saveAttachment() { }

  attachFile(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  onChange(event) {
    this.file = event.target.files[0];
  }

  processFile(event) {
    const attachedFile = event.target.files[0];
    this.analysisService
      .saveAnalysisAttachment(
        attachedFile,
        this.analysisID.toString(),
        this.analysisExperimentDetails.projectId.toString(),
        null
      )
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

  trfResultChange(result, index) {
    this.resultsData[index].testResult = result.value;

    console.log(this.resultsData);
  }

  saveExcipients() {
    if (this.selectedItems.length === 0) {
      this.toastr.error('Please select at least one excipient', 'Error');
      return;
    }
    this.analysisService
      .saveAnalysisExcipient(this.tableData)
      .subscribe((data) => {
        this.toastr.success('Excipients Updated successfully', 'Success');
      });
  }
  saveResults() {
    this.isSaveClicked = true;
    const hasEmptyResults = this.resultsData.some(result => !result.testResult);
    if (hasEmptyResults) {
      this.toastr.error('Please enter a value for all results.', 'Error');
      return; // Stop further execution
    }
    this.analysisService.saveTrfResults(this.resultsData).subscribe((data) => {
      this.toastr.success(data.data, 'Success');
    });
  }

  updateAnalysisStatus(status: string, summary?: string) {
    let analysisRequest = {
      analysisId: this.analysisID,
      status: status,
      summary: summary ? summary : status
    }
    if (this.analysisExperimentDetails && (this.analysisExperimentDetails.status.toUpperCase() === 'Review Completed'.toUpperCase()) ||
      (this.analysisExperimentDetails.status.toUpperCase() === 'Inprogress'.toUpperCase())
      || (this.analysisExperimentDetails.status.toUpperCase() === 'Need Correction'.toUpperCase())) {
      if (!this.userValidateForm.invalid) {

        const request = {
          mailId: this.userValidateForm.value.userName || '',
          password: this.userValidateForm.value.password || ''
        };

        this.loginService.login(request).subscribe(response => {
          if (response) {
            this.analysisService.updateAnalysisStatus(analysisRequest).subscribe((data) => {
              this.toastr.success('Analysis Details Submitted succssfully', 'Success');
              this.route.navigateByUrl(
                `/exp-analysis/analysis-experiments`
              );
            });
          }
        });
      } else {
        this.userValidateForm.get('userName')?.markAsDirty();
        this.userValidateForm.get('password')?.markAsDirty();
      }
    } else {
      this.analysisService.updateAnalysisStatus(analysisRequest).subscribe((data) => {
        this.toastr.success(data['data'], 'Success');
        this.route.navigateByUrl(
          `/exp-analysis/analysis-experiments`
        );
      });
    }

  }
}
