import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function CreateNews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  // Agora, usaremos 'selectedFile' para o arquivo a ser enviado
  const [selectedFile, setSelectedFile] = useState(null);
  // 'imagePreviewUrl' pode ser usado para mostrar uma prévia da imagem selecionada
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const { token, user } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Gera uma URL para pré-visualização da imagem
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !author.trim()) {
      setMessage('Por favor, preencha todos os campos obrigatórios (Título, Conteúdo, Autor).');
      setIsError(true);
      return;
    }

    if (!token) {
        setMessage('Você precisa estar logado para criar uma notícia.');
        setIsError(true);
        return;
    }

    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    // --- Crie um objeto FormData para enviar dados mistos (texto + arquivo) ---
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('category', category);
    // Adiciona o arquivo da imagem se houver um selecionado.
    // 'newsImage' deve corresponder ao nome do campo no Multer (upload.single('newsImage'))
    if (selectedFile) {
      formData.append('newsImage', selectedFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/news/add', {
        method: 'POST',
        // --- IMPORTANTE: NÃO defina o Content-Type para 'multipart/form-data'. ---
        // O navegador fará isso automaticamente e adicionará o boundary correto
        // quando você envia um objeto FormData.
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData, // Envia o objeto FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setMessage('Notícia criada com sucesso!');
      setIsError(false);
      // Limpa o formulário e a prévia da imagem
      setTitle('');
      setContent('');
      setAuthor('');
      setSelectedFile(null);
      setImagePreviewUrl('');
      setCategory('');

      setTimeout(() => navigate('/'), 1500);
    } catch (e) {
      console.error("Erro ao criar notícia:", e);
      setMessage(`Falha ao criar notícia: ${e.message}`);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Criar Nova Notícia</h2>
      {!user || user.role !== 'admin' ? (
          <p className="message error">Você não tem permissão para criar notícias. Faça login como administrador.</p>
      ) : (
          <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Título:</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Conteúdo:</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="8"
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="author">Autor:</label>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Campo de Upload de Arquivo */}
              <div className="form-group">
                <label htmlFor="newsImage">Imagem da Notícia (Opcional):</label>
                <input
                  type="file"
                  id="newsImage"
                  accept="image/jpeg,image/png,image/gif" /* Tipos de arquivo aceitos */
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
                {imagePreviewUrl && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={imagePreviewUrl} alt="Pré-visualização" style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '4px' }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="category">Categoria (Opcional):</label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {message && (
                <p className={`message ${isError ? 'error' : 'success'}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Criando Notícia...' : 'Criar Notícia'}
              </button>
          </form>
      )}
    </div>
  );
}

export default CreateNews;