import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
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
import { finalize, Subject } from 'rxjs';
import { Products } from './product.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Products[] = [];
  selectedProduct: Products = {} as Products;
  productForm = this.formBuilder.group({
    productName: ['', [Validators.required]],
    productCode: [''],
  });
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  loader = false;

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

  addProduct() {
    this.selectedProduct = {} as Products;
    this.productForm.reset();
  }

  getProducts() {
    this.globalService.showLoader();
    this.dtTrigger.next([]);
    this.loader = true;
    this.productService.getProducts().subscribe((products) => {
      this.products = [...products];
      this.dtTrigger.next(this.products);
      this.loader = false;
      this.globalService.hideLoader();
    });
  }

  saveProduct() {
    this.globalService.showLoader();
    console.log(this.productForm.get('productName')!.value);
    const newProduct: { productName: string | null } = {
      productName: this.productForm.get('productName')!.value,
    };
    if (this.productForm.get('productName')!.value) {
      if (Object.keys(this.selectedProduct).length === 0) {
        this.productService
          .saveProduct(newProduct)
          .pipe(
            finalize(() => {
              this.toastr.success(
                'Product has been added succesfully',
                'Success'
              );
              this.dtTrigger.unsubscribe();
              this.closeButton.nativeElement.click();
              this.getProducts();
              this.loader = false;
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {});
      } else {
        this.selectedProduct = {
          ...this.selectedProduct,
          productName: this.productForm.get('productName')!.value,
        };
        this.productService
          .updateProduct(this.selectedProduct)
          .pipe(
            finalize(() => {
              this.toastr.success(
                'Product has been updated succesfully',
                'Success'
              );
              this.closeButton.nativeElement.click();
              this.dtTrigger.unsubscribe();

              console.log('four');
              this.getProducts();
              this.loader = false;
            })
          )
          .subscribe(() => {});
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
    this.productService
      .deleteProduct(this.selectedProduct.productId)
      .pipe(
        finalize(() => {
          this.toastr.success(
            'Product has been deleted succesfully',
            'Success'
          );
          this.dtTrigger.unsubscribe();
          this.closeDeleteButton.nativeElement.click();
          this.getProducts();
          this.loader = false;
        })
      )
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
