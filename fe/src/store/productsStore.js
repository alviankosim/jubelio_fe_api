import { makeObservable, observable, computed, action } from 'mobx';
import axios from 'axios';
import _ from 'lodash';

export class ProductsStore {
    loadIndex = 0;
    hasMore = true;
    products = [];
    rootStore;

    constructor(rootStore) {
        makeObservable(this, {
            products     : observable,
            hasMore     : observable,
            loadIndex    : observable,
            fetchProducts: action,
            deleteProduct: action,
            getProducts  : computed,
            getLoadIndex : computed,
            getHasMore  : computed
        });
        this.rootStore = rootStore;
    }

    async fetchProducts() {
        const productsResponse = await axios.get(
            `http://localhost:8081/products?page=${this.loadIndex}`
        );

        this.loadIndex = this.loadIndex + 1;
        this.hasMore = productsResponse?.data?.hasMore ?? false;
        this.products = productsResponse?.data?.data ?? [];
    }

    async deleteProduct(productID) {
        const productsResponse = await axios.delete(
            `http://localhost:8081/products/${productID}`
        );

        this.products = [...(this.products.filter(singleProd => (singleProd.id != productID)))];
    }

    get getProducts() {
        return this.products;
    }

    get getLoadIndex() {
        return this.loadIndex;
    }

    get getHasMore() {
        return this.hasMore;
    }
}