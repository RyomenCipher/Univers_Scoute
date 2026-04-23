import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  const token = localStorage.getItem('token');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `/api/admin/orders/${orderId}/status`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Statut de la commande mis à jour');
      fetchOrders();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>🔐 Dashboard Admin</h1>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Statistiques
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Commandes
        </button>
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📋 Produits
        </button>
      </div>

      {loading ? (
        <p className="loading">Chargement...</p>
      ) : (
        <div className="admin-content">
          {/* Dashboard */}
          {activeTab === 'dashboard' && stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>👥 Utilisateurs</h3>
                <p className="stat-number">{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>📦 Produits</h3>
                <p className="stat-number">{stats.totalProducts}</p>
              </div>
              <div className="stat-card">
                <h3>📋 Commandes</h3>
                <p className="stat-number">{stats.totalOrders}</p>
              </div>
              <div className="stat-card revenue">
                <h3>💰 Chiffre d'affaires</h3>
                <p className="stat-number">{stats.totalRevenue} XOF</p>
              </div>
            </div>
          )}

          {/* Commandes */}
          {activeTab === 'orders' && (
            <div className="orders-admin">
              {orders.length > 0 ? (
                <div className="orders-table-container">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Client</th>
                        <th>Total</th>
                        <th>Statut Paiement</th>
                        <th>Statut Commande</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td>{order._id.substring(0, 8)}...</td>
                          <td>{order.user?.name}</td>
                          <td>{order.totalPrice} XOF</td>
                          <td>
                            <span className={`badge ${order.paymentStatus}`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td>
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                              className="status-select"
                            >
                              <option value="pending">En attente</option>
                              <option value="processing">En traitement</option>
                              <option value="shipped">Expédié</option>
                              <option value="delivered">Livré</option>
                              <option value="cancelled">Annulé</option>
                            </select>
                          </td>
                          <td>
                            <button className="view-btn">Voir</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">Aucune commande</p>
              )}
            </div>
          )}

          {/* Produits */}
          {activeTab === 'products' && (
            <div className="products-admin">
              {products.length > 0 ? (
                <div className="products-table-container">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Prix</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product._id}>
                          <td>{product.name}</td>
                          <td>{product.category?.name}</td>
                          <td>{product.price} XOF</td>
                          <td className={product.stock > 10 ? 'stock-ok' : 'stock-low'}>
                            {product.stock}
                          </td>
                          <td>
                            <button className="edit-btn">Éditer</button>
                            <button className="delete-btn">Supprimer</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">Aucun produit</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;