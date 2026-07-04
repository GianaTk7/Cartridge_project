import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Productsdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';


const fetchProduct = useCallback(async () => {
  setLoading(true);

  try {
    const response = await fetch(`${BACKEND_URL}/api/products/${id}`);
    const data = await response.json();

    if (data.success) {
      setProduct(data.product);
    } else {
      setError(data.message || 'Product not found');
    }
  } catch (err) {
    console.error('Error fetching product:', err);
    setError('Failed to fetch product details');
  } finally {
    setLoading(false);
  }
}, [BACKEND_URL, id]);

useEffect(() => {
  fetchProduct();
}, [fetchProduct]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error || 'Product not found'}</p>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  return (
    <div className="view-product-page">
      <button className="back-btn" onClick={() => navigate('/products')}>
        ← Back to Products
      </button>
      
      <div className="product-detail-container">
        <div className="product-image-section">
          <img
            src={
              product.image
                ? `${BACKEND_URL}${product.image}`
                : 'https://via.placeholder.com/500'
            }
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/500?text=No+Image';
            }}
          />
        </div>
        
        <div className="product-info-section">
          <h1>{product.name}</h1>
          
          <div className="brand-category">
            <span className="brand">{product.brand?.toUpperCase()}</span>
            {product.category && (
              <span className="category-badge">{product.category}</span>
            )}
          </div>
          
          {/* Price Section with Original Price */}
          <div className="price-section">
            {product.originalPrice && product.originalPrice > 0 && (
              <span className="original-price">R{product.originalPrice?.toFixed(2)}</span>
            )}
            <span className="current-price">R{product.price?.toFixed(2)}</span>
          </div>
          
          <div className="stock-info">
            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
              {product.stock > 0 ? `✓ ${product.stock} units in stock` : '✗ Out of stock'}
            </span>
          </div>
          
          {/* Tags Section - Replaces compatiblePrinters */}
          {product.Tags && (
            <div className="tags-section">
              <h3>Tags:</h3>
              <div className="tags-container">
                {product.Tags.split(',').map((tag, index) => (
                  <span key={index} className="tag">{tag.trim()}</span>
                ))}
              </div>
            </div>
          )}
          
          <div className="description">
            <h3>Description:</h3>
            <p>{product.description}</p>
          </div>
          
          <button className="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>

      <style>{`
        .view-product-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          background: #f5f7fa;
        }

        .back-btn {
          padding: 0.6rem 1.5rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 2rem;
          transition: background 0.3s;
        }

        .back-btn:hover {
          background: #0056b3;
        }

        .product-detail-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .product-image-section {
          width: 100%;
          height: 400px;
          overflow: hidden;
          border-radius: 8px;
          background: #f0f0f0;
        }

        .product-image-section img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .product-info-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .product-info-section h1 {
          margin: 0;
          font-size: 2rem;
          color: #333;
        }

        .brand-category {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .brand {
          color: #007bff;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.9rem;
        }

        .category-badge {
          background: #6c757d;
          color: white;
          padding: 0.2rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .price-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0.5rem 0;
          flex-wrap: wrap;
        }

        .original-price {
          font-size: 1.5rem;
          color: #999;
          text-decoration: line-through;
          text-decoration-color: #dc3545;
          text-decoration-thickness: 2px;
        }

        .current-price {
          font-size: 2rem;
          font-weight: bold;
          color: #28a745;
        }

        .stock-info {
          margin: 0.5rem 0;
        }

        .in-stock {
          color: #28a745;
          font-weight: 600;
        }

        .out-of-stock {
          color: #dc3545;
          font-weight: 600;
        }

        .tags-section {
          margin: 0.5rem 0;
        }

        .tags-section h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 1rem;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: #e9ecef;
          color: #495057;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
        }

        .description {
          margin: 0.5rem 0;
        }

        .description h3 {
          margin: 0 0 0.3rem 0;
          color: #333;
          font-size: 1rem;
        }

        .description p {
          margin: 0;
          color: #666;
          line-height: 1.6;
        }

        .add-to-cart-btn {
          padding: 1rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
          margin-top: 1rem;
        }

        .add-to-cart-btn:hover {
          background: #218838;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
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

        .error-container {
          text-align: center;
          padding: 3rem;
          min-height: 100vh;
        }

        .error-container h2 {
          color: #dc3545;
        }

        .error-container button {
          padding: 0.6rem 1.5rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .product-detail-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .product-image-section {
            height: 300px;
          }

          .product-info-section h1 {
            font-size: 1.5rem;
          }

          .current-price {
            font-size: 1.5rem;
          }

          .original-price {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Productsdetails;