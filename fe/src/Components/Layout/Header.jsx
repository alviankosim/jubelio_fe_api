import { BsFillCartCheckFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export const Header = () => {
    return (
        <header className="p-3 bg-dark text-white">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <BsFillCartCheckFill />
                    </a>

                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <Link to="/" className='nav-link px-2 text-secondary'>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/products" className='nav-link px-2 text-white'>
                                Products
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}