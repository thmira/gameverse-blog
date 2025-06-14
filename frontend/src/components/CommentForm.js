import React, { useState } from 'react';

function CommentForm({ newsId, onCommentAdded }) {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setError('O comentário não pode estar vazio.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const newComment = {
      newsId: newsId,
      text: commentText,
      author: authorName.trim() || 'Anônimo'
    };

    try {
      const response = await fetch('http://localhost:5000/api/comments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      setCommentText('');
      setAuthorName('');
      if (onCommentAdded) {
        onCommentAdded();
      }

    } catch (e) {
      console.error("Erro ao enviar comentário:", e);
      setError(`Falha ao enviar comentário: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-form-container"> {/* Classe para o container do form de comentários */}
      <h3>Deixe seu Comentário</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="authorName">Seu Nome (Opcional):</label>
          <input
            type="text"
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="commentText">Comentário:</label>
          <textarea
            id="commentText"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows="4"
            required
            disabled={isSubmitting}
          ></textarea>
        </div>
        {error && <p className="message error">{error}</p>}
        <button
          type="submit"
          className="btn-primary" /* Usando classe CSS */
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Comentar'}
        </button>
      </form>
    </div>
  );
}

export default CommentForm;