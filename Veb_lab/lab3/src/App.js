import { useApp } from "./AppContext";
import './main.css';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import Header from './components/Header';
import Banner from './components/Banner';
import Equipment from './components/Equipment';
import Schedule from './components/Schedule';
import Footer from './components/Footer';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import PaymentModal from "./components/Payment";

export default function App() {
    const {
      addToCart,
    } = useApp()
  
    return (
      <BrowserRouter>
        <Header />
        <Banner />
  
        <main>
          <Routes>
            <Route path="/" element={<Equipment onRent={addToCart} />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/payment" element={<PaymentModal />} />
          </Routes>
        </main>
  
        <Schedule />
        <Footer />
  
        
      </BrowserRouter>
    );
  }
  