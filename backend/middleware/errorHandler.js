const multer = require('multer'); // Importa o Multer para verificar o tipo de erro

// Middleware de tratamento de erros genérico
const errorHandler = (err, req, res, next) => {
    // Loga o erro para depuração no console do servidor
    console.error("Erro Detectado:", err);

    // Se for um erro do Multer (upload de arquivo)
    if (err instanceof multer.MulterError) {
        let message = 'Erro no upload do arquivo.';
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'O arquivo é muito grande. Tamanho máximo permitido é de 5MB.';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            message = 'Campo de arquivo inesperado.';
        }
        return res.status(400).json({ message: message, code: err.code, type: 'MulterError' });
    }

    // Para outros tipos de erro, ou erros não Multer
    // Define o status do erro (se já não estiver definido)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Retorna a resposta de erro em formato JSON
    res.json({
        message: err.message || 'Ocorreu um erro interno no servidor.',
        // Em ambiente de desenvolvimento, envia o stack trace para facilitar a depuração
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        type: err.name // Adiciona o nome do erro se disponível
    });
};

module.exports = errorHandler;