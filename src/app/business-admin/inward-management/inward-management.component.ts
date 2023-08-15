import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from '@app/shared/services/global/global.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject, finalize, takeWhile } from 'rxjs';

@Component({
  selector: 'app-inward-management',
  templateUrl: './inward-management.component.html',
  styleUrls: ['./inward-management.component.scss'],
})
export class InwardManagementComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  inwards: any = [];
  selectedInward: any = {};
  subscribeFlag = true;
  inwardForm = this.formBuilder.group({
    excipientsName: ['', [Validators.required]],
    materialName: ['', [Validators.required]],
    materialType: ['', [Validators.required]],
    batchNumber: ['', [Validators.required]],
    sourceName: ['', [Validators.required]],
    potency: ['', [Validators.required]],
    grade: ['', [Validators.required]],
  });

  public showErrorMsg: boolean = false;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;

  constructor(
    private readonly inwardService: InwardManagementService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService,
    private loginService: LoginserviceService
  ) { }

  ngOnInit(): void {
    this.getExcipients();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  addInward() {
    this.selectedInward = {};
    this.inwardForm.reset();
    this.showErrorMsg = false;
  }

  getExcipients() {
    this.globalService.showLoader();
    this.inwardService
      .getInwards()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((inwards) => {
        const newInwardsList = inwards.map((inward: any) => ({
          ...inward,
          // status: inward.status.toLowerCase() === 'act' ? 'Active' : 'InActive', // change later
        }));
        this.inwards = [...newInwardsList];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.inwards);
        });
        this.globalService.hideLoader();
      });
  }

  saveInward() {
    let formExcipientName = this.inwardForm['controls'] && this.inwardForm['controls']['excipientsName'].value ? this.inwardForm['controls']['excipientsName'].value : '';
    let batchNumber = this.inwardForm['controls'] && this.inwardForm['controls']['batchNumber'].value ? this.inwardForm['controls']['batchNumber'].value : '';

    // let isObjectExists = this.inwards.find(i =>
    //   (i.excipientsName + i.batchNo) === (formExcipientName + batchNumber)
    // );
    let isObjectExists = this.inwards.find(i =>
      i.excipientsName === formExcipientName && i.batchNo === batchNumber && i !== this.selectedInward
    );

    // if (isObjectExists) {
    //   this.showErrorMsg = true;
    //   return;
    // }
    if (isObjectExists && (Object.keys(this.selectedInward).length === 0 || (this.selectedInward.excipientsName !== formExcipientName || this.selectedInward.batchNo !== batchNumber))) {
      this.showErrorMsg = true;
      return;
    }
    this.showErrorMsg = false;
    const newInward = {
      excipientsName: this.inwardForm.get('excipientsName')!.value,
      materialName: this.inwardForm.get('materialName')!.value,
      materialType: this.inwardForm.get('materialType')!.value,
      batchNo: this.inwardForm.get('batchNumber')!.value,
      sourceName: this.inwardForm.get('sourceName')!.value,
      potency: this.inwardForm.get('potency')!.value,
      grade: this.inwardForm.get('grade')!.value,
      insertUser: this.loginService.userDetails.userId
      // status: 'New',
    };
    if (this.inwardForm.valid) {
      this.globalService.showLoader();
      if (Object.keys(this.selectedInward).length === 0) {
        this.inwardService
          .saveInward(newInward)
          .pipe(
            takeWhile(() => this.subscribeFlag),
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.getExcipients();
            this.closeButton.nativeElement.click();
            this.toastr.success('Inward has been added succesfully', 'Success');
          });
      } else {
        this.selectedInward = {
          ...this.selectedInward,
          excipientsName: this.inwardForm.get('excipientsName')!.value,
          materialName: this.inwardForm.get('materialName')!.value,
          materialType: this.inwardForm.get('materialType')!.value,
          batchNo: this.inwardForm.get('batchNumber')!.value,
          sourceName: this.inwardForm.get('sourceName')!.value,
          potency: this.inwardForm.get('potency')!.value,
          grade: this.inwardForm.get('grade')!.value,
        };
        this.inwardService
          .updateInward(this.selectedInward)
          .pipe(
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.getExcipients();
            this.closeButton.nativeElement.click();
            this.toastr.success(
              'Inward has been updated succesfully',
              'Success'
            );
          });
      }
    } else {
      this.inwardForm.get('excipientsName')?.markAsDirty();
      this.inwardForm.get('materialName')?.markAsDirty();
      this.inwardForm.get('materialType')?.markAsDirty();
      this.inwardForm.get('batchNumber')?.markAsDirty();
      this.inwardForm.get('sourceName')?.markAsDirty();
      this.inwardForm.get('potency')?.markAsDirty();
      this.inwardForm.get('grade')?.markAsDirty();
    }
  }

  selectInward(inward) {
    this.selectedInward = inward;

    this.inwardForm.patchValue({
      excipientsName: inward.excipientsName,
      materialName: inward.materialName,
      materialType: inward.materialType,
      batchNumber: inward.batchNo,
      sourceName: inward.sourceName,
      potency: inward.potency,
      grade: inward.grade,
    });
    this.showErrorMsg = false;
  }

  confirmInwardDeletetion(inward) {
    this.selectedInward = inward;
  }

  deleteInward() {
    this.inwardService
      .deleteExcipient(this.selectedInward.excipientId)
      .pipe(
        takeWhile(() => this.subscribeFlag),
        finalize(() => {
          this.globalService.hideLoader();
        })
      )
      .subscribe(() => {
        this.getExcipients();
        this.closeDeleteButton.nativeElement.click();
        this.toastr.success('Inward has been deleted succesfully', 'Success');
      });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
