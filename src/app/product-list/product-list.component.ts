import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  async addToCart(product: Product) {
    const uid = await this.authService.getUid();
    this.productService.addToCart(product, uid)
      .then(() => {
        this.snackBar.open('Termék hozzáadva a kosárhoz.', '', {
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
