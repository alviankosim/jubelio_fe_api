import { Routes, Route, Navigate } from 'react-router-dom';
import { AllProduct } from './Product/AllProduct';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate replace to="/products" />} />
            <Route path="/products" element={<AllProduct />} />
        </Routes>
    )
}