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

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Products[] = [];
  selectedProduct: Products = {} as Products;
  subscribeFlag = true;
  productForm = this.formBuilder.group({
    productName: ['', [Validators.required]],
    productCode: [''],
  });
  columns: any;
  options: any = {};

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor(
    private readonly productService: ProductService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.columns = [
      { key: 'productName', title: 'Product Name' },
      { key: 'productCode', title: 'Product Code' },
      { key: 'status', title: 'Status' },
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
          status: 'Active',
        }));
        this.products = newProductsList;
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
  }

  confirmProductDeletetion(product: Products) {
    this.selectedProduct = product;
  }

  deleteProduct() {
    this.selectedProduct = {
      ...this.selectedProduct,
      status: 'string',
      productCode: 'Inactive',
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
