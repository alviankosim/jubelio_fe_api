import { ProductsStore } from "./productsStore";

export class RootStore {
  productsStore;

  constructor() {
    this.productsStore = new ProductsStore(this);
  }
}