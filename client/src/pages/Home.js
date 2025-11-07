import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import ArticleList from '../components/ArticleList';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    autoFetchNews();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [search, selectedCategory, currentPage]);

  const autoFetchNews = async () => {
    try {
      const response = await api.get('/auto-fetch-news');
      if (response.data && (response.data.imported > 0 || response.data.skipped > 0)) {
        setTimeout(() => {
          fetchArticles();
        }, 1000);
      }
    } catch (error) {
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        per_page: 10,
      };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;

      const response = await api.get('/articles', { params });
      const articlesData = Array.isArray(response.data) ? response.data : [];
      setArticles(articlesData);
      const perPage = 10;
      const totalArticles = articlesData.length;
      setLastPage(Math.max(1, Math.ceil(totalArticles / perPage)));
    } catch (error) {
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchArticles();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="page-title">Latest News</h1>
        </div>

        <div className="filters">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              className="input"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="input"
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ minWidth: '150px' }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        {error && <div className="error">{error}</div>}

        <ArticleList articles={articles} loading={loading} />

        {!loading && lastPage > 1 && (
          <div className="pagination">
            <button
              className="btn btn-secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {lastPage}
            </span>
            <button
              className="btn btn-primary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;



