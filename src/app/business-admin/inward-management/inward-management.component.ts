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
import { ToastrService } from 'ngx-toastr';
import { finalize, takeWhile } from 'rxjs';

@Component({
  selector: 'app-inward-management',
  templateUrl: './inward-management.component.html',
  styleUrls: ['./inward-management.component.scss'],
})
export class InwardManagementComponent implements OnInit {
  inwards: any = [];
  selectedInward: any = {};
  subscribeFlag = true;
  inwardForm = this.formBuilder.group({
    excipientsName: ['', [Validators.required]],
    materialName: [''],
    materialType: [''],
    batchNumber: [''],
    sourceName: [''],
    potency: [''],
    grade: [''],
  });
  columns: any;
  options: any = {};

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor(
    private readonly inwardService: InwardManagementService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService
  ) {}

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
      {
        key: 'options',
        title: '<div class="blue">Options</div>',
        align: { head: 'center', body: 'center' },
        sorting: false,
        width: 80,
        cellTemplate: this.actionTpl,
      },
    ];
  }

  addInward() {
    this.selectedInward = {};
    this.inwardForm.reset();
  }

  getExcipients() {
    this.globalService.showLoader();
    this.inwardService
      .getInwards()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((inwards) => {
        const newInwardsList = inwards.map((inward: any) => ({
          ...inward,
          status: inward.status.toLowerCase() === 'act' ? 'Active' : 'InActive', // change later
        }));
        this.inwards = newInwardsList;
        this.globalService.hideLoader();
      });
  }

  saveInward() {
    this.globalService.showLoader();
    const newInward = {
      excipientsName: this.inwardForm.get('excipientsName')!.value,
      materialName: this.inwardForm.get('materialName')!.value,
      materialType: this.inwardForm.get('materialType')!.value,
      batchNo: this.inwardForm.get('batchNumber')!.value,
      sourceName: this.inwardForm.get('sourceName')!.value,
      potency: this.inwardForm.get('potency')!.value,
      grade: this.inwardForm.get('grade')!.value,
      status: 'New',
    };
    if (this.inwardForm.valid) {
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
