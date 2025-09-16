import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模拟登录过程
    setTimeout(() => {
      setIsLoading(false);
      // 直接跳转到管理后台
      router.push('/admin');
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <div className="logo-icon">✂️</div>
              <h1>TailorShop</h1>
            </div>
            <h2>管理后台登录</h2>
            <p>请输入您的管理员凭据</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="请输入用户名"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="请输入密码"
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>© 2024 TailorShop. 保留所有权利。</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }

        .login-container {
          width: 100%;
          max-width: 400px;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .logo-icon {
          font-size: 32px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .logo h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }

        .login-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 8px 0;
        }

        .login-header p {
          color: #718096;
          font-size: 14px;
          margin: 0;
        }

        .login-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #4a5568;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #fff;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input:disabled {
          background-color: #f7fafc;
          cursor: not-allowed;
        }

        .login-btn {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .login-footer p {
          color: #a0aec0;
          font-size: 12px;
          margin: 0;
        }

        /* 响应式设计 */
        @media (max-width: 480px) {
          .login-page {
            padding: 16px;
          }
          
          .login-card {
            padding: 24px;
          }
          
          .logo h1 {
            font-size: 24px;
          }
          
          .login-header h2 {
            font-size: 20px;
          }
        }

        /* 深色模式支持 */
        @media (prefers-color-scheme: dark) {
          .login-card {
            background: rgba(26, 32, 44, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .logo h1 {
            color: #f7fafc;
          }
          
          .login-header h2 {
            color: #e2e8f0;
          }
          
          .login-header p {
            color: #a0aec0;
          }
          
          .form-group label {
            color: #e2e8f0;
          }
          
          .form-group input {
            background: #2d3748;
            border-color: #4a5568;
            color: #f7fafc;
          }
          
          .form-group input:focus {
            border-color: #667eea;
          }
          
          .form-group input:disabled {
            background-color: #1a202c;
          }
          
          .login-footer {
            border-top-color: #4a5568;
          }
          
          .login-footer p {
            color: #718096;
          }
        }
      `}</style>
    </div>
  );
}
