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
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-inward-management',
  templateUrl: './inward-management.component.html',
  styleUrls: ['./inward-management.component.scss'],
})
export class InwardManagementComponent implements OnInit {
  inwards: any = [];
  selectedInward: any = {};
  subscribeFlag = true;
  productForm = this.formBuilder.group({
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
    this.getProducts();
    this.columns = [
      { key: 'inwardName', title: 'Inward Name' },
      { key: 'materialName', title: 'Material Name' },
      { key: 'materialType', title: 'Material Type' },
      { key: 'batchNumber', title: 'Batch Number' },
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
    this.productForm.reset();
  }

  getProducts() {
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

  // saveProduct() {
  //   this.globalService.showLoader();
  //   const newProduct: { productName: string | null } = {
  //     productName: this.productForm.get('productName')!.value,
  //   };
  //   if (this.productForm.get('productName')!.value) {
  //     if (Object.keys(this.selectedInward).length === 0) {
  //       this.inwardService
  //         .saveProduct(newProduct)
  //         .pipe(
  //           takeWhile(() => this.subscribeFlag),
  //           finalize(() => {
  //             this.globalService.hideLoader();
  //           })
  //         )
  //         .subscribe(() => {
  //           this.getProducts();
  //           this.closeButton.nativeElement.click();
  //           this.toastr.success(
  //             'Product has been added succesfully',
  //             'Success'
  //           );
  //         });
  //     } else {
  //       this.selectedInward = {
  //         ...this.selectedInward,
  //         productName: this.productForm.get('productName')!.value,
  //       };
  //       this.inwardService
  //         .updateProduct(this.selectedInward)
  //         .pipe(
  //           finalize(() => {
  //             this.globalService.hideLoader();
  //           })
  //         )
  //         .subscribe(() => {
  //           this.getProducts();
  //           this.closeButton.nativeElement.click();
  //           this.toastr.success(
  //             'Product has been updated succesfully',
  //             'Success'
  //           );
  //         });
  //     }
  //   } else {
  //     this.productForm.get('productName')?.markAsDirty();
  //   }
  // }

  // selectProduct(product: Products) {
  //   this.selectedInward = product;
  //   this.productForm.patchValue({ productName: product.productName });
  // }

  // confirmProductDeletetion(product: Products) {
  //   this.selectedInward = product;
  // }

  // deleteProduct() {
  //   this.inwardService
  //     .deleteProduct(this.selectedInward.productId)
  //     .pipe(
  //       takeWhile(() => this.subscribeFlag),
  //       finalize(() => {
  //         this.globalService.hideLoader();
  //       })
  //     )
  //     .subscribe(() => {
  //       this.getProducts();
  //       this.closeDeleteButton.nativeElement.click();
  //       this.toastr.success('Product has been deleted succesfully', 'Success');
  //     });
  // }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
