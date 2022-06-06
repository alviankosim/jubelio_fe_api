import { ProductsStore } from "./productsStore";

export class RootStore {
  loginStore;
  productsStore;

  constructor() {
    this.productsStore = new ProductsStore(this);
  }
}