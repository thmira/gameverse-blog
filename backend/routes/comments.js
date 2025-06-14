const router = require('express').Router();
let Comment = require('../models/Comment'); // Importa o modelo Comment que acabamos de criar
let News = require('../models/News'); // Também vamos precisar do modelo News para verificar se a notícia existe

// --- Rota GET para buscar comentários de uma notícia específica ---
// Endpoint: /api/comments/:newsId
router.route('/:newsId').get((req, res) => {
    // Encontra todos os comentários que têm o newsId correspondente
    Comment.find({ newsId: req.params.newsId })
        .then(comments => res.json(comments)) // Retorna os comentários
        .catch(err => res.status(400).json('Erro ao buscar comentários: ' + err));
});

// --- Rota POST para adicionar um novo comentário ---
// Endpoint: /api/comments/add
router.route('/add').post(async (req, res) => {
    const text = req.body.text;
    const author = req.body.author || 'Anônimo'; // Se o autor não for fornecido, usa "Anônimo"
    const newsId = req.body.newsId;

    // Validação básica: verificar se a notícia realmente existe antes de adicionar um comentário
    try {
        const newsExists = await News.findById(newsId);
        if (!newsExists) {
            return res.status(404).json('Erro: Notícia não encontrada para adicionar comentário.');
        }
    } catch (error) {
        return res.status(400).json('Erro de validação do News ID: ' + error);
    }

    const newComment = new Comment({
        text,
        author,
        newsId
    });

    newComment.save()
        .then(() => res.json('Comentário adicionado!'))
        .catch(err => res.status(400).json('Erro ao adicionar comentário: ' + err));
});

module.exports = router; // Exporta o router