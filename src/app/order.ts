import {Cartitem} from "./cartitem";

export interface Order {
  id?: string;
  userId: string;
  items: Cartitem[];
  totalPrice: number;
  timestamp: any;
}
