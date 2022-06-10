import { useEffect } from 'react';
import { Button, Modal, Form, Row } from 'react-bootstrap';
import LoadingSpinner from '../Layout/Spinner';
import TextEditor from './TextEditor';
import React, { useState } from 'react';

import { stateFromHTML } from 'draft-js-import-html';
import axios from 'axios';
import ImageUploadPreviewComponent from './ImageUploadPreview';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const ModalDetailProduct = ({ show, onClose, isLoading, product, store }) => {

    const [files, setFiles] = useState([]);

    const [content, setContent] = useState(product?.description ?? '');
    const onChangeContent = (val) => {
        setContent(val);
    }

    const [name, setName] = useState(product?.name ?? '');
    const onChangeName = (event) => {
        setName(event.target.value);
    }

    const [sku, setSKU] = useState(product?.sku ?? '');
    const onChangeSKU = (event) => {
        setSKU(event.target.value);
    }

    const [price, setPrice] = useState(product?.price ?? '');
    const onChangePrice = (event) => {
        setPrice(event.target.value);
    }

    const submitFormAction = async () => {
        MySwal.fire({
            title: 'Please Wait !',
            html: 'data uploading',// add html attribute if you want or remove
            allowOutsideClick: false,
            didOpen: () => {
                MySwal.showLoading()
            },
        });

        try {
            console.log('masukkkkk')
            let form = {
                name: name,
                sku: sku,
                price: price,
                description: content
            }
            const formData = new FormData()
            Object.keys(form).forEach((key) => {
                formData.append(key, form[key])
            })

            // images
            files.forEach((singleFile, i) => {
                // console.log({singleFile})
                formData.append('images', singleFile.file, singleFile.file.name)
            })

            const submitting = await store.editProduct(product?.id, formData);

            MySwal.close();

            if (submitting?.data?.status) {
                MySwal.fire(
                    'Good job!',
                    'Successfully edit product',
                    'success'
                )
            }
        } catch (error) {
            MySwal.close();
        }
    }

    const submitForm = (e) => {
        e.preventDefault();
        submitFormAction();
    }

    const deleteImage = (imageID) => {

        Swal.fire({
            title: 'Do you want to delete this image?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                store.deleteProductImage(imageID);
            }
        })

    }

    useEffect(() => {
        setName(product?.name ?? '');
        setSKU(product?.sku ?? '');
        setPrice(product?.price ?? '');
        setContent(product?.description ?? '');
        setFiles([]);
    }, [product])

    const renderContent = (
        <Form>

            <Form.Group className="mb-3" controlId="productImages">
                <Form.Label>Current Product Images</Form.Label>
                <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
                    {
                        product?.images
                            ? product.images.map((singleImage, i) => {
                                return (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                                        <img height="100" style={{ objectFit: 'contain', marginBottom: '10px' }} src={singleImage?.image} />
                                        <Button size='sm' onClick={() => { deleteImage(singleImage?.id) }} variant="danger">
                                            Delete
                                        </Button>
                                    </div>
                                )
                            })
                            : null
                    }
                </div>
                <ImageUploadPreviewComponent files={files} setFiles={(val) => setFiles(val)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control type="text" placeholder="Enter product name" value={name} onChange={onChangeName} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productSKU">
                <Form.Label>Product SKU</Form.Label>
                <Form.Control type="text" placeholder="Enter product SKU " value={sku} onChange={onChangeSKU} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productPrice">
                <Form.Label>Product Price</Form.Label>
                <Form.Control type="text" placeholder="Enter product price " value={price} onChange={onChangePrice} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productDescription">
                <Form.Label>Product Description</Form.Label>
                <TextEditor content={content} onChange={(val) => onChangeContent(val)} />
            </Form.Group>

            <Button onClick={submitForm} variant="primary">
                Save
            </Button>
        </Form>
    );

    return (
        <Modal size="lg" show={show} onHide={onClose} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>Edit product {`${product?.name ?? ''}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    isLoading ? <LoadingSpinner /> : renderContent
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                {/* <Button variant="primary" onClick={onClose}>
                    Save Changes
                </Button> */}
            </Modal.Footer>
        </Modal>
    )
}