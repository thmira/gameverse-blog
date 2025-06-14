const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Importa o bcryptjs para criptografia de senhas

// Define o Schema para o Usuário
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Garante que o nome de usuário seja único
        trim: true,
        minlength: 3 // Mínimo de 3 caracteres
    },
    email: {
        type: String,
        required: true,
        unique: true, // Garante que o email seja único
        trim: true,
        lowercase: true, // Armazena o email em minúsculas
        match: [/.+@.+\..+/, 'Por favor, insira um email válido.'] // Validação de formato de email
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Mínimo de 6 caracteres para a senha
    },
    // Role (Papel) do usuário: 'user' para usuários comuns, 'admin' para administradores
    role: {
        type: String,
        enum: ['user', 'admin'], // Garante que o papel seja 'user' ou 'admin'
        default: 'user' // Padrão é 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// --- Middleware para criptografar a senha antes de salvar ---
// Este hook 'pre' (pré-save) será executado antes que um documento User seja salvo no MongoDB.
userSchema.pre('save', async function(next) {
    // 'this' refere-se ao documento User que está sendo salvo.
    // Verifica se a senha foi modificada (ou se é uma nova senha).
    if (!this.isModified('password')) {
        return next(); // Se a senha não foi modificada, passa para o próximo middleware/salvamento.
    }
    try {
        // Gera um "salt" (valor aleatório) para ser usado na criptografia. Quanto maior o número, mais seguro, mas mais lento.
        const salt = await bcrypt.genSalt(10);
        // Criptografa a senha usando o salt.
        this.password = await bcrypt.hash(this.password, salt);
        next(); // Prossegue com o salvamento.
    } catch (error) {
        next(error); // Passa o erro para o próximo middleware de erro.
    }
});

// --- Método para comparar senhas ---
// Este é um método customizado que pode ser chamado em qualquer instância de um documento User.
// Ex: user.comparePassword('senhaDigitada')
userSchema.methods.comparePassword = async function(candidatePassword) {
    // Compara a senha fornecida (candidatePassword) com a senha criptografada armazenada (this.password).
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;