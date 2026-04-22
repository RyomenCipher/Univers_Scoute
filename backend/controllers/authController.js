const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer un JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route POST /api/auth/register
// @desc Enregistrer un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, passwordConfirm } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !passwordConfirm) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'user'
    });

    // Générer le token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route POST /api/auth/login
// @desc Connexion utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez entrer votre email et mot de passe' });
    }

    // Récupérer l'utilisateur avec le mot de passe (normalement caché)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route GET /api/auth/me
// @desc Récupérer les infos de l'utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.status(200).json({
      message: 'Profil utilisateur',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route PUT /api/auth/update-profile
// @desc Mettre à jour le profil utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, address, city },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Profil mis à jour avec succès',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};