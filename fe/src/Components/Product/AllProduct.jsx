import { ProductsStore } from "../../store/productsStore"
import { TopSection } from "../Layout/TopSection"
import { Products } from "./Products"

export const AllProduct = () => {
    
    const observableProductsStore = new ProductsStore();

    return (
        <>
            <TopSection />
            <Products store={observableProductsStore} />        
        </>
    )
}