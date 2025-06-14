import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  // Estados para o upload de imagem
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // Para pré-visualização de NOVO upload
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // Para a URL da imagem existente
  const [clearImageFlag, setClearImageFlag] = useState(false); // Flag para indicar se a imagem existente deve ser limpa

  const [category, setCategory] = useState('');

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
      if (!authLoading && (!user || user.role !== 'admin')) {
          alert('Você não tem permissão para editar notícias.');
          navigate('/');
      }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
        return;
    }

    const fetchNewsToEdit = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
        setAuthor(data.author);
        setCategory(data.category);
        setCurrentImageUrl(data.imageUrl); // Armazena a URL da imagem existente
        setImagePreviewUrl(''); // Limpa qualquer prévia antiga
        setSelectedFile(null); // Limpa qualquer arquivo selecionado antigo
        setClearImageFlag(false); // Reseta a flag de limpeza
      } catch (e) {
        console.error("Erro ao carregar notícia para edição:", e);
        setMessage(`Erro ao carregar notícia: ${e.message}`);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsToEdit();
  }, [id, user, authLoading, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setClearImageFlag(false); // Se um novo arquivo é selecionado, não limpar a imagem

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

  const handleClearImage = () => {
    setSelectedFile(null);
    setImagePreviewUrl('');
    setCurrentImageUrl(''); // Limpa a URL existente na visualização
    setClearImageFlag(true); // Define a flag para enviar ao backend
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !author.trim()) {
      setMessage('Por favor, preencha todos os campos obrigatórios.');
      setIsError(true);
      return;
    }

    if (!token) {
        setMessage('Você precisa estar logado para editar uma notícia.');
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

    if (selectedFile) {
      formData.append('newsImage', selectedFile); // Envia o novo arquivo
    } else if (clearImageFlag) {
      formData.append('imageUrl', ''); // Sinaliza para o backend que a imagem deve ser limpa
    }
    // Se selectedFile for null e clearImageFlag for false, não adicionamos 'newsImage' nem 'imageUrl' ao formData,
    // o que significa que o backend manterá a imagem existente (se houver).

    try {
      const response = await fetch(`http://localhost:5000/api/news/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Não defina Content-Type para FormData!
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setMessage('Notícia atualizada com sucesso!');
      setIsError(false);
      setTimeout(() => navigate(`/news/${id}`), 1500);
    } catch (e) {
      console.error("Erro ao atualizar notícia:", e);
      setMessage(`Falha ao atualizar notícia: ${e.message}`);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <p className="loading-message">Carregando notícia para edição...</p>;
  }
  if (!user || user.role !== 'admin') {
      return null;
  }

  return (
    <div className="form-container">
      <h2>Editar Notícia</h2>
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

        {/* Campo de Upload de Arquivo para Edição */}
        <div className="form-group">
          <label htmlFor="newsImage">Imagem da Notícia (Nova ou Existente):</label>
          <input
            type="file"
            id="newsImage"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />

          {/* Pré-visualização da NOVA imagem selecionada */}
          {imagePreviewUrl && (
            <div style={{ marginTop: '10px' }}>
              <p>Pré-visualização da Nova Imagem:</p>
              <img src={imagePreviewUrl} alt="Nova pré-visualização" style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
          )}

          {/* Exibição da IMAGEM EXISTENTE (se não houver nova prévia e não estiver marcada para limpar) */}
          {!imagePreviewUrl && currentImageUrl && !clearImageFlag && (
            <div style={{ marginTop: '10px' }}>
              <p>Imagem Atual:</p>
              {/* Assumindo que currentImageUrl é um caminho relativo como '/uploads/...' */}
              <img src={`http://localhost:5000${currentImageUrl}`} alt="Imagem Atual" style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
          )}

          {/* Botão para limpar a imagem existente */}
          {currentImageUrl && !imagePreviewUrl && !clearImageFlag && (
            <button
              type="button"
              onClick={handleClearImage}
              className="btn-secondary"
              style={{ marginTop: '10px' }}
              disabled={isSubmitting}
            >
              Remover Imagem Atual
            </button>
          )}
          {clearImageFlag && <p style={{color: '#888', marginTop: '5px'}}>Imagem marcada para remoção.</p>}
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
          className="btn-warning"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Atualizando Notícia...' : 'Atualizar Notícia'}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/news/${id}`)}
          className="btn-secondary"
          style={{ marginLeft: '10px' }}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default EditNews;