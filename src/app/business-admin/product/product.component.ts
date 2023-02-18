import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GlobalService } from '@app/shared/services/global/global.service';
import { ProductService } from '@app/shared/services/product/product.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeWhile } from 'rxjs';
import { Products } from './product.interface';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  products: Products[] = [];
  selectedProduct: Products = {} as Products;
  subscribeFlag = true;
  productForm = this.formBuilder.group({
    productName: ['', [Validators.required]],
    productCode: [''],
  });
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;

  constructor(
    private readonly productService: ProductService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  addProduct() {
    this.selectedProduct = {} as Products;
    this.productForm.reset();
  }

  getProducts() {
    this.globalService.showLoader();
    this.productService
      .getProducts()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((products) => {
        const newProductsList = products.map((product: any) => ({
          ...product,
        }));
        this.products = newProductsList;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.products);
        });
        this.globalService.hideLoader();
      });
  }

  saveProduct() {
    const newProduct = {
      productName: this.productForm.get('productName')!.value,
      productCode: this.productForm.get('productCode')!.value,
    };
    if (this.productForm.get('productName')!.value) {
      this.globalService.showLoader();
      if (Object.keys(this.selectedProduct).length === 0) {
        this.productService
          .saveProduct(newProduct)
          .pipe(
            takeWhile(() => this.subscribeFlag),
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.getProducts();
            this.closeButton.nativeElement.click();
            this.toastr.success(
              'Product has been added succesfully',
              'Success'
            );
          });
      } else {
        this.selectedProduct = {
          ...this.selectedProduct,
          ...newProduct,
        };
        this.productService
          .updateProduct(this.selectedProduct)
          .pipe(
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.getProducts();
            this.closeButton.nativeElement.click();
            this.toastr.success(
              'Product has been updated succesfully',
              'Success'
            );
          });
      }
    } else {
      this.productForm.get('productName')?.markAsDirty();
    }
  }

  selectProduct(product: Products) {
    this.selectedProduct = product;
    this.productForm.patchValue({ productName: product.productName });
    this.productForm.patchValue({ productCode: product.productCode });
  }

  confirmProductDeletetion(product: Products) {
    this.selectedProduct = product;
  }

  deleteProduct() {
    this.selectedProduct = {
      ...this.selectedProduct,
      status: 'Inactive'
    };
    this.productService
      .deleteProduct(this.selectedProduct)
      .pipe(
        takeWhile(() => this.subscribeFlag),
        finalize(() => {
          this.globalService.hideLoader();
        })
      )
      .subscribe(() => {
        this.getProducts();
        this.closeDeleteButton.nativeElement.click();
        this.toastr.success('Product has been deleted succesfully', 'Success');
      });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
