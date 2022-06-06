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

export const ModalAddProduct = ({ show, onClose, isLoading, product }) => {

    const [files, setFiles] = useState([]);

    const [content, setContent] = useState('');
    const onChangeContent = (val) => {
        setContent(val);
    }

    const [name, setName] = useState('');
    const onChangeName = (event) => {
        setName(event.target.value);
    }

    const [sku, setSKU] = useState('');
    const onChangeSKU = (event) => {
        setSKU(event.target.value);
    }

    const [price, setPrice] = useState('');
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
                formData.append('images', singleFile.file, singleFile.file.name)
            })

            const submitting = await axios.post(`http://localhost:8081/products`, formData)

            MySwal.close();

            if (submitting?.data?.status) {
                MySwal.fire(
                    'Good job!',
                    'Successfully add new product',
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

    const renderContent = (
        <Form>

            <Form.Group className="mb-3" controlId="productImages">
                <Form.Label>Add Product Images</Form.Label>
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
                <Modal.Title>Add new product</Modal.Title>
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