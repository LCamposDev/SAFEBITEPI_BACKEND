const express = require('express');
const router = express.Router();

// Importar rotas
const authRoutes = require('./auth.routes');
const testRoutes = require('./test.routes');
const userRoutes = require('./user.routes');
// const recipeRoutes = require('./recipe.routes');
// const restrictionRoutes = require('./restriction.routes');

// Rotas de saúde e status
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas da API
router.use('/auth', authRoutes);
router.use('/test', testRoutes);
router.use('/users', userRoutes);
// router.use('/recipes', recipeRoutes);
// router.use('/restrictions', restrictionRoutes);

module.exports = router;
