import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Cartitem } from '../cartitem';
import { Product } from "../product";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Cartitem[] = [];
  uid: string | undefined = '';

  constructor(private productService: ProductService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.productService.getCartItemsByUser(this.uid).subscribe((cartItems: Cartitem[]) => {
          this.cartItems = cartItems;
        });
      }
    });
  }

  removeFromCart(cartItem: Cartitem) {
    const product: Product = {
      stock: 0,
      id: cartItem.id,
      name: cartItem.name,
      price: cartItem.price,
      description: '',
      manufacturer: ''
    };
    this.productService.removeFromCart(product).catch(error => {
      console.log(error);
    });
  }

  getTotal(): number {
    let total = 0;
    this.cartItems.forEach(item => {
      total += item.price * item.quantity;
    });
    return total;
  }
}
