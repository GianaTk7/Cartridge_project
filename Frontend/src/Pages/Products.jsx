import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const brands = ['hp', 'canon', 'epson', 'brother', 'samsung', 'lexmark', 'xerox', 'dell', 'kyocera', 'ricoh', 'konica minolta', 'sharp'];

  // Check authentication for import button
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
          console.log(' Connected to backend at:', BACKEND_URL);
        } else {
          setConnectionStatus('error');
          console.error(' Backend returned error:', response.status);
        }
      } catch (err) {
        setConnectionStatus('error');
        console.error(' Cannot connect to backend at:', BACKEND_URL);
        setError(`Cannot connect to backend at ${BACKEND_URL}. Please ensure the server is running.`);
      }
    };
    
    checkConnection();
  }, [BACKEND_URL]);

  // Fetch products by brand
  const fetchProducts = useCallback(async (brand) => {
    setLoading(true);
    setError('');
    
    try {
      console.log(` Fetching products for brand: ${brand}`);
      const response = await fetch(`${BACKEND_URL}/api/products?brand=${brand}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(' Products data:', data);

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error(' Fetch error:', err);
      setError(`Failed to fetch products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      console.log(' Fetching all products');
      const response = await fetch(`${BACKEND_URL}/api/products`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(' All products data:', data);

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error(' Fetch error:', err);
      setError(`Cannot connect to backend at ${BACKEND_URL}. Please ensure the server is running.`);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  // Load products based on URL params
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

  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand);
    navigate(`/products?brand=${brand}`);
  };

const handleImportClick = () => {
  const token = sessionStorage.getItem("adminToken");

  console.log("adminToken:", token);

  if (token) {
    console.log("Token exists -> Upload page");
    navigate("/uploadproduct");
  } else {
    console.log("No token -> Login page");
    sessionStorage.setItem("redirectAfterLogin", "/uploadproduct");
    navigate("/login");
  }
};

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (connectionStatus === 'error') {
    return (
      <div className="products-page">
        <div className="error-container">
          <h2> Connection Error</h2>
          <p>Cannot connect to backend at {BACKEND_URL}</p>
          <p>Please make sure:</p>
          <ul>
            <li>Backend server is running</li>
            <li>Server is accessible at {BACKEND_URL}</li>
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
+  
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
                {product.originalPrice > 0 && (
  <span className="original-price">R{product.originalPrice}</span>
)}
                  <span className="current-price">R{product.price}</span>
                </div>
                <button 
                  className="view-product-btn" 
                  onClick={() => handleViewProduct(product._id || product.id)}
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
  background: transparent;
  border: none;
  color: #007bff;

  font-size: 42px;
  font-weight: 300;
  line-height: 1;

  cursor: pointer;
  padding: 0;
  margin: 0;

  transition: all 0.2s ease;
}

.import-btn:hover {
  color: #0056b3;
  transform: scale(1.15);
}

.import-btn:focus {
  outline: none;
}

.import-btn:active {
  transform: scale(0.95);
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
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

        .view-product-btn {
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

        .view-product-btn:hover {
          background: #0056b3;
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
        }
      `}</style>
    </div>
  );
};

export default Products;