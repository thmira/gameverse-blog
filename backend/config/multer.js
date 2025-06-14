const multer = require('multer'); // Importa o Multer
const path = require('path');   // Módulo nativo do Node.js para lidar com caminhos de arquivos

// Define onde os arquivos serão armazenados e como serão nomeados
const storage = multer.diskStorage({
    // destination: Onde o arquivo será salvo no disco.
    // '__dirname' é o diretório do arquivo atual (config/multer.js).
    // path.join() cria um caminho absoluto robusto, navegando 2 níveis para cima (para 'backend')
    // e depois para a pasta 'uploads'.
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    // filename: Como o arquivo será nomeado.
    filename: (req, file, cb) => {
        // Gera um nome de arquivo único para evitar colisões
        // Ex: 'nome_original_do_arquivo-1234567890.jpg'
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para aceitar apenas certos tipos de arquivo (imagens)
const fileFilter = (req, file, cb) => {
    // Verifica o tipo MIME do arquivo
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true); // Aceita o arquivo
    } else {
        cb(new Error('Tipo de arquivo inválido. Apenas imagens JPEG, PNG ou GIF são permitidas.'), false); // Rejeita o arquivo
    }
};

// Configura o Multer com o storage e o fileFilter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limite de tamanho do arquivo: 5MB (em bytes)
    }
});

module.exports = upload; // Exporta a instância configurada do Multer