import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [error, setError] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [importForm, setImportForm] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: '',
    image: null
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const brands = ['hp', 'canon', 'epson', 'brother', 'samsung', 'lexmark', 'xerox', 'dell', 'kyocera', 'ricoh', 'konica minolta', 'sharp'];

  // Check authentication on mount
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/`);
        if (response.ok) {
          setConnectionStatus('connected');
          console.log('✅ Connected to backend at:', BACKEND_URL);
        } else {
          setConnectionStatus('error');
          console.error('❌ Backend returned error:', response.status);
        }
      } catch (err) {
        setConnectionStatus('error');
        console.error('❌ Cannot connect to backend at:', BACKEND_URL);
        console.error('Error details:', err);
        setError(`Cannot connect to backend at ${BACKEND_URL}. Please ensure the server is running.`);
      }
    };
    
    checkConnection();
  }, [BACKEND_URL]);

  // Fetch products by brand - DEFINED BEFORE useEffect THAT USES IT
  const fetchProducts = useCallback(async (brand) => {
    setLoading(true);
    setError('');
    
    try {
      console.log(`🔍 Fetching products for brand: ${brand}`);
      const response = await fetch(`${BACKEND_URL}/api/products?brand=${brand}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Products data:', data);

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(`Failed to fetch products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  // Fetch all products - DEFINED BEFORE useEffect THAT USES IT
  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔍 Fetching all products');
      const response = await fetch(`${BACKEND_URL}/api/products`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 All products data:', data);

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(`Cannot connect to backend at ${BACKEND_URL}. Please ensure the server is running.`);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  // Load products based on URL params - NOW AFTER function definitions
  useEffect(() => {
    if (connectionStatus === 'connected') {
      const params = new URLSearchParams(location.search);
      const brand = params.get('brand');

      if (brand) {
        setSelectedBrand(brand);
        fetchProducts(brand);
      } else {
        setSelectedBrand('');
        fetchAllProducts();
      }
    }
  }, [location.search, fetchProducts, fetchAllProducts, connectionStatus]);

  // Handle brand filter
  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand);
    navigate(`/products?brand=${brand}`);
  };

  // Handle import button click
  const handleImportClick = () => {
    if (isAuthenticated) {
      setShowImportModal(true);
    } else {
      navigate('/login');
    }
  };

  // Handle form input changes
  const handleImportFormChange = (e) => {
    const { name, value } = e.target;
    setImportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImportForm(prev => ({
      ...prev,
      image: file
    }));
  };

  // Handle form submission
  const handleImportSubmit = async (e) => {
    e.preventDefault();
    setImportLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        setError('Please login first');
        setImportLoading(false);
        return;
      }

      const formData = new FormData();
      Object.keys(importForm).forEach(key => {
        if (key !== 'image' && importForm[key]) {
          formData.append(key, importForm[key]);
        }
      });
      
      if (importForm.image) {
        formData.append('image', importForm.image);
      }

      console.log('📤 Importing product...');
      const response = await fetch(`${BACKEND_URL}/api/products/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      console.log('📥 Import response:', data);
      
      if (data.success) {
        setShowImportModal(false);
        setImportForm({
          name: '',
          brand: '',
          description: '',
          price: '',
          originalPrice: '',
          stock: '',
          category: '',
          image: null
        });
        
        if (selectedBrand) {
          fetchProducts(selectedBrand);
        } else {
          fetchAllProducts();
        }
        
        alert('Product imported successfully!');
      } else {
        setError(data.message || 'Failed to import product');
      }
    } catch (err) {
      console.error('❌ Import error:', err);
      setError(`Failed to import product: ${err.message}`);
    } finally {
      setImportLoading(false);
    }
  };

  // Import Modal Component
  const ImportModal = () => (
    <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
      <div className="modal-content import-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Import New Product</h2>
          <button className="modal-close" onClick={() => setShowImportModal(false)}>×</button>
        </div>
        
        <form onSubmit={handleImportSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={importForm.name}
                onChange={handleImportFormChange}
                placeholder="e.g., Canon PG-275 High-Yield Black"
                required
              />
            </div>
            <div className="form-group">
              <label>Brand *</label>
              <select
                name="brand"
                value={importForm.brand}
                onChange={handleImportFormChange}
                required
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={importForm.description}
              onChange={handleImportFormChange}
              placeholder="Product description"
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (R) *</label>
              <input
                type="number"
                name="price"
                value={importForm.price}
                onChange={handleImportFormChange}
                placeholder="1400"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Original Price (R)</label>
              <input
                type="number"
                name="originalPrice"
                value={importForm.originalPrice}
                onChange={handleImportFormChange}
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
                value={importForm.stock}
                onChange={handleImportFormChange}
                placeholder="25"
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={importForm.category}
                onChange={handleImportFormChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Ink Cartridge">Ink Cartridge</option>
                <option value="Toner Cartridge">Toner Cartridge</option>
                <option value="Printer">Printer</option>
                <option value="Accessory">Accessory</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Product Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {importForm.image && (
              <div className="file-preview">
                <p>Selected: {importForm.image.name}</p>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="submit-btn" disabled={importLoading}>
            {importLoading ? 'Importing...' : 'Import Product'}
          </button>
        </form>
      </div>
    </div>
  );

  // Show connection error if backend not reachable
  if (connectionStatus === 'error') {
    return (
      <div className="products-page">
        <div className="error-container">
          <h2>⚠️ Cannot Connect to Backend</h2>
          <p>Unable to reach the server at: <strong>{BACKEND_URL}</strong></p>
          <p>Please make sure:</p>
          <ul>
            <li>The FastAPI server is running (python main.py)</li>
            <li>The server is running on port 8000</li>
            <li>No firewall is blocking the connection</li>
          </ul>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <div className="header-actions">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <button className="import-btn" onClick={handleImportClick}>
            Import Product
          </button>
        </div>
        <h1>Our Products</h1>
        {selectedBrand && <h2>Showing: {selectedBrand.toUpperCase()} Products</h2>}
      </div>

      {/* Brand Filter Bar */}
      <div className="brand-filter">
        <button 
          className={`filter-btn ${!selectedBrand ? 'active' : ''}`}
          onClick={() => navigate('/products')}
        >
          All
        </button>
        {brands.map((brand) => (
          <button
            key={brand}
            className={`filter-btn ${selectedBrand === brand ? 'active' : ''}`}
            onClick={() => handleBrandFilter(brand)}
          >
            {brand.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <p>No products found {selectedBrand ? `for ${selectedBrand.toUpperCase()}` : ''}</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id || product.id} className="product-card">
              <div className="product-image">
                <img
                  src={
                    product.image
                      ? product.image.startsWith('http') 
                        ? product.image 
                        : `${BACKEND_URL}${product.image}`
                      : 'https://via.placeholder.com/500'
                  }
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/500';
                  }}
                />
              </div>
              <div className="product-info">
                <h3 className="product-brand">{product.brand}</h3>
                <h4 className="product-name">{product.name}</h4>
                <p className="product-description">{product.description}</p>
                <div className="product-price">
                  {product.originalPrice && (
                    <span className="original-price">R{product.originalPrice}</span>
                  )}
                  <span className="current-price">R{product.price}</span>
                </div>
                <button 
                  className="add-to-cart-btn" 
                  onClick={() => navigate(`/product/${product._id || product.id}`)}
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && <ImportModal />}

      <style>{`
        .products-page {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 2rem;
        }

        .error-container {
          max-width: 600px;
          margin: 4rem auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
        }

        .error-container h2 {
          color: #dc3545;
          margin-bottom: 1rem;
        }

        .error-container ul {
          text-align: left;
          margin: 1rem auto;
          max-width: 400px;
        }

        .error-container li {
          margin: 0.5rem 0;
        }

        .retry-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
          transition: background 0.3s;
        }

        .retry-btn:hover {
          background: #0056b3;
        }

        .products-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0 1rem;
        }

        .back-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s;
        }

        .back-btn:hover {
          background: #0056b3;
        }

        .import-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          transition: background 0.3s;
        }

        .import-btn:hover {
          background: #218838;
        }

        .products-header h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .products-header h2 {
          font-size: 1.2rem;
          color: #666;
        }

        .brand-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 2rem;
          padding: 1rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .filter-btn:hover {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .filter-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .product-image {
          width: 100%;
          height: 250px;
          overflow: hidden;
          background: #f0f0f0;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-brand {
          font-size: 0.9rem;
          color: #007bff;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .product-name {
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        .product-description {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .product-price {
          margin-bottom: 1rem;
        }

        .original-price {
          font-size: 0.9rem;
          color: #999;
          text-decoration: line-through;
          margin-right: 0.5rem;
        }

        .current-price {
          font-size: 1.3rem;
          color: #ff4444;
          font-weight: bold;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 0.8rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.3s;
        }

        .add-to-cart-btn:hover {
          background: #0056b3;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }

        .import-modal {
          max-width: 900px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .modal-header h2 {
          margin: 0;
          color: #333;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #999;
          transition: color 0.3s;
        }

        .modal-close:hover {
          color: #333;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
        }

        .file-preview {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 5px;
        }

        .submit-btn {
          width: 100%;
          padding: 0.75rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
          margin-top: 1rem;
        }

        .submit-btn:hover:not(:disabled) {
          background: #218838;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          color: #dc3545;
          padding: 0.5rem;
          margin-bottom: 1rem;
          background: #f8d7da;
          border-radius: 5px;
        }

        .no-products {
          text-align: center;
          padding: 3rem;
          color: #666;
          font-size: 1.2rem;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .products-page {
            padding: 1rem;
          }

          .header-actions {
            flex-direction: column;
            gap: 0.5rem;
          }

          .back-btn,
          .import-btn {
            width: 100%;
          }

          .products-header h1 {
            font-size: 1.8rem;
          }

          .brand-filter {
            gap: 0.3rem;
          }

          .filter-btn {
            padding: 0.3rem 0.8rem;
            font-size: 0.8rem;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .modal-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Products;