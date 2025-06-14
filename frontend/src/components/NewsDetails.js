import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user, isAdmin } = useAuth();

  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentRefreshTrigger, setCommentRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNewsItem(data);
      } catch (e) {
        console.error("Erro ao buscar detalhes da notícia:", e);
        setError("Não foi possível carregar os detalhes desta notícia.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  const handleCommentAdded = () => {
    setCommentRefreshTrigger(prev => prev + 1);
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta notícia? Esta ação é irreversível.")) {
      if (!token) {
          alert('Você precisa estar logado para excluir uma notícia.');
          return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/news/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        alert("Notícia excluída com sucesso!");
        navigate('/');
      } catch (e) {
        console.error("Erro ao excluir notícia:", e);
        alert(`Falha ao excluir notícia: ${e.message}`);
      }
    }
  };

  if (loading) {
    return <p className="loading-message">Carregando detalhes da notícia...</p>;
  }

  if (error) {
    return <p className="message error">{error}</p>;
  }

  if (!newsItem) {
    return <p>Notícia não encontrada.</p>;
  }

  return (
    <div className="news-details-container">
      <h2>{newsItem.title}</h2>
      {/* IMAGEM MOVIDA PARA O TOPO AQUI */}
      {newsItem.imageUrl && (
        // Comentário movido para a linha acima da tag <img>
        // Adiciona o prefixo do backend para a URL da imagem
        <img src={`http://localhost:5000${newsItem.imageUrl}`} alt={newsItem.title} className="news-details-image" />
      )}
      <p><strong>Autor:</strong> {newsItem.author}</p>
      <p><strong>Categoria:</strong> {newsItem.category}</p>
      <p>{newsItem.content}</p>
      <small>Postado em: {new Date(newsItem.createdAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} | Última atualização: {new Date(newsItem.updatedAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</small>

      {isAdmin && (
        <div className="admin-actions">
          <Link to={`/edit/${newsItem._id}`} className="btn-warning" style={{marginRight: '10px'}}>
            Editar Notícia
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            Excluir Notícia
          </button>
        </div>
      )}

      <CommentForm newsId={newsItem._id} onCommentAdded={handleCommentAdded} />
      <CommentList newsId={newsItem._id} refreshTrigger={commentRefreshTrigger} />
    </div>
  );
}

export default NewsDetails;