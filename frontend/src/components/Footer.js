import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>À propos</h3>
          <p>Univers Scout est la plateforme de référence pour l'achat d'articles scouts à Dakar.</p>
        </div>

        <div className="footer-section">
          <h3>Liens utiles</h3>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/products">Produits</a></li>
            <li><a href="/">Conditions d'utilisation</a></li>
            <li><a href="/">Politique de confidentialité</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: contact@univers-scout.sn</p>
          <p>Téléphone: +221 77 XXX XXXX</p>
          <p>Dakar, Sénégal</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Univers Scout. Tous les droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;