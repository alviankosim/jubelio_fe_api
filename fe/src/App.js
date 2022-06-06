import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AppRoutes } from './Components/AppRoutes';
import { Footer } from './Components/Layout/Footer';
import { Header } from './Components/Layout/Header';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <AppRoutes />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
