import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [importForm, setImportForm] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    compatiblePrinters: '',
    stock: '',
    category: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adminProfile, setAdminProfile] = useState(null);
  
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const brands = ['hp', 'canon', 'epson', 'brother', 'samsung', 'lexmark', 'xerox', 'dell', 'kyocera', 'ricoh', 'konica minolta', 'sharp'];

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token with backend
      verifyToken(token);
    }
  }, []);

  // Verify token with backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        setShowLogin(false);
        setAdminProfile(data.admin);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      localStorage.removeItem('adminToken');
    }
  };

  // Handle admin login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', loginCredentials.username);
      formData.append('password', loginCredentials.password);

      const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setShowLogin(false);
        setAdminProfile(data.admin);
        setLoginCredentials({ username: '', password: '' });
        setSuccess('Login successful!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setLoginError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setShowLogin(true);
    setAdminProfile(null);
    setSuccess('Logged out successfully');
    setTimeout(() => setSuccess(''), 3000);
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
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setImportForm(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  // Handle form submission
  const handleImportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', importForm.name);
      formData.append('brand', importForm.brand);
      formData.append('description', importForm.description);
      formData.append('price', importForm.price);
      formData.append('originalPrice', importForm.originalPrice);
      formData.append('discount', importForm.discount || 0);
      formData.append('compatiblePrinters', importForm.compatiblePrinters);
      formData.append('stock', importForm.stock);
      formData.append('category', importForm.category);
      if (importForm.image) {
        formData.append('image', importForm.image);
      } else {
        setError('Please select an image');
        setLoading(false);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/products/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('✅ Product imported successfully!');
        setImportForm({
          name: '',
          brand: '',
          description: '',
          price: '',
          originalPrice: '',
          discount: '',
          compatiblePrinters: '',
          stock: '',
          category: '',
          image: null
        });
        document.getElementById('image-input').value = '';
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.message || 'Failed to import product');
      }
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Login Form
  const LoginForm = () => (
    <div className="admin-container">
      <div className="login-box">
        <h2> Admin Login</h2>
        <p className="login-subtitle">Please login to access the admin panel</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username or Email</label>
            <input
              type="text"
              value={loginCredentials.username}
              onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})}
              placeholder="Enter username or email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={loginCredentials.password}
              onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
              placeholder="Enter password"
              required
            />
          </div>
          {loginError && <div className="error-message">{loginError}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button type="button" className="back-btn" onClick={() => navigate('/products')}>
            ← Back to Products
          </button>
        </form>
      </div>
    </div>
  );

  // Import Form
  const ImportForm = () => (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-actions">
          <button className="back-btn" onClick={() => navigate('/products')}>
            ← Back to Products
          </button>
          <div className="admin-info">
            <span className="admin-welcome"> Welcome, {adminProfile?.username || 'Admin'}!</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <h1>Import New Product</h1>
        <p>Fill in the details below to add a new product to the store</p>
      </div>

      {success && <div className="success-message success-banner">{success}</div>}
      {error && <div className="error-message error-banner">{error}</div>}

      <div className="import-form-container">
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
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Original Price (R) *</label>
              <input
                type="number"
                name="originalPrice"
                value={importForm.originalPrice}
                onChange={handleImportFormChange}
                placeholder="3200"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={importForm.discount}
                onChange={handleImportFormChange}
                placeholder="56"
                min="0"
                max="100"
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
                min="0"
                required
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
                <option value="Ink Bottle">Ink Bottle</option>
                <option value="Printer">Printer</option>
                <option value="Accessory">Accessory</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Compatible Printers</label>
            <input
              type="text"
              name="compatiblePrinters"
              value={importForm.compatiblePrinters}
              onChange={handleImportFormChange}
              placeholder="Canon Pixma TS3120, TS5120, TS6120"
            />
          </div>

          <div className="form-group">
            <label>Product Image *</label>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {importForm.image && (
              <div className="file-preview">
                <p>📷 Selected: {importForm.image.name}</p>
                <p className="file-size">
                  Size: {(importForm.image.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
            <p className="help-text">Accepted formats: JPG, PNG, GIF, WEBP (Max 5MB)</p>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Importing...' : '📥 Import Product'}
            </button>
            <button type="reset" className="reset-btn" onClick={() => {
              setImportForm({
                name: '',
                brand: '',
                description: '',
                price: '',
                originalPrice: '',
                discount: '',
                compatiblePrinters: '',
                stock: '',
                category: '',
                image: null
              });
              document.getElementById('image-input').value = '';
            }}>
              Clear Form
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .admin-container {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 2rem;
        }

        .login-box {
          max-width: 400px;
          margin: 100px auto;
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .login-box h2 {
          text-align: center;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 2rem;
        }

        .admin-header {
          text-align: center;
          margin-bottom: 2rem;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .admin-header h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .admin-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-welcome {
          font-weight: 600;
          color: #28a745;
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

        .logout-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s;
        }

        .logout-btn:hover {
          background: #c82333;
        }

        .import-form-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
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
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }

        .file-preview {
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 5px;
          border-left: 4px solid #28a745;
        }

        .file-preview p {
          margin: 0.25rem 0;
        }

        .file-size {
          font-size: 0.85rem;
          color: #666;
        }

        .help-text {
          font-size: 0.85rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .submit-btn {
          flex: 1;
          padding: 0.75rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #218838;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .reset-btn {
          padding: 0.75rem 2rem;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }

        .reset-btn:hover {
          background: #5a6268;
        }

        .error-message {
          color: #dc3545;
          padding: 0.75rem;
          margin-bottom: 1rem;
          background: #f8d7da;
          border-radius: 5px;
          border: 1px solid #f5c6cb;
        }

        .success-message {
          color: #155724;
          padding: 0.75rem;
          margin-bottom: 1rem;
          background: #d4edda;
          border-radius: 5px;
          border: 1px solid #c3e6cb;
        }

        .success-banner, .error-banner {
          max-width: 900px;
          margin: 0 auto 1rem auto;
        }

        @media (max-width: 768px) {
          .admin-container {
            padding: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .import-form-container {
            padding: 1.5rem;
          }

          .admin-header h1 {
            font-size: 1.8rem;
          }

          .header-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .admin-info {
            flex-direction: column;
            width: 100%;
          }

          .admin-info button {
            width: 100%;
          }

          .header-actions .back-btn {
            width: 100%;
          }

          .form-actions {
            flex-direction: column;
          }

          .login-box {
            margin: 50px auto;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );

  return (
    <>
      {!isAuthenticated || showLogin ? <LoginForm /> : <ImportForm />}
    </>
  );
};

export default Admin;