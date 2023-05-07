import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentSnapshot} from '@angular/fire/compat/firestore';
import {filter, map, Observable} from 'rxjs';
import { Product } from './product';
import { Cartitem } from './cartitem';
import {AngularFireObject} from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private db: AngularFirestore, private firestore: AngularFirestore) {}

  getProducts(): Observable<Product[]> {
    return this.db.collection<Product>('products').valueChanges({ idField: 'id' });
  }


  getProductById(id: string): Observable<Product | null> {
    return this.db
      .collection<Product>('products')
      .doc(id)
      .get()
      .pipe(
        map((doc) => {
          const data = doc.data();
          if (doc.exists && data) {
            return { ...data, id: doc.id };
          } else {
            return null;
          }
        })
      );
  }

  createProduct(product: Product): Promise<void> {
    const id = this.db.createId();
    const newProduct: Product = {
      name: product.name || '',
      manufacturer: product.manufacturer || '',
      description: product.description || '',
      price: product.price || 0,
      stock: product.stock || 0,
      id: id
    };
    return this.db.collection('products').doc(id).set(newProduct);
  }

  updateProduct(product: Product): Promise<void> {
    return this.db.collection('products').doc(product.id).update(product);
  }

  deleteProduct(id: string | undefined): Promise<void> {
    return this.db.collection('products').doc(id).delete();
  }

  getCartItems(): Observable<Cartitem[]> {
    return this.db.collection<Cartitem>('cartItems').valueChanges({ idField: 'id' });
  }

  addToCart(product: Product, uid: string): Promise<any> {
    const cartItem: Cartitem = {
      name: product.name,
      manufacturer: product.manufacturer,
      description: product.description,
      price: product.price,
      quantity: 1,
      uid: uid
    };
    return this.db.collection<Cartitem>('cartItems').doc(product.id).set(cartItem);
  }

  removeFromCart(product: Product): Promise<void> {
    return this.db.collection('cartItems').doc(product.id).delete();
  }

  getCartItemsByUser(uid: string | undefined): Observable<Cartitem[]> {
    return this.db.collection<Cartitem>('cartItems', ref => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'id' });
  }
}
