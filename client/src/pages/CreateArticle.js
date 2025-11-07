import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import ArticleEditor from '../components/ArticleEditor';
import './CreateArticle.css';

const CreateArticle = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [isAuthenticated, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
    }
  };

  const handleSubmit = async (articleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/articles', articleData);
      navigate(`/article/${response.data.article.id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create article');
      return { success: false };
    } finally {
      setLoading(false);
    }
    return { success: true };
  };

  return (
    <div className="create-article">
      <div className="container">
        <h1 className="page-title">Create New Article</h1>
        {error && <div className="error">{error}</div>}
        <ArticleEditor
          onSubmit={handleSubmit}
          categories={categories}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CreateArticle;



