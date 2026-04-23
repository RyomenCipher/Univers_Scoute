import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

function Checkout({ cart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    phone: '',
    paymentMethod: 'stripe'
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!formData.address || !formData.city || !formData.phone) {
        setMessage('Veuillez remplir tous les champs');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');

      // Créer la commande
      const orderResponse = await axios.post(
        '/api/orders',
        {
          items: cart.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            color: item.selectedColor,
            size: item.selectedSize
          })),
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            phone: formData.phone
          },
          paymentMethod: formData.paymentMethod
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage('✅ Commande créée avec succès !');
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        // Vider le panier
        localStorage.removeItem('cart');
        navigate('/profile');
      }, 2000);

    } catch (error) {
      setMessage(error.response?.data?.message || '❌ Erreur lors de la création de la commande');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart-message">
          <h1>Panier vide</h1>
          <p>Vous ne pouvez pas passer commande avec un panier vide.</p>
          <button onClick={() => navigate('/products')} className="back-to-products">
            Continuer les achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Finaliser votre commande</h1>

      <div className="checkout-container">
        {/* Formulaire */}
        <div className="checkout-form-section">
          <div className="checkout-card">
            <h2>Adresse de livraison</h2>

            {message && (
              <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="address">Adresse</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Votre adresse complète"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">Ville</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Dakar, Rufisque, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Numéro de téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+221 77 XXX XXXX"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Méthode de paiement</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="stripe">💳 Stripe (Carte bancaire)</option>
                  <option value="wave">📱 Wave</option>
                  <option value="orange_money">🟠 Orange Money</option>
                </select>
              </div>

              <button type="submit" className="place-order-btn" disabled={loading}>
                {loading ? 'Traitement...' : 'Passer la commande'}
              </button>
            </form>
          </div>
        </div>

        {/* Résumé */}
        <div className="checkout-summary-section">
          <div className="checkout-card">
            <h2>Résumé de la commande</h2>

            <div className="order-items">
              {cart.map(item => (
                <div key={item._id} className="order-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Quantité: {item.quantity}</p>
                    {item.selectedColor && <p>Couleur: {item.selectedColor}</p>}
                    {item.selectedSize && <p>Taille: {item.selectedSize}</p>}
                  </div>
                  <div className="item-price">
                    {item.price * item.quantity} XOF
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-line">
                <span>Sous-total:</span>
                <span>{total} XOF</span>
              </div>
              <div className="summary-line">
                <span>Frais de livraison:</span>
                <span>À déterminer</span>
              </div>
              <div className="summary-line total">
                <span>Total:</span>
                <span>{total} XOF</span>
              </div>
            </div>

            <p className="delivery-info">
              ℹ️ Vous recevrez votre commande sous 2-3 jours ouvrables
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;