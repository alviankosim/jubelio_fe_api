import { useState } from 'react';
import axios from 'axios';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import { ModalDetailProduct } from './ModalDetailProduct';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export const Product = (props) => {

    const [showModal, setShowModal] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [productData, setProductData] = useState({});

    const number_format = (number, decimals, dec_point, thousands_sep) => {
        // Strip all characters but numerical ones.
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    const fetchProductData = async () => {
        let productID = props.product.id;
        const productsResponse = await axios.get(
            `http://localhost:8081/products/${productID}`
        );

        setProductData(productsResponse.data.data);

        setIsLoadingModal(false);
    }

    const handleDeleteImage = (imageID) => {
        let tempProduct = { ...productData };

        // filtering id
        setProductData({ ...tempProduct, images: tempProduct.images.filter(obj => (obj.id != imageID)) });
    }

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = async () => {
        setShowModal(true);
        setIsLoadingModal(true);

        fetchProductData();
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
                props.deleteProduct(props.product?.id);
            }
        })
    }

    return (
        <>
            <div className="col">
                <div className="card shadow-sm">
                    <img width="100%" height="225" style={{ objectFit: 'contain' }} src={props.product.images[0]} />

                    <div className="card-body">
                        <p className="card-text">{props.product.name}</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                                <button type="button" onClick={handleDeleteProduct} className="btn btn-sm btn-outline-secondary"><BsFillTrashFill />  Remove</button>
                                <button type="button" onClick={handleShowModal} className="btn btn-sm btn-outline-secondary"><BsFillPencilFill /> Edit</button>
                            </div>
                            <small className="">Rp {number_format(props.product.price, 0, ',', '.')}</small>
                        </div>
                    </div>
                </div>
            </div>
            <ModalDetailProduct show={showModal} onClose={handleCloseModal} product={productData} isLoading={isLoadingModal} deleteImagee={(imageID) => handleDeleteImage(imageID)} />
        </>
    )
}