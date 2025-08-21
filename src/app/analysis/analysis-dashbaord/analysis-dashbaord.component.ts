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
import { forkJoin, interval, Subject, Subscription, tap } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { ProjectService } from '@app/shared/services/project/project.service';
import { environment } from "src/environments/environment";
import { departmentMapping } from '@app/shared/constants/mappings';

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
  tempFiles: File[] = []; // temp list before upload
  summaryForm = this.formBuilder.group({
    experimentName: ['', [Validators.required]],
    batchSize: ['' as any, [Validators.required]],
  });

  showPassword: boolean = false;
  userValidateForm = this.formBuilder.group({
    userName: [''],
    password: ['', Validators.required]
  });

  public selectedFile: any;
  public startDate = new Date();
  isSaveClicked: boolean = false;
  resultsData: any;
  dtElements: any;
  experimentName: string;
  public intervalSubscripton$: Subscription;
  reviewPwdErrorMessage: any;


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
      const saveDataForEveryFiveMinutes = 1* 60 * 1000;
    this.intervalSubscripton$ = interval(saveDataForEveryFiveMinutes).subscribe((v) => {
      if (this.experimentDetails) {
        this.autoSave();
      }
    });
    this.selectedTrfs$.subscribe((trfs) => {
      this.selectedTrfs = trfs;
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
    this.generateUniqueAnalysisExperimentId();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.intervalSubscripton$.unsubscribe();
  }

  public editorConfig = {
    customConfig: '/assets/ckeditor/config.js',
  };


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
        if (data.length > 0) {

          this.tableData = data.map(d => {
            let inward = this.inwards.find(i => i.excipientId == d.excipientId);
            return ({ ...d, experimentQuantity: d.quantity, excipientQuantity: inward.remainingQuantity, expiryDate: inward.expiryDate })
          });
          this.selectedItems = data.map(d => {
            let inward = this.inwards.find(i => i.excipientId == d.excipientId);
            return ({ ...d, experimentQuantity: d.quantity, excipientQuantity: inward.remainingQuantity })
          });

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
  getTrfDetailsById() {
    this.analysisService
      .getTrfDetailsById(this.experimentId)
      .subscribe((data) => {
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
        this.article[index].text = details.fileContent;
      });
  }


  getAttachments() {
    this.analysisService
      .getAttachmentsById(this.experimentId)
      .subscribe((attachments) => {
        this.files = attachments;
        if (this.experimentDetails?.status === 'Inprogress') {
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
      label: `New Tab - ${length + 1}`,
      isEdit: false,
      value: `newTab-${(length + 1).toString()}`,
      showDeleteIcon: true,
       lastSavedContent: '' 
    });
  }

  saveSummary() {
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
        // if (this.selectedFile) {
        //   this.analysisService
        //     .saveAnalysisAttachment(this.selectedFile, experiment['data'], this.projectId,
        //       "Y")
        //     .subscribe((response) => {
        //       this.files = response;
        //       this.getAnalysisById(experiment.data, 'firstLoad');
        //     });
        // } else {
        //   this.getAnalysisById(experiment.data, 'firstLoad');
        // }
        if (this.tempFiles.length > 0) {
          const uploadObservables = this.tempFiles.map(file =>
            this.analysisService.saveAnalysisAttachment(file, experiment['data'], this.projectId, "Y")
          );

          forkJoin(uploadObservables).subscribe((responses) => {
            // Combine all uploaded file responses
            this.files = responses.flat();
            this.tempFiles = [];
            this.getAnalysisById(experiment.data, 'firstLoad');
            this.toastr.success('Files Uploaded Successfully', 'Success');
          });
        } else {
          this.getAnalysisById(experiment.data, 'firstLoad');
        }
        this.toastr.success('Experiment Started Successfully', 'Success');
      });
    }
    else {
      this.summaryForm.get('experimentName')?.markAsDirty();
      this.summaryForm.get('batchSize')?.markAsDirty();
    }
  }

  onItemSelect(item: any) {
    this.tableData.push(...this.inwards.filter(i => i.excipientId === item.excipientId)
      .map((data) => ({ ...data, analysisId: Number(this.experimentId), experimentQuantity: 0, excipientQuantity: data.remainingQuantity })));

    this.tableData.forEach(e => {
      if (e.excipientId === item.excipientId) {
        e.quantity = 0;
        e.errorMessage = "Please enter quantity.";
      }
    });

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
    this.tableData = this.tableData.filter(
      (data) => data.excipientId !== item.excipientId
    );
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
    this.tableData = this.inwards.map((data) => ({
      ...data,
      experimentId: Number(this.experimentId),
      experimentQuantity: 0,
      excipientQuantity: data.remainingQuantity,
      quantity: 0,
      errorMessage: 'Please enter quantity.'
    }));

    this.dtElements.forEach((dtElement: DataTableDirective) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'first-table') {
          dtInstance.destroy();
          this.dtTrigger.next(this.tableData);
        }
      });
    });
  }

  onDeSelectAll() {
    this.tableData = [];
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if (dtInstance.table().node().id === 'first-table') {
          dtInstance.clear();
          dtInstance.draw();
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
     const currentContent = this.article[index]?.text ?? '';
     const lastSaved = this.dummyTabs[index]?.lastSavedContent ?? '';

  // Check if content is unchanged
  if (currentContent === lastSaved) {
    this.toastr.warning("No changes detected. Update not required.", "Warning");
    return;
  }
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
        `Experiment details ${this.dummyTabs[index].id ? 'updated' : 'created'
        } successfully`,
        'Success'
      );
      if (this.dummyTabs[index].value.startsWith('new') && data?.analysisDetailId) {
        this.dummyTabs[index].value = `id${data.analysisDetailId}`;
        this.activeTab = `id${data.analysisDetailId}-tab`;
      }
      this.dummyTabs[index].showDeleteIcon = false;
      this.dummyTabs[index].lastSavedContent = currentContent;
    });
  }

  deleteNewTab(index: number, tab: any) {
    if (index >= 2) {
      this.dummyTabs.splice(index, 1);
    }
  }


  saveAttachment() { }

  onChange(event) {
    this.file = event.target.files[0];
  }

  attachFile(event) {
    const selectedFiles: FileList = event.target.files;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const alreadyExists = this.tempFiles.some(f => f.name === file.name);

      if (!alreadyExists) {
        this.tempFiles.push(file);
      } else {
        this.toastr.warning(`File "${file.name}" already selected`, 'Duplicate File');
      }
    }

    // Reset input value so same file can be re-selected if removed
    event.target.value = '';
  }

  removeTempFile(file: File) {
    this.tempFiles = this.tempFiles.filter(f => f.name !== file.name);
  }
  processFile(event) {
    const attachedFile = event.target.files[0];
    if (!attachedFile) return;

    // Check if file was uploaded in Summary tab
    const uploadedInSummary = this.files.some(
      f => f.name === attachedFile.name && f.fromSummary === 'Y'
    );

    if (uploadedInSummary) {
      this.toastr.warning(`File "${attachedFile.name}" was already uploaded in Summary page`, 'Duplicate File');
      event.target.value = ''; // reset input
      return;
    }

    // Optional: prevent re-upload by name (generally)
    const alreadyUploaded = this.files.some(
      f => f.name === attachedFile.name
    );

    if (alreadyUploaded) {
      this.toastr.warning(`File "${attachedFile.name}" already uploaded`, 'Duplicate File');
      event.target.value = '';
      return;
    }

    this.analysisService
      .saveAnalysisAttachment(attachedFile, this.experimentId, this.projectId, "N")
      .subscribe((response) => {
        this.files = response;
        this.toastr.success('File Uploaded Successfully', 'Success');
      });
    event.target.value = ''; // reset input
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
    this.isSaveClicked = true;
    const isUpdate = this.tableData.some((data) => data.analysisId);
    if (!isUpdate) {
      this.tableData.forEach(data => {
        data['experimentId'] = this.experimentId;
        data['experimentQuantity'] = 0;
      })
    }

    this.tableData.forEach(e => {
      if (e.experimentQuantity >= 0) {
        e['changedQuantity'] = e.quantity - e.experimentQuantity;
      }
    });

    this.analysisService
      .saveAnalysisExcipient(this.tableData)
      .subscribe((data) => {
        this.toastr.success(data.data, 'Success');
      });
  }

  trfResultChange(result, index) {
    this.selectedTrfs[index].testResult = result.value;
  }

  excipientQuantityChange(value, index) {
    this.tableData[index]['errorMessage'] = "";

    if ((+value - this.tableData[index].experimentQuantity) > this.tableData[index].excipientQuantity) {
      this.tableData[index]['errorMessage'] = "Please enter <= remaining qty " + (this.tableData[index].excipientQuantity ? this.tableData[index].excipientQuantity : this.tableData[index].experimentQuantity);
      return;
    } else if (+value <= 0) {
      this.tableData[index]['errorMessage'] = "Please enter quantity.";
      return;
    }

    this.tableData[index].quantity = +value;
  }


  saveResults() {
    this.isSaveClicked = true;
    const hasEmptyResults = this.selectedTrfs.some(result => !result.testResult);
    if (hasEmptyResults) {
      this.toastr.error('Please enter a value for all resultsss.', 'Error');
      return;
    }
    this.analysisService.saveTrfResults(this.selectedTrfs).subscribe((data) => {
      this.toastr.success(data.data, 'Success');
    });
  }

  updateAnalysisStatus(status: string, summary?: string) {
    let analysisRequest = {
      analysisId: this.experimentId,
      status: status,
      summary: summary ? summary : status,
      userId: this.loginService.userDetails.userId,
    };
    if (this.experimentDetails?.status === 'Inprogress') {
      if (this.userValidateForm.valid) {
        const request = {
          mailId: this.userValidateForm.value.userName ?? '',
          password: this.userValidateForm.value.password ?? ''
        };

        this.loginService.login(request).subscribe({
         next: (response) => {
            if (response) {
              this.analysisService.updateAnalysisStatus(analysisRequest).subscribe((data) => {
                this.toastr.success('Analysis Details Submitted successfully', 'Success');
                this.route.navigateByUrl(`/exp-analysis/analysis-experiments`);
              });
            }
          },
          error: (err) => {
          let errorMessage =
            typeof err.error === 'string'
              ? err.error
              : err?.error?.message || err?.message || 'Something went wrong. Please try again.';

          if (err.status === 403) {
            errorMessage = 'Your account has been locked due to multiple failed login attempts.';
            this.toastr.error(errorMessage, 'Account Locked');
            this.route.navigateByUrl(''); 
          }

          this.reviewPwdErrorMessage = errorMessage;
        }
      });
      } else {
        this.userValidateForm.get('userName')?.markAsDirty();
        this.userValidateForm.get('password')?.markAsDirty();
      }
    } else {
      this.analysisService.updateAnalysisStatus(analysisRequest).subscribe((data) => {
        this.toastr.success(data['data'], 'Success');
        this.route.navigateByUrl(`/exp-analysis/list`);
      });
    }

  }

  generateUniqueAnalysisExperimentId() {
    this.analysisService.generateUniqueAnalysisExperimentId().subscribe({
      next: (data) => {
        this.summaryForm.get('experimentName')?.setValue(data);
        this.experimentName = data;
      }
    });
  }


  private autoSave() {
    let saveCalls: any = [];
    for (let index = 0; index < this.dummyTabs.length; index++) {
      if (this.article[index].text && this.article[index].text.trim().length) {
        let tabValue: any = {
           status: 'string',
          analysisId: this.experimentId,
          name: this.dummyTabs[index].label,
          fileContent: this.article[index].text,
         // autoSave: 'Y'
        };
  
        tabValue = {
          ...tabValue,
          analysisDetailId:
            this.dummyTabs[index].value.substring(0, 3) === 'new'
              ? null
              : this.dummyTabs[index].value.substring('new'.length),
           //  : this.dummyTabs[index].value.substring(3),
        };
  
        saveCalls.push(this.analysisService.saveAnalysisDetails(tabValue));
      }
    }
  
     if (saveCalls.length) {
      forkJoin(saveCalls).subscribe(response => {
      this.toastr.success('Auto Saved Successfully', 'Success');
      });
    }
  }

}
