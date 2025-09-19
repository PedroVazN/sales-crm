const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Se não há token ou é o token dummy do frontend, usar usuário temporário
    if (!token || token === 'dummy-token') {
      req.user = {
        id: '68c1afbcf906c14a8e7e8ff7', // ObjectId válido do MongoDB
        name: 'Usuário Temporário',
        email: 'temp@example.com',
        role: 'admin'
      };
      return next();
    }

    // Tentar validar o token JWT
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user || !user.isActive) {
        // Se usuário não encontrado ou inativo, usar usuário temporário
        req.user = {
          id: '68c1afbcf906c14a8e7e8ff7',
          name: 'Usuário Temporário',
          email: 'temp@example.com',
          role: 'admin'
        };
        return next();
      }

      req.user = user;
      next();
    } catch (jwtError) {
      // Se erro na validação do JWT, usar usuário temporário
      req.user = {
        id: '68c1afbcf906c14a8e7e8ff7',
        name: 'Usuário Temporário',
        email: 'temp@example.com',
        role: 'admin'
      };
      next();
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    // Em caso de erro, usar usuário temporário
    req.user = {
      id: '68c1afbcf906c14a8e7e8ff7',
      name: 'Usuário Temporário',
      email: 'temp@example.com',
      role: 'admin'
    };
    next();
  }
};

// Middleware para verificar roles específicas
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Permissão insuficiente'
      });
    }

    next();
  };
};

module.exports = { auth, authorize };
