import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import ArticleEditor from '../components/ArticleEditor';
import './EditArticle.css';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchArticle();
    fetchCategories();
  }, [id, isAuthenticated, navigate]);

  const fetchArticle = async () => {
    try {
      const response = await api.get(`/articles/${id}`);
      const articleData = response.data;
      
      if (user && articleData.user_id !== user.id) {
        navigate('/');
        return;
      }
      
      setArticle(articleData);
    } catch (error) {
      setError('Article not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
    }
  };

  const handleSubmit = async (articleData) => {
    setSaving(true);
    setError(null);
    try {
      await api.put(`/articles/${id}`, articleData);
      navigate(`/article/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update article');
      return { success: false };
    } finally {
      setSaving(false);
    }
    return { success: true };
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="edit-article">
      <div className="container">
        <h1 className="page-title">Edit Article</h1>
        {error && <div className="error">{error}</div>}
        <ArticleEditor
          onSubmit={handleSubmit}
          categories={categories}
          loading={saving}
          initialData={article}
        />
      </div>
    </div>
  );
};

export default EditArticle;



