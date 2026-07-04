import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Uploadproduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: '',
    tags: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const brands = ['hp', 'canon', 'epson', 'brother', 'samsung', 'lexmark', 'xerox', 'dell', 'kyocera', 'ricoh', 'konica minolta', 'sharp'];
  const categories = ['Ink Cartridge', 'Toner Cartridge', 'Printer', 'Accessory'];

  // Check authentication
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WEBP, or SVG)');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be less than 5MB');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    setError('');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name?.trim()) {
        setError('Product name is required');
        setLoading(false);
        return;
      }
      
      if (!formData.brand?.trim()) {
        setError('Brand is required');
        setLoading(false);
        return;
      }
      
      if (!formData.price || formData.price === '') {
        setError('Price is required');
        setLoading(false);
        return;
      }
      
      if (!formData.stock || formData.stock === '') {
        setError('Stock is required');
        setLoading(false);
        return;
      }
      
      if (!formData.category?.trim()) {
        setError('Category is required');
        setLoading(false);
        return;
      }

      if (!selectedFile) {
        setError('Please select an image');
        setLoading(false);
        return;
      }

      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('brand', formData.brand.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', parseFloat(formData.price) || 0);
      formDataToSend.append('originalPrice', parseFloat(formData.originalPrice) || 0);
      formDataToSend.append('stock', parseInt(formData.stock) || 0);
      formDataToSend.append('category', formData.category.trim());
      formDataToSend.append('Tags', formData.tags?.trim() || '');
      formDataToSend.append('image', selectedFile);

      const response = await fetch(`${BACKEND_URL}/api/products/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data.success) {
        setSuccess('Product imported successfully!');
        
        setFormData({
          name: '',
          brand: '',
          description: '',
          price: '',
          originalPrice: '',
          stock: '',
          category: '',
          tags: ''
        });
        setSelectedFile(null);
        setImagePreview(null);
        
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
        setTimeout(() => {
          setSuccess('');
          navigate('/products');
        }, 2000);
      } else {
        setError(data.message || 'Failed to import product');
      }
    } catch (err) {
      console.error(' Upload error:', err);
      setError(`Failed to import product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: '',
      category: '',
      tags: ''
    });
    setSelectedFile(null);
    setImagePreview(null);
    setError('');
    setSuccess('');
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <button className="back-btn" onClick={() => navigate('/products')}>
            ← Back to Products
          </button>
          <h1>Import New Product</h1>
          <button className="reset-btn" onClick={resetForm}>
            Reset Form
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
          </div>
        )}

        {success && (
          <div className="alert alert-success">
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form" noValidate>
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Canon PG-275 High-Yield Black"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Brand *</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product description"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., best-seller, new, premium"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-row">
                <div className="form-group">
                  <label>Price (R) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="1400"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Original Price (R)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="3200"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="25"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Product Image *</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    onChange={handleFileChange}
                    required
                    className="file-input"
                  />
                  <label htmlFor="image-upload" className="file-label">
                    <span>Choose an image</span>
                    <span className="file-types">(JPEG, PNG, GIF, WEBP, SVG)</span>
                  </label>
                  {selectedFile && (
                    <div className="file-info">
                      <span>📎 {selectedFile.name}</span>
                      <span className="file-size">
                        ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Product preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => {
                      setSelectedFile(null);
                      setImagePreview(null);
                      const fileInput = document.querySelector('#image-upload');
                      if (fileInput) fileInput.value = '';
                    }}
                  >
                    × Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/products')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Importing...
                </>
              ) : (
                ' Import Product'
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .upload-page {
          min-height: 100vh;
          background: #f5f6fa;
          padding: 2rem;
        }

        .upload-container {
          max-width: 1100px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
        }

        .upload-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .upload-header h1 {
          font-size: 1.8rem;
          color: #2c3e50;
          margin: 0;
        }

        .back-btn {
          padding: 0.5rem 1.5rem;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: #2980b9;
          transform: translateY(-2px);
        }

        .reset-btn {
          padding: 0.5rem 1.5rem;
          background: #95a5a6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .reset-btn:hover {
          background: #7f8c8d;
          transform: translateY(-2px);
        }

        .alert {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
        }

        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .alert-success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
          width: 100%;
          background: #fafafa;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #3498db;
          outline: none;
          background: white;
          box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
        }

        .form-group input:hover,
        .form-group select:hover,
        .form-group textarea:hover {
          border-color: #b0b0b0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .file-upload-area {
          border: 2px dashed #d0d0d0;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          background: #fafafa;
        }

        .file-upload-area:hover {
          border-color: #3498db;
          background: #f0f8ff;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          top: 0;
          left: 0;
        }

        .file-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .file-icon {
          font-size: 2.5rem;
        }

        .file-types {
          font-size: 0.8rem;
          color: #7f8c8d;
        }

        .file-info {
          margin-top: 0.75rem;
          padding: 0.5rem;
          background: #e8f5e9;
          border-radius: 6px;
          color: #2e7d32;
          font-size: 0.95rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .file-size {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .image-preview {
          position: relative;
          margin-top: 1rem;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e0e0e0;
          max-width: 300px;
        }

        .image-preview img {
          width: 100%;
          height: auto;
          display: block;
        }

        .remove-image-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(231, 76, 60, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .remove-image-btn:hover {
          background: #c0392b;
          transform: scale(1.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f0f0f0;
        }

        .cancel-btn {
          padding: 0.75rem 2rem;
          background: #e0e0e0;
          color: #2c3e50;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
        }

        .cancel-btn:hover {
          background: #d0d0d0;
          transform: translateY(-2px);
        }

        .submit-btn {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .upload-page {
            padding: 1rem;
          }

          .upload-container {
            padding: 1.5rem;
          }

          .upload-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .upload-header h1 {
            font-size: 1.4rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Uploadproduct;