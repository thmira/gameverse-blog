const jwt = require('jsonwebtoken');

// Middleware para verificar se o usuário está autenticado
const protect = (req, res, next) => {
    let token;

    // Verifica se o token JWT está presente no cabeçalho 'Authorization'
    // Espera-se o formato: "Bearer SEU_TOKEN_AQUI"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extrai o token removendo "Bearer "
            token = req.headers.authorization.split(' ')[1];

            // Verifica o token usando a chave secreta JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Adiciona os dados do usuário decodificados (id, username, role) ao objeto de requisição (req.user)
            // Isso torna os dados do usuário acessíveis nas próximas funções da rota
            req.user = decoded;
            next(); // Continua para a próxima função middleware ou para a rota
        } catch (error) {
            console.error('Erro na autenticação do token:', error);
            res.status(401).json('Não autorizado, token falhou.'); // Token inválido ou expirado
        }
    }

    if (!token) {
        res.status(401).json('Não autorizado, nenhum token.'); // Nenhum token fornecido
    }
};

// Middleware para verificar se o usuário é um administrador
const authorize = (...roles) => { // '...roles' permite passar múltiplos roles (ex: authorize('admin', 'moderator'))
    return (req, res, next) => {
        // Verifica se o req.user existe (ou seja, se 'protect' já rodou e autenticou)
        // e se o papel do usuário está incluído nos papéis permitidos.
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json('Acesso negado, você não tem permissão para esta ação.'); // Proibido
        }
        next(); // Se tiver permissão, continua
    };
};

module.exports = { protect, authorize };