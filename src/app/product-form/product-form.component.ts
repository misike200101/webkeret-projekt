import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    name: '',
    manufacturer: '',
    description: '',
    price: 0,
    stock: 0
  };
  isNew: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.productService.getProductById(id).subscribe((product) => {
        if (product) {
          this.product = product;
        }
      });
    } else {
      this.isNew = true;
    }
  }

  save() {
    if (this.isNew) {
      this.productService.createProduct(this.product)
        .then(() => {
          this.snackBar.open('Termék hozzáadva.', '', {
            duration: 3000
          });
          this.router.navigate(['/admin']);
        })
        .catch((error) => {
          console.log(error);
          this.snackBar.open(error.message, '', {
            duration: 3000
          });
        });
    } else {
      this.productService.updateProduct(this.product)
        .then(() => {
          this.snackBar.open('Termék módosítva.', '', {
            duration: 3000
          });
          this.router.navigate(['/admin']);
        })
        .catch((error) => {
          console.log(error);
          this.snackBar.open(error.message, '', {
            duration: 3000
          });
        });
    }
  }
}
