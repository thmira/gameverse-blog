const mongoose = require('mongoose'); // Importa o Mongoose

// Define o Schema para o Comentário
const commentSchema = new mongoose.Schema({
    // Conteúdo do comentário, é obrigatório
    text: {
        type: String,
        required: true,
        trim: true // Remove espaços em branco
    },
    // Nome do autor do comentário
    author: {
        type: String,
        required: true,
        trim: true,
        default: 'Anônimo' // Pode ser 'Anônimo' se o usuário não estiver logado
    },
    // Referência à notícia à qual este comentário pertence
    // `mongoose.Schema.Types.ObjectId` indica que será um ID de um documento do MongoDB
    // `ref: 'News'` indica que este ID se refere a um documento na coleção 'news' (do modelo News)
    newsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'News' // Garante que o ID faz referência a uma notícia existente
    },
    // Data de criação do comentário
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Cria o Modelo Mongoose a partir do Schema
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment; // Exporta o modelo