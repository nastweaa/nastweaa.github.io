import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';

export default function PaymentModal() {
  const navigate = useNavigate();
  const {setCart} = useApp()

  const [formData, setFormData] = useState({
    cardNumber: '',
    cvv: '',
    fullname: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Оплата успішна!\nІм'я: ${formData.fullname}\nEmail: ${formData.email}`);
    setCart([]);
    navigate('/');
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="close-btn" onClick={() => navigate('/')}>&times;</span>
        <h2>Оплата</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Номер картки:<br />
            <input
              type="text"
              name="cardNumber"
              required
              pattern="\d{16}"
              minLength={16}
              maxLength={16}
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleChange}
            />
          </label>
          <br /><br />

          <label>
            CVV:<br />
            <input
              type="text"
              name="cvv"
              required
              pattern="\d{3}"
              minLength={3}
              maxLength={3}
              placeholder="123"
              value={formData.cvv}
              onChange={handleChange}
            />
          </label>
          <br /><br />

          <label>
            ПІБ:<br />
            <input
              type="text"
              name="fullname"
              required
              placeholder="Ваше повне ім’я"
              value={formData.fullname}
              onChange={handleChange}
            />
          </label>
          <br /><br />

          <label>
            Email:<br />
            <input
              type="email"
              name="email"
              required
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <br /><br />

          <button type="submit">Оплатити</button>
        </form>
      </div>
    </div>
  );
}
