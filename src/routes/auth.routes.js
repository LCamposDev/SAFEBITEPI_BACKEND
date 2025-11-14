const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyResetTokenSchema,
  resetPasswordSchema,
  sendVerificationEmailSchema,
  verifyEmailSchema,
  validate
} = require('../validators/auth.validator');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar novo usuário
 * @access  Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuário
 * @access  Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Renovar token JWT usando refresh token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar recuperação de senha
 * @access  Public
 */
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * @route   POST /api/auth/verify-reset-token
 * @desc    Verificar token de recuperação de senha
 * @access  Public
 */
router.post(
  '/verify-reset-token',
  validate(verifyResetTokenSchema),
  authController.verifyResetToken
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Redefinir senha usando token
 * @access  Public
 */
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

/**
 * @route   POST /api/auth/send-verification-email
 * @desc    Enviar email de verificação
 * @access  Public
 */
router.post(
  '/send-verification-email',
  validate(sendVerificationEmailSchema),
  authController.sendVerificationEmailHandler
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verificar email usando token
 * @access  Public
 */
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);

module.exports = router;
