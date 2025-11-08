/**
 * Middleware de tratamento de erros
 */
const errorHandler = (err, req, res, _next) => {
  // Log do erro
  console.error('Erro:', err);

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: err.details || err.message
    });
  }

  // Erro de autenticação
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado',
      error: err.message
    });
  }

  // Erro não encontrado
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      message: 'Recurso não encontrado',
      error: err.message
    });
  }

  // Erro padrão do servidor
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
