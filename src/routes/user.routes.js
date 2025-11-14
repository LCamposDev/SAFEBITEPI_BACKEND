const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const { updateProfileSchema, validate } = require('../validators/user.validator');
const { uploadProfilePhoto, validateUpload } = require('../middleware/upload');

/**
 * @route   GET /api/users/profile
 * @desc    Obter perfil do usuário autenticado
 * @access  Private
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Atualizar perfil do usuário autenticado
 * @access  Private
 */
router.put('/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);

/**
 * @route   PUT /api/users/profile/photo
 * @desc    Atualizar foto de perfil
 * @access  Private
 */
router.put(
  '/profile/photo',
  authenticate,
  uploadProfilePhoto,
  validateUpload,
  userController.updateProfilePhoto
);

module.exports = router;
