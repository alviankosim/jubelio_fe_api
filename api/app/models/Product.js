const db = require('../../lib/database');

//Product constructor
class Product {
    constructor({
        name, sku, price, description, product_no, images
    }) {
        this.name = name;
        this.sku = sku;
        this.price = price;
        this.description = description;
        this.product_no = product_no;
        this.images = images;
    }

    static isValidProduct = (singleProduct, options) => {
        let result = true;
    
        if (options?.product_no) {
            if (!singleProduct?.product_no) {
                result = false;
            }
        }
        if (!singleProduct?.name) {
            result = false;
        }
        if (!singleProduct?.sku) {
            result = false;
        }
        if (!singleProduct?.price) {
            result = false;
        }
        if (options?.images) {
            if (!Array.isArray(singleProduct?.images) || singleProduct?.images.length < 1 ) {
                result = false;
            }
        }
    
        return result;
    }

    // 10 per pages
    static async getAllProduct(pageNumber, nextPage = false){
        try {
            let pag = (pageNumber * 10 + 10);
            let params = [pag];
            if (nextPage) {
                params = [10, (pageNumber * 10)];
            }

            const { rows } = await db.query(
                `
                SELECT 
                    prod.*,
					array_agg(json_build_object('id', img.id, 'image', img.image)) as images
                FROM public.products prod
                LEFT JOIN public.products_images img ON (img.product_id = prod.id)
				GROUP BY prod.id
                ORDER BY prod.date_modified DESC
                LIMIT $1 ${(nextPage ? `OFFSET $2` : ``)}
                `, [...params]
            );

            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getProductByID(productID){
        try {
            const { rows } = await db.query(
                `
                SELECT 
                    prod.*,
					array_agg(json_build_object('id', img.id, 'image', img.image)) as images
                FROM public.products prod
                LEFT JOIN public.products_images img ON (img.product_id = prod.id)
                WHERE prod.id = $1
                GROUP BY prod.id
                ORDER BY prod.id ASC
                `, [productID]
            );

            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async updateProduct(singleProduct, productID){
        try {
            
            const { rows } = await db.query(
                `UPDATE products SET name = $1, sku = $2, price = $3, description = $4 WHERE products.id = $5`,
                [singleProduct.name, singleProduct.sku, singleProduct.price, singleProduct.description, productID]
            );

            // inserting image to db
            if (Array.isArray(singleProduct?.images) && singleProduct.images.length > 0) {
                const result = await db.query(
                    `INSERT INTO products_images(product_id, image) VALUES
                    ${singleProduct.images
                            .map((_, i) => (`($${i*2+1}, $${i*2+2})`))
                            .join(',')}`,
                    [...[].concat(...singleProduct.images.map(singleImage => ([productID, singleImage])))]
                );
            }
            
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async deleteProductByID(productID){
        try {

            const { rows } = await db.query(
                `DELETE FROM products WHERE id = $1`,
                [productID]
            );

            // fetching images list
            const { rows : rowsImage } = await db.query(
                `SELECT array_agg(image) as images FROM products_images WHERE product_id = $1`,
                [productID]
            );

            // delete image from database
            const result = await db.query(
                `DELETE FROM products_images WHERE product_id = $1`,
                [productID]
            );
            
            return rowsImage;
        } catch (error) {
            throw error;
        }
    }

    static async deleteProductImageByID(productImageID){
        try {

            // const { rows } = await db.query(
            //     `DELETE FROM products_images WHERE id = $1`,
            //     [productImageID]
            // );

            // fetching images list
            const { rows : rowsImage } = await db.query(
                `SELECT array_agg(image) as images FROM products_images WHERE id = $1`,
                [productImageID]
            );

            // delete image from database
            const result = await db.query(
                `DELETE FROM products_images WHERE id = $1`,
                [productImageID]
            );
            
            return rowsImage;
        } catch (error) {
            throw error;
        }
    }

    // add createProduct method to the prototype
    async createProduct() {
        try {
            
            console.log('masuk createproduct')
            const inserting = await db.query(
                `INSERT INTO products(name, sku, price,description, product_no) 
              VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [this.name, this.sku, this.price, this.description, this.product_no]
            );

            // inserting image to db
            const result = await db.query(
                `INSERT INTO products_images(product_id, image) VALUES
                ${this.images
                        .map((singleImage, i) => (`(${inserting.rows?.[0]?.id}, $${i+1})`))
                        .join(',')}`,
                [...this.images]
            );
            
            return inserting.rows;
        } catch (error) {
            console.log({error});
            throw error;
        }
    }
};

module.exports = Product;