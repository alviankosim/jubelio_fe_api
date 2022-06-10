import { makeObservable, observable, computed, action } from 'mobx';
import axios from 'axios';
import _ from 'lodash';

export class ProductsStore {
    loadIndex = 0;
    hasMore = true;
    products = [];

    constructor() {
        makeObservable(this, {
            products     : observable,
            hasMore      : observable,
            loadIndex    : observable,
            fetchProducts: action,
            addProduct: action,
            editProduct: action,
            deleteProduct: action,
            deleteProductImage: action,
            getProducts  : computed,
            getLoadIndex : computed,
            getHasMore   : computed
        });
    }

    async fetchProducts() {
        const productsResponse = await axios.get(
            `http://localhost:8081/products?page=${this.loadIndex}`
        );

        this.loadIndex = this.loadIndex + 1;
        this.hasMore = productsResponse?.data?.hasMore ?? false;
        this.products = productsResponse?.data?.data ?? [];
    }

    async editProduct(productID, formData) {
        const submitting = await axios.put(`http://localhost:8081/products/${productID}`, formData)
        const editedProduct = submitting.data.data;
        this.products = [...(this.products.map(singleProd => (singleProd.id == productID ? editedProduct : singleProd)))];

        return submitting;
    }

    async addProduct(formData) {
        const submitting = await axios.post(`http://localhost:8081/products`, formData)
        const insertedProduct = submitting.data.data;
        this.products = [...this.products, insertedProduct];

        return submitting;
    }
    
    async deleteProduct(productID) {
        const productsResponse = await axios.delete(
            `http://localhost:8081/products/${productID}`
        );

        this.products = [...(this.products.filter(singleProd => (singleProd.id != productID)))];
    }

    async deleteProductImage(imageID){
        try {
            const deletting = await axios.delete(`http://localhost:8081/products/images/${imageID}`)

            this.products = [...(_.filter(this.products, {images: [{id: imageID}]}))];
        } catch (error) {

        }
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