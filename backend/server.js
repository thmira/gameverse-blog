const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
// Não precisamos mais importar 'multer' diretamente aqui, apenas no errorHandler e nas rotas que o usam
// const multer = require('multer');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => {
        console.log("Conectado ao MongoDB Atlas!");
    })
    .catch(err => {
        console.error("Erro ao conectar ao MongoDB:", err);
        process.exit(1);
    });

const newsRouter = require('./routes/news');
app.use('/api/news', newsRouter);

const commentsRouter = require('./routes/comments');
app.use('/api/comments', commentsRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Servidor GameVerse Backend está online e conectado ao MongoDB!');
});

// --- Importa o middleware de erro ---
const errorHandler = require('./middleware/errorHandler');

// --- Usa o middleware de erro NO FINAL, DEPOIS DE TODAS AS ROTAS E OUTROS MIDDLEWARES ---
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`);
    console.log(`Acesse: http://localhost:${port}`);
});