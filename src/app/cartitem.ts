import {Product} from "./product";

export interface Cartitem {
  id?: string;
  uid?: string
  name: string;
  manufacturer: string;
  description: string;
  price: number;
  quantity: number;
}
