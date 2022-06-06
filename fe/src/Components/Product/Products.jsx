import { Product } from './Product';
import { map } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStore } from '../../Hooks/useStore';
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from '../Layout/Spinner';
import { Button } from 'react-bootstrap';
import { ModalAddProduct } from './ModalAddProduct';

export const Products = observer(() => {

    const [showModal, setShowModal] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const {
        rootStore: { productsStore },
    } = useStore();

    const fetchMoreData = () => {
        setTimeout(() => {
            productsStore.fetchProducts();
        }, 2500);
    }

    const handleDeleteProduct = (id) => {
        productsStore.deleteProduct(id);
    }

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = async () => {
        setShowModal(true);
    };

    useEffect(() => {
        productsStore.fetchProducts();
    }, []);

    return (
        <>
        <div className="album py-5 bg-light">
            <Button onClick={handleShowModal}>Add New Product</Button>
            <div className="container">
                <InfiniteScroll
                    dataLength={productsStore.getProducts.length}
                    next={fetchMoreData}
                    hasMore={productsStore.hasMore}
                    loader={<LoadingSpinner />}
                    endMessage={
                        <p style={{ textAlign: "center", marginTop: 20 }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {map(productsStore.getProducts, (p, index) => (
                            <Product product={p} key={index} deleteProduct={(id) => handleDeleteProduct(id)}/>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
        <ModalAddProduct show={showModal} onClose={handleCloseModal} product={{}} isLoading={isLoadingModal}/>
        </>
    )
});