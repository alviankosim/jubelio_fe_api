import { useState } from 'react';
import axios from 'axios';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import { ModalDetailProduct } from './ModalDetailProduct';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { number_format } from '../../helpers/general';

const MySwal = withReactContent(Swal);

export const Product = ({ product, store }) => {

    const [showModal, setShowModal] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = async () => {
        setShowModal(true);
        setIsLoadingModal(true);

        // showing loading spinner
        setTimeout(() => {
            setIsLoadingModal(false);
        }, 1500);
    };

    const handleDeleteProduct = () => {
        MySwal.fire({
            title: 'Do you want to delete this product?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                store.deleteProduct(product?.id);
            }
        })
    }

    return (
        <>
            <div className="col">
                <div className="card shadow-sm" style={{borderRadius:10}}>
                    <img width="100%" height="225" style={{ objectFit: 'contain' }} src={product.images[0]?.image} />

                    <div className="card-body">
                        <p className="card-text">{product.name}</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                                <button type="button" onClick={handleDeleteProduct} className="btn btn-sm btn-outline-secondary"><BsFillTrashFill />  Remove</button>
                                <button type="button" onClick={handleShowModal} className="btn btn-sm btn-outline-secondary"><BsFillPencilFill /> Edit</button>
                            </div>
                            <small className="">Rp {number_format(product.price, 0, ',', '.')}</small>
                        </div>
                    </div>
                </div>
            </div>
            <ModalDetailProduct show={showModal} onClose={handleCloseModal} product={product} store={store} isLoading={isLoadingModal}/>
        </>
    )
}