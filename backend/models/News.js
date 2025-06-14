const mongoose = require('mongoose'); // Importa o Mongoose

// Define o Schema para a Notícia
const newsSchema = new mongoose.Schema({
    // Título da notícia, é obrigatório (required: true)
    title: {
        type: String,
        required: true,
        trim: true // Remove espaços em branco do início e fim
    },
    // Conteúdo completo da notícia, também obrigatório
    content: {
        type: String,
        required: true
    },
    // Autor da notícia (inicialmente, será apenas um texto, depois podemos vincular a um usuário)
    author: {
        type: String,
        required: true,
        trim: true
    },
    // URL da imagem de capa da notícia (opcional, pode ser uma string vazia)
    imageUrl: {
        type: String,
        default: '' // Valor padrão se não for fornecido
    },
    // Categoria da notícia (ex: "FPS", "RPG", "Indie")
    category: {
        type: String,
        trim: true,
        default: 'Geral' // Valor padrão
    },
    // Data de criação da notícia. `Date.now` define a data atual automaticamente.
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Data da última atualização da notícia. Será atualizado automaticamente.
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Opções do Schema
    // `timestamps: true` adicionaria automaticamente `createdAt` e `updatedAt` com as datas,
    // mas definimos manualmente para ter mais controle e clareza para este exemplo.
});

// Cria o Modelo Mongoose a partir do Schema
// O nome 'News' (singular) fará com que o Mongoose crie uma coleção 'news' (plural) no MongoDB.
const News = mongoose.model('News', newsSchema);

module.exports = News; // Exporta o modelo para ser usado em outras partes do backend