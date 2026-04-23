import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart({ cart, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Mon Panier</h1>
        <div className="empty-cart">
          <p>Votre panier est vide</p>
          <Link to="/products" className="continue-shopping-btn">
            Continuer vos achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Mon Panier ({cart.length} article{cart.length > 1 ? 's' : ''})</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="placeholder">Image</div>
                )}
              </div>

              <div className="item-details">
                <h3>{item.name}</h3>
                {item.selectedColor && <p>Couleur: {item.selectedColor}</p>}
                {item.selectedSize && <p>Taille: {item.selectedSize}</p>}
                <p className="price">{item.price} XOF</p>
              </div>

              <div className="item-quantity">
                <p>Quantité: {item.quantity}</p>
              </div>

              <div className="item-subtotal">
                <p className="subtotal">{item.price * item.quantity} XOF</p>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="remove-btn"
              >
                ✕ Supprimer
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Résumé du panier</h2>
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

          <Link to="/checkout" className="checkout-btn">
            Procéder au paiement
          </Link>

          <Link to="/products" className="continue-shopping-btn-small">
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;