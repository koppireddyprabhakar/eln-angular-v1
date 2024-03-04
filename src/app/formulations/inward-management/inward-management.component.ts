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
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject, finalize, takeWhile } from 'rxjs';
import { departmentMapping } from '@app/shared/constants/mappings';

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
    quantity: [0, [Validators.required]],
    expiryDate: ['', [Validators.required]]
  });

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
    private toastr: ToastrService
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
  }

  getExcipients() {
    this.globalService.showLoader();
    this.inwardService
      .getInwardsByCreationSource(departmentMapping[1])
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
    const newInward = {
      excipientsName: this.inwardForm.get('excipientsName')!.value,
      materialName: this.inwardForm.get('materialName')!.value,
      materialType: this.inwardForm.get('materialType')!.value,
      batchNo: this.inwardForm.get('batchNumber')!.value,
      sourceName: this.inwardForm.get('sourceName')!.value,
      potency: this.inwardForm.get('potency')!.value,
      grade: this.inwardForm.get('grade')!.value,
      quantity: this.inwardForm.get('quantity')!.value,
      expiryDate: this.inwardForm.get('expiryDate')!.value,
      creationSource: departmentMapping[1]
      // status: 'New',
    };

    let isValid = this.inwardForm.get('quantity') && this.inwardForm.value.quantity != null
      && this.inwardForm.value.quantity <= 0;

    if (this.inwardForm.valid && !isValid) {
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
          changedQuantity: this.inwardForm.get('quantity')!.value,
          expiryDate: this.inwardForm.get('expiryDate')!.value
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
      this.inwardForm.get('quantity')?.markAsDirty();
      this.inwardForm.get('expiryDate')?.markAsDirty();
      this.inwardForm.get('quantity')?.setValue(null);
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
      quantity: inward.quantity === 0 ? null : inward.quantity,
      expiryDate: inward.expiryDate
    });
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
