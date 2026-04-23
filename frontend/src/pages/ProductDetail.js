import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data.product);
      if (response.data.product.colors.length > 0) {
        setSelectedColor(response.data.product.colors[0].name);
      }
      if (response.data.product.sizes.length > 0) {
        setSelectedSize(response.data.product.sizes[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.colors.length > 0 && !selectedColor) {
      setMessage('Veuillez sélectionner une couleur');
      return;
    }
    if (product.sizes.length > 0 && !selectedSize) {
      setMessage('Veuillez sélectionner une taille');
      return;
    }

    const productToAdd = {
      ...product,
      quantity,
      selectedColor,
      selectedSize
    };

    addToCart(productToAdd);
    setMessage('✅ Produit ajouté au panier !');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <div className="product-detail"><p>Chargement...</p></div>;
  }

  if (!product) {
    return <div className="product-detail"><p>Produit non trouvé</p></div>;
  }

  return (
    <div className="product-detail">
      <button onClick={() => navigate('/products')} className="back-btn">
        ← Retour aux produits
      </button>

      <div className="detail-container">
        {/* Image */}
        <div className="detail-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="placeholder">Image du produit</div>
          )}
        </div>

        {/* Informations */}
        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="category">{product.category?.name}</p>

          <div className="rating">
            <span className="stars">{'⭐'.repeat(Math.round(product.rating))}</span>
            <span className="rating-value">({product.rating.toFixed(1)}/5)</span>
          </div>

          <p className="description">{product.description}</p>

          <div className="price-stock">
            <span className="price">{product.price} XOF</span>
            <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `✅ ${product.stock} en stock` : '❌ Rupture de stock'}
            </span>
          </div>

          {/* Sélection des options */}
          <div className="options">
            {product.colors && product.colors.length > 0 && (
              <div className="option-group">
                <label>Couleur</label>
                <div className="colors">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      className={`color-btn ${selectedColor === color.name ? 'selected' : ''}`}
                      style={{ backgroundColor: color.hex || '#999' }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    >
                      {selectedColor === color.name && '✓'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="option-group">
                <label>Taille</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="size-select"
                >
                  {product.sizes.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantité */}
            <div className="option-group">
              <label>Quantité</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))} />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && <p className="message">{message}</p>}

          {/* Bouton Ajouter */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Ajouter au panier 🛒' : 'Rupture de stock'}
          </button>
        </div>
      </div>

      {/* Avis */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="reviews-section">
          <h2>Avis des clients</h2>
          <div className="reviews-list">
            {product.reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <span className="reviewer-name">{review.user?.name || 'Anonyme'}</span>
                  <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;