    import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';

    export default function Header() {
        const {registeredUser} = useApp()

    return (
        <div className="top-footer">
        <div className="logo">SportX</div>
        <div className="search-bar">
            <input type="text" placeholder="Пошук..." />
        </div>
        <div className="icons">
            <Link to="/cart" >🛒 Кошик</Link>
            {registeredUser?.fullname ? <span >{registeredUser.fullname}</span> : <Link to="/register">🔑 Реєстрація</Link> }
           
        </div>
        </div>
    );
    }
