import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

function Profile({ user }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || ''
  });

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
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/update-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('✅ Profil mis à jour avec succès !');
      
      // Mettre à jour le localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Erreur lors de la mise à jour du profil');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>

      <div className="profile-container">
        {/* Informations utilisateur */}
        <div className="profile-card">
          <h2>Informations personnelles</h2>

          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Nom complet</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Adresse</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Votre adresse"
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
                placeholder="Votre ville"
              />
            </div>

            <button type="submit" className="update-btn" disabled={loading}>
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </form>
        </div>

        {/* Informations compte */}
        <div className="profile-card">
          <h2>Informations du compte</h2>

          <div className="info-section">
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Rôle:</span>
              <span className="value role">{user?.role === 'admin' ? 'Administrateur' : 'Client'}</span>
            </div>
            <div className="info-row">
              <span className="label">Compte créé:</span>
              <span className="value">{new Date(user?.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {user?.role === 'admin' && (
            <Link to="/admin" className="admin-dashboard-btn">
              📊 Aller au Dashboard Admin
            </Link>
          )}
        </div>

        {/* Historique des commandes */}
        <div className="profile-card">
          <h2>Mes Commandes</h2>
          <div className="orders-section">
            <p>Cliquez sur le lien ci-dessous pour voir vos commandes:</p>
            <Link to="/checkout" className="orders-link">
              Voir l'historique des commandes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;