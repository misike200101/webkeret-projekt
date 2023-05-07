import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product = {} as Product;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe(product => {
        if (product) { // type guard feltétel hozzáadva
          this.product = product;
        }
      }, error => {
        console.log(error);
      });
    }
  }

  addToCart(product: Product) {
    this.authService.getUid().then((uid) => {
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
    });
  }
}
