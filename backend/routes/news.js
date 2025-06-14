const router = require('express').Router();
let News = require('../models/News');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

// --- Rota GET para buscar todas as notícias ---
// Endpoint: /api/news/
router.route('/').get((req, res) => { // <-- VERIFIQUE ESTA ROTA
    News.find() // Encontra todas as notícias
        .then(news => res.json(news)) // Retorna as notícias em JSON
        .catch(err => res.status(400).json('Erro: ' + err)); // Captura e retorna erros
});

// --- Rota GET para buscar uma notícia por ID ---
// Endpoint: /api/news/:id
router.route('/:id').get((req, res) => {
    News.findById(req.params.id)
        .then(news => {
            if (news) {
                res.json(news);
            } else {
                res.status(404).json('Notícia não encontrada.');
            }
        })
        .catch(err => res.status(400).json('Erro: ' + err));
});

// --- Rota POST para adicionar uma nova notícia ---
router.route('/add').post(protect, authorize('admin'), upload.single('newsImage'), (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const author = req.body.author;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const category = req.body.category || 'Geral';

    const newNews = new News({
        title,
        content,
        author,
        imageUrl,
        category
    });

    newNews.save()
        .then(() => res.json('Notícia adicionada!'))
        .catch(err => res.status(400).json('Erro: ' + err));
});

// --- Rota PUT para atualizar uma notícia por ID ---
router.route('/update/:id').put(protect, authorize('admin'), upload.single('newsImage'), (req, res) => {
    News.findById(req.params.id)
        .then(news => {
            if (!news) {
                return res.status(404).json('Notícia não encontrada para atualização.');
            }

            news.title = req.body.title || news.title;
            news.content = req.body.content || news.content;
            news.author = req.body.author || news.author;
            news.category = req.body.category || news.category;

            if (req.file) {
                news.imageUrl = `/uploads/${req.file.filename}`;
            } else if (req.body.imageUrl === '') {
                news.imageUrl = '';
            }

            news.updatedAt = Date.now();

            news.save()
                .then(() => res.json('Notícia atualizada!'))
                .catch(err => res.status(400).json('Erro ao atualizar notícia: ' + err));
        })
        .catch(err => res.status(400).json('Erro: ' + err));
});

// --- Rota DELETE para excluir uma notícia por ID ---
router.route('/:id').delete(protect, authorize('admin'), (req, res) => {
    News.findByIdAndDelete(req.params.id)
        .then(deletedNews => {
            if (deletedNews) {
                res.json('Notícia excluída!');
            } else {
                res.status(404).json('Notícia não encontrada para exclusão.');
            }
        })
        .catch(err => res.status(400).json('Erro ao excluir notícia: ' + err));
});

module.exports = router;