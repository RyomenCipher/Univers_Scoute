const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token manquant. Veuillez vous connecter.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

// Middleware pour vérifier que l'utilisateur est admin
exports.isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les admins peuvent accéder à cette route.' });
  }
  next();
};

// Middleware pour vérifier que l'utilisateur est admin ou manager
exports.isAdminOrManager = (req, res, next) => {
  if (req.userRole !== 'admin' && req.userRole !== 'manager') {
    return res.status(403).json({ message: 'Accès refusé.' });
  }
  next();
};