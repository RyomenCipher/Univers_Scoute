import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products?limit=6');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenue sur Univers Scout</h1>
          <p>Votre plateforme de référence pour les articles scouts à Dakar</p>
          <Link to="/products" className="cta-button">Découvrir nos produits</Link>
        </div>
      </section>

      {/* Catégories Section */}
      <section className="categories">
        <h2>Nos Catégories</h2>
        <div className="categories-grid">
          <Link to="/products?category=Tissus réglementaires" className="category-card">
            <div className="category-icon">👔</div>
            <h3>Tissus réglementaires</h3>
          </Link>
          <Link to="/products?category=Insignes" className="category-card">
            <div className="category-icon">🎖️</div>
            <h3>Insignes</h3>
          </Link>
          <Link to="/products?category=Foulards" className="category-card">
            <div className="category-icon">🧣</div>
            <h3>Foulards</h3>
          </Link>
          <Link to="/products?category=Équipements" className="category-card">
            <div className="category-icon">🎒</div>
            <h3>Équipements</h3>
          </Link>
        </div>
      </section>

      {/* Produits populaires */}
      <section className="featured-products">
        <h2>Produits populaires</h2>
        {loading ? (
          <p className="loading">Chargement...</p>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <Link to={`/products/${product._id}`} key={product._id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="placeholder">Image</div>
                  )}
                </div>
                <h3>{product.name}</h3>
                <p className="price">{product.price} XOF</p>
                <span className="stock">
                  {product.stock > 0 ? '✅ En stock' : '❌ Rupture'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="no-products">Aucun produit disponible</p>
        )}
      </section>

      {/* Avantages */}
      <section className="benefits">
        <h2>Pourquoi nous choisir ?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🚚</div>
            <h3>Livraison à domicile</h3>
            <p>Livraison rapide et sécurisée dans toute la région de Dakar</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💳</div>
            <h3>Paiement sécurisé</h3>
            <p>Wave, Orange Money et Stripe pour plus de sécurité</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📞</div>
            <h3>Support client</h3>
            <p>Équipe disponible 24h/24 pour vous aider</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">✨</div>
            <h3>Qualité garantie</h3>
            <p>Tous nos articles sont originaux et de haute qualité</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;