import { Product } from './Product';
import { map } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from '../Layout/Spinner';
import { Button } from 'react-bootstrap';
import { ModalAddProduct } from './ModalAddProduct';

export const Products = observer(({store}) => {

    const [showModal, setShowModal] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);

    const fetchMoreData = () => {
        setTimeout(() => {
            store.fetchProducts();
        }, 2500);
    }

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = async () => {
        setShowModal(true);
    };

    useEffect(() => {
        store.fetchProducts();
    }, []);

    return (
        <>
        <div className="album py-5 bg-light">
            <Button style={{marginBottom:10}} onClick={handleShowModal}>Add New Product</Button>
            <div className="container">
                <InfiniteScroll
                    dataLength={store.getProducts.length}
                    next={fetchMoreData}
                    hasMore={store.hasMore}
                    loader={<LoadingSpinner />}
                    endMessage={
                        <p style={{ textAlign: "center", marginTop: 20 }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {map(store.getProducts, (p, index) => (
                            <Product store={store} product={p} key={index}/>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
        <ModalAddProduct show={showModal} onClose={handleCloseModal} product={{}} isLoading={isLoadingModal} store={store}/>
        </>
    )
});