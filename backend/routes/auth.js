const router = require('express').Router();
const User = require('../models/User'); // Importa o modelo de Usuário
const jwt = require('jsonwebtoken');   // Importa o jsonwebtoken

// Função auxiliar para gerar JWT
const generateToken = (id, username, role) => {
    // O token inclui o ID, username e role do usuário, e expira em 1 hora
    return jwt.sign({ id, username, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// --- Rota POST para Registro (Sign Up) ---
// Endpoint: /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json('Por favor, preencha todos os campos obrigatórios.');
    }

    try {
        // Verifica se o usuário já existe pelo username ou email
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.status(400).json('Nome de usuário ou email já registrado.');
        }

        // Cria um novo usuário
        // Se um 'role' for fornecido, usa-o, caso contrário, o padrão é 'user' pelo schema
        user = new User({ username, email, password, role: role || 'user' });
        await user.save(); // A senha será criptografada pelo middleware 'pre-save'

        // Gera um token JWT para o novo usuário
        const token = generateToken(user._id, user.username, user.role);

        res.status(201).json({ message: 'Usuário registrado com sucesso!', token, username: user.username, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro ao registrar usuário: ' + err.message);
    }
});

// --- Rota POST para Login ---
// Endpoint: /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json('Por favor, preencha o nome de usuário e a senha.');
    }

    try {
        // Encontra o usuário pelo username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json('Credenciais inválidas.');
        }

        // Compara a senha fornecida com a senha criptografada
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json('Credenciais inválidas.');
        }

        // Se as credenciais forem válidas, gera um token JWT
        const token = generateToken(user._id, user.username, user.role);

        res.json({ message: 'Login realizado com sucesso!', token, username: user.username, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro ao fazer login: ' + err.message);
    }
});

module.exports = router;