import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  products: Product[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  addProduct() {
    this.router.navigate(['/admin/products/new']);
  }

  editProduct(product: Product) {
    this.router.navigate(['/admin/products', product.id]);
  }

  deleteProduct(product: Product) {
    this.productService.deleteProduct(product.id)
      .then(() => {
        this.snackBar.open('Termék törölve.', '', {
          duration: 3000
        });
      })
      .catch((error) => {
        console.log(error);
        this.snackBar.open(error.message, '', {
          duration: 3000
        });
      });
  }
}
