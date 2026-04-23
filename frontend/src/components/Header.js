import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ isAuthenticated, user, onLogout, cartCount }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>🎖️ Univers Scout</h1>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/products" className="nav-link">Produits</Link>
          <Link to="/cart" className="nav-link">
            Panier {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <>
              <span className="user-greeting">Bonjour, {user?.name}</span>
              <Link to="/profile" className="nav-link">Profil</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link admin">Admin</Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Connexion</Link>
              <Link to="/register" className="nav-link register">S'inscrire</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;