import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/news');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNews(data);
      } catch (e) {
        console.error("Erro ao buscar notícias:", e);
        setError("Não foi possível carregar as notícias. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p className="loading-message">Carregando notícias...</p>;
  }

  if (error) {
    return <p className="message error">{error}</p>;
  }

  return (
    <div className="news-list">
      <h2>Últimas Notícias do GameVerse</h2>
      {news.length === 0 ? (
        <p>Nenhuma notícia encontrada. Que tal adicionar uma?</p>
      ) : (
        <ul>
          {news.map(item => (
            <li key={item._id} className="news-item">
             
              {item.imageUrl && (
                <img src={`http://localhost:5000${item.imageUrl}`} alt={item.title} />
              )}
            
              <div className="content-wrapper">
                  <h3>
                    <Link to={`/news/${item._id}`}>{item.title}</Link>
                  </h3>
                  <p><strong>Autor:</strong> {item.author}</p>
                  <p><strong>Categoria:</strong> {item.category}</p>
                  <p>{item.content.substring(0, 150)}...</p> {/* Reduzi para um resumo mais curto */}
                  <small>Postado em: {new Date(item.createdAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NewsList;