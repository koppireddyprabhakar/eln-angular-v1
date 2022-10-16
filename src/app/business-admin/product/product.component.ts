import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '@app/services/product/product.service';
import { finalize } from 'rxjs';
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
    productName: [''],
    productCode: [''],
  });

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;

  constructor(
    private readonly productService: ProductService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  addProduct() {
    this.selectedProduct = {} as Products;
    this.productForm.reset();
  }

  getProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = [...products];
    });
  }

  saveProduct() {
    console.log(this.productForm.get('productName')!.value);
    const newProduct: { productName: string | null } = {
      productName: this.productForm.get('productName')!.value,
    };
    if (Object.keys(this.selectedProduct).length === 0) {
      this.productService
        .saveProduct(newProduct)
        .pipe(
          finalize(() => {
            this.closeButton.nativeElement.click();
            this.getProducts();
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
            this.closeButton.nativeElement.click();
            this.getProducts();
          })
        )
        .subscribe(() => {});
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
          this.closeDeleteButton.nativeElement.click();
          this.getProducts();
        })
      )
      .subscribe(() => {});
  }
}
