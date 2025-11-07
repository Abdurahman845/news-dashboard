import React, { useState } from 'react';
import './ArticleEditor.css';

const ArticleEditor = ({ onSubmit, categories, loading, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    image_url: initialData?.image_url || '',
    category_id: initialData?.category_id || '',
    published_at: initialData?.published_at
      ? new Date(initialData.published_at).toISOString().split('T')[0]
      : '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const articleData = {
      ...formData,
      published_at: formData.published_at || null,
    };

    const result = await onSubmit(articleData);
    if (!result?.success) {
      setErrors({ submit: result?.error || 'Failed to save article' });
    }
  };

  return (
    <div className="article-editor">
      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            className="input"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter article title"
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            className="textarea"
            rows="3"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Brief summary of the article (optional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            className="textarea"
            rows="15"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your article content here..."
            required
          />
          {errors.content && (
            <span className="error-text">{errors.content}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category_id">Category *</label>
            <select
              id="category_id"
              name="category_id"
              className="input"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <span className="error-text">{errors.category_id}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              className="input"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="published_at">Publish Date</label>
          <input
            type="date"
            id="published_at"
            name="published_at"
            className="input"
            value={formData.published_at}
            onChange={handleChange}
          />
          <small className="help-text">
            Leave empty to save as draft
          </small>
        </div>

        {errors.submit && (
          <div className="error">{errors.submit}</div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;



