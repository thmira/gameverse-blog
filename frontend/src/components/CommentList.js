import React, { useState, useEffect } from 'react';

function CommentList({ newsId, refreshTrigger }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/comments/${newsId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setComments(data);
      } catch (e) {
        console.error("Erro ao buscar comentários:", e);
        setError("Não foi possível carregar os comentários.");
      } finally {
        setLoading(false);
      }
    };

    if (newsId) {
      setLoading(true);
      fetchComments();
    }
  }, [newsId, refreshTrigger]);

  if (loading) {
    return <p className="loading-message">Carregando comentários...</p>;
  }

  if (error) {
    return <p className="message error">{error}</p>;
  }

  return (
    <div className="comment-list-container"> {/* Classe para o container da lista de comentários */}
      <h3>Comentários ({comments.length})</h3>
      {comments.length === 0 ? (
        <p>Seja o primeiro a comentar!</p>
      ) : (
        <ul className="comment-list"> {/* Classe para a lista UL */}
          {comments.map(comment => (
            <li key={comment._id} className="comment-item"> {/* Classe para cada item LI */}
              <p><strong>{comment.author}</strong> - <small>{new Date(comment.createdAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</small></p>
              <p>{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentList;