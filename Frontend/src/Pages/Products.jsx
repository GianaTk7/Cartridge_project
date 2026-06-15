import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [error, setError] = useState('');
  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brand = params.get('brand');
    if (brand) {
      setSelectedBrand(brand);
      fetchProducts(brand);
    } else {
      fetchAllProducts();
    }
  }, [location.search]);

  const fetchProducts = async (brand) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/products?brand=${brand}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
const fetchAllProducts = async () => {
  setLoading(true);
  setError('');
  try {
    // Use the same BACKEND_URL pattern consistently
    const response = await fetch(`${BACKEND_URL}/api/products`);
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    // Parse JSON
    const data = await response.json();
    
    if (data.success) {
      setProducts(data.products);
    } else {
      setError(data.message || 'Failed to fetch products');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    setError('Cannot connect to backend. Make sure server is running on port 8000');
  } finally {
    setLoading(false);
  }
};

  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand);
    navigate(`/products?brand=${brand}`);
  };

  const brands = ['hp', 'canon', 'epson', 'brother', 'samsung', 'lexmark', 'xerox', 'dell', 'kyocera', 'ricoh', 'konica minolta', 'sharp'];

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
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
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <p>No products found for {selectedBrand.toUpperCase()}</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              {product.discount && (
                <div className="product-discount">-{product.discount}%</div>
              )}
              <div className="product-image">
                <img src={product.image || 'https://via.placeholder.com/500'} alt={product.name} />
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
                {product.compatiblePrinters && (
                  <p className="compatible-printers">
                    Compatible: {product.compatiblePrinters}
                  </p>
                )}
                <button className="add-to-cart-btn">Add to Cart</button>
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

        .products-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .back-btn {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          background: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .back-btn:hover {
          background: #0056b3;
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

        .product-discount {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ff4444;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 0.8rem;
          font-weight: bold;
          z-index: 1;
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

        .compatible-printers {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 1rem;
          font-style: italic;
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

        .error-message, .no-products {
          text-align: center;
          padding: 2rem;
          color: #ff4444;
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .products-page {
            padding: 1rem;
          }

          .back-btn {
            position: static;
            margin-bottom: 1rem;
            transform: none;
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