const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar diretório de uploads se não existir
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp + número aleatório + extensão
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${ext}`);
  }
});

// Filtro de tipos de arquivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = (
    process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,image/webp'
  ).split(',');

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Tipo de arquivo não permitido. Tipos permitidos: ${allowedTypes.join(', ')}`),
      false
    );
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB padrão
  }
});

/**
 * Middleware para upload de foto de perfil
 * Aceita apenas um arquivo com o campo 'photo'
 */
const uploadProfilePhoto = upload.single('photo');

/**
 * Middleware para validar upload
 */
const validateUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Nenhum arquivo enviado. Use o campo "photo" para enviar a imagem.'
    });
  }

  // Verificar tamanho do arquivo
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;
  if (req.file.size > maxSize) {
    // Deletar arquivo se exceder o tamanho
    fs.unlinkSync(req.file.path);
    return res.status(400).json({
      success: false,
      message: `Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`
    });
  }

  next();
};

module.exports = {
  uploadProfilePhoto,
  validateUpload
};
