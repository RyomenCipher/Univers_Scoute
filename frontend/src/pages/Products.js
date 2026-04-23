import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await axios.get(`/api/products?${params.toString()}`);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({
      category: filters.category,
      search: filters.search,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice
    });
  };

  return (
    <div className="products-page">
      <h1>Nos Produits</h1>

      <div className="products-container">
        {/* Sidebar de filtrage */}
        <aside className="filters-sidebar">
          <h3>Filtres</h3>
          <form onSubmit={handleSearch} className="filters-form">
            {/* Recherche */}
            <div className="filter-group">
              <label>Recherche</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nom du produit"
              />
            </div>

            {/* Catégorie */}
            <div className="filter-group">
              <label>Catégorie</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">Tous</option>
                <option value="Tissus réglementaires">Tissus réglementaires</option>
                <option value="Insignes">Insignes</option>
                <option value="Foulards">Foulards</option>
                <option value="Équipements">Équipements</option>
              </select>
            </div>

            {/* Prix */}
            <div className="filter-group">
              <label>Prix minimum</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="filter-group">
              <label>Prix maximum</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="10000"
                min="0"
              />
            </div>

            <button type="submit" className="apply-filters-btn">
              Appliquer les filtres
            </button>
          </form>
        </aside>

        {/* Produits */}
        <main className="products-main">
          {loading ? (
            <p className="loading">Chargement...</p>
          ) : products.length > 0 ? (
            <div className="products-list">
              {products.map(product => (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="product-card"
                >
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="placeholder">Image</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="description">{product.description.substring(0, 100)}...</p>
                    <div className="product-footer">
                      <span className="price">{product.price} XOF</span>
                      <span className="stock">
                        {product.stock > 0 ? '✅ En stock' : '❌ Rupture'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="no-products">Aucun produit trouvé avec ces critères</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;