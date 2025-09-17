import React from 'react';
import { getServerSession } from 'next-auth/next';
import { signOut } from 'next-auth/react';
import AppointmentsTab from '../components/AppointmentsTab';
import BlogTab from '../components/BlogTab';
import ImagesTab from '../components/ImagesTab';

// 服务端重定向检查
export async function getServerSideProps(context) {
  const { getServerSession } = await import('next-auth/next');
  
  // 使用完整的 NextAuth 配置
  const session = await getServerSession(context.req, context.res, {
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-this-in-production",
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.username = user.username
          token.role = user.role
        }
        return token
      },
      async session({ session, token }) {
        if (token) {
          session.user.id = token.sub
          session.user.username = token.username
          session.user.role = token.role
        }
        return session
      }
    },
    session: {
      strategy: 'jwt',
      maxAge: 24 * 60 * 60, // 24小时
    },
    jwt: {
      maxAge: 24 * 60 * 60, // 24小时
    },
  });

  console.log('服务端认证检查 - Session:', session ? '存在' : '不存在');

  if (!session) {
    console.log('未找到会话，重定向到登录页面');
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  console.log('找到有效会话，用户:', session.user?.username || session.user?.email);

  // 清理 session 数据，确保可以序列化
  const cleanSession = {
    ...session,
    user: {
      ...session.user,
      name: session.user?.name || null,
      email: session.user?.email || null,
      image: session.user?.image || null,
    }
  };

  return {
    props: { session: cleanSession },
  };
}

export default function AdminHome({ session }) {
  // 状态管理
  const [activeTab, setActiveTab] = React.useState('appointments');

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="page">
      <header className="header">
        <div className="container nav">
          <div className="brand">TailorShop Admin</div>
          <div className="user-info">
            <span className="welcome-text">
              欢迎，{session?.user?.username || session?.user?.email}
            </span>
            <button onClick={handleSignOut} className="signout-btn">
              登出
            </button>
          </div>
        </div>
      </header>

      <main className="container main">
        <h1>管理后台</h1>
        <div className="grid">
          <div className={`card ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            <h3>预约信息</h3>
            <p>管理用户数据一目了然。</p>
          </div>
          <div className={`card ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}>
            <h3>博客管理</h3>
            <p>上传和管理店铺日常博客内容。</p>
          </div>
          <div className={`card ${activeTab === 'images' ? 'active' : ''}`} onClick={() => setActiveTab('images')}>
            <h3>图片管理</h3>
            <p>上传和管理主页轮播图片。</p>
          </div>
        </div>

        {/* 动态内容区域 */}
        <div className="content-section">
          {activeTab === 'appointments' && <AppointmentsTab />}
          {activeTab === 'blog' && <BlogTab />}
          {activeTab === 'images' && <ImagesTab />}
        </div>
      </main>

      <style jsx>{`
        .page { color: #0f172a; background: #ffffff; }
        .container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
        .header { border-bottom: 1px solid #e2e8f0; }
        .nav { display: flex; align-items: center; justify-content: space-between; height: 60px; }
        .brand { font-weight: 700; }
        .user-info { display: flex; align-items: center; gap: 16px; }
        .welcome-text { color: #64748b; font-size: 14px; }
        .signout-btn { 
          background-color: #ef4444; 
          color: white; 
          border: none; 
          padding: 8px 16px; 
          border-radius: 6px; 
          font-size: 14px; 
          cursor: pointer; 
          transition: background-color 0.2s;
        }
        .signout-btn:hover { background-color: #dc2626; }
        .main { padding: 24px 0; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 12px; }
        .card { 
          display: block; 
          padding: 16px; 
          border: 1px solid #e2e8f0; 
          border-radius: 10px; 
          text-decoration: none; 
          color: inherit; 
          background: #fff; 
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .card:hover { border-color: #0f172a; }
        .card.active { 
          border-color: #3b82f6; 
          background-color: #eff6ff; 
          box-shadow: 0 0 0 1px #3b82f6;
        }
        
        /* 内容区域样式 */
        .content-section { margin-top: 40px; }
        .content-section h2 { margin-bottom: 20px; font-size: 1.5rem; font-weight: 600; color: #0f172a; }
        
        /* 内容占位符样式 */
        .content-placeholder { 
          padding: 24px; 
          background: #f8fafc; 
          border: 1px solid #e2e8f0; 
          border-radius: 10px; 
          line-height: 1.6;
        }
        .content-placeholder p { margin-bottom: 12px; color: #475569; }
        .content-placeholder ul { margin: 16px 0; padding-left: 20px; }
        .content-placeholder li { margin-bottom: 8px; color: #64748b; }
        .action-buttons { 
          margin-top: 24px; 
          display: flex; 
          gap: 12px; 
          flex-wrap: wrap; 
        }
        .primary-btn { 
          background-color: #3b82f6; 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 8px; 
          font-size: 0.875rem; 
          font-weight: 500; 
          cursor: pointer; 
          transition: background-color 0.2s;
        }
        .primary-btn:hover { background-color: #2563eb; }
        .secondary-btn { 
          background-color: #f8fafc; 
          color: #475569; 
          border: 1px solid #e2e8f0; 
          padding: 12px 24px; 
          border-radius: 8px; 
          font-size: 0.875rem; 
          font-weight: 500; 
          cursor: pointer; 
          transition: all 0.2s;
        }
        .secondary-btn:hover { 
          background-color: #f1f5f9; 
          border-color: #3b82f6; 
        }
        
        /* 预约表格样式 */
        .appointments-section { margin-top: 0; }
        .pending-appointments-section { 
          margin-bottom: 40px; 
          padding: 20px; 
          background: #fef3c7; 
          border: 1px solid #f59e0b; 
          border-radius: 10px; 
        }
        .pending-appointments-section h2 { 
          margin-bottom: 16px; 
          color: #92400e; 
          font-size: 1.25rem; 
        }
        
        /* 预约信息头部和筛选样式 */
        .appointments-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 20px; 
          flex-wrap: wrap; 
          gap: 16px; 
        }
        .date-filter { 
          display: flex; 
          align-items: center; 
          gap: 16px; 
          flex-wrap: wrap; 
        }
        .filter-group { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
        }
        .filter-group label { 
          font-size: 0.875rem; 
          color: #475569; 
          font-weight: 500; 
        }
        .date-input { 
          padding: 8px 12px; 
          border: 1px solid #e2e8f0; 
          border-radius: 6px; 
          font-size: 0.875rem; 
          color: #334155; 
          background: #fff; 
          transition: border-color 0.2s; 
        }
        .date-input:focus { 
          outline: none; 
          border-color: #3b82f6; 
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); 
        }
        .filter-btn { 
          padding: 8px 16px; 
          background-color: #f8fafc; 
          color: #475569; 
          border: 1px solid #e2e8f0; 
          border-radius: 6px; 
          font-size: 0.875rem; 
          cursor: pointer; 
          transition: all 0.2s; 
        }
        .filter-btn:hover { 
          background-color: #f1f5f9; 
          border-color: #3b82f6; 
        }
        .table-container { overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; }
        .appointments-table { width: 100%; border-collapse: collapse; }
        .appointments-table th { 
          background-color: #f8fafc; 
          color: #475569; 
          font-weight: 600; 
          padding: 16px 12px; 
          text-align: left; 
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.875rem;
        }
        .appointments-table td { 
          padding: 16px 12px; 
          border-bottom: 1px solid #f1f5f9; 
          font-size: 0.875rem;
          color: #334155;
        }
        .appointments-table tr:hover { background-color: #f8fafc; }
        .appointments-table tr:last-child td { border-bottom: none; }
        
        /* 状态标签样式 */
        .status { 
          display: inline-block; 
          padding: 4px 8px; 
          border-radius: 6px; 
          font-size: 0.75rem; 
          font-weight: 500; 
        }
        .status-confirmed { background-color: #dcfce7; color: #166534; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-completed { background-color: #dbeafe; color: #1e40af; }
        .status-cancelled { background-color: #fee2e2; color: #dc2626; }
        .status-default { background-color: #f1f5f9; color: #64748b; }
        
        /* 操作按钮样式 */
        .action-btn { 
          background-color: #3b82f6; 
          color: white; 
          border: none; 
          padding: 6px 12px; 
          border-radius: 6px; 
          font-size: 0.75rem; 
          cursor: pointer; 
          transition: background-color 0.2s;
        }
        .action-btn:hover { background-color: #2563eb; }
        
        /* 分页组件样式 */
        .pagination { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-top: 20px; 
          padding: 16px 0;
        }
        .pagination-info { 
          color: #64748b; 
          font-size: 0.875rem; 
        }
        .pagination-controls { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
        }
        .pagination-btn { 
          padding: 8px 16px; 
          border: 1px solid #e2e8f0; 
          background: #fff; 
          color: #475569; 
          border-radius: 6px; 
          cursor: pointer; 
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .pagination-btn:hover:not(:disabled) { 
          background: #f8fafc; 
          border-color: #3b82f6; 
        }
        .pagination-btn:disabled { 
          opacity: 0.5; 
          cursor: not-allowed; 
        }
        .pagination-numbers { 
          display: flex; 
          gap: 4px; 
        }
        .pagination-number { 
          padding: 8px 12px; 
          border: 1px solid #e2e8f0; 
          background: #fff; 
          color: #475569; 
          border-radius: 6px; 
          cursor: pointer; 
          font-size: 0.875rem;
          min-width: 40px;
          transition: all 0.2s;
        }
        .pagination-number:hover { 
          background: #f8fafc; 
          border-color: #3b82f6; 
        }
        .pagination-number.active { 
          background: #3b82f6; 
          color: #fff; 
          border-color: #3b82f6; 
        }
        
        @media (max-width: 960px) { 
          .grid { grid-template-columns: repeat(2, 1fr); } 
          .appointments-table th, .appointments-table td { padding: 12px 8px; }
          .pagination { flex-direction: column; gap: 12px; }
          .pagination-controls { flex-wrap: wrap; justify-content: center; }
          .action-buttons { flex-direction: column; }
          .primary-btn, .secondary-btn { width: 100%; text-align: center; }
          .appointments-header { flex-direction: column; align-items: flex-start; }
          .date-filter { width: 100%; justify-content: flex-start; }
        }
        @media (max-width: 560px) { 
          .grid { grid-template-columns: 1fr; } 
          .appointments-table th, .appointments-table td { padding: 8px 6px; font-size: 0.75rem; }
          .pagination-numbers { flex-wrap: wrap; }
          .pagination-number { min-width: 32px; padding: 6px 8px; font-size: 0.75rem; }
          .date-filter { flex-direction: column; align-items: stretch; gap: 12px; }
          .filter-group { flex-direction: column; align-items: flex-start; gap: 4px; }
          .date-input, .filter-btn { width: 100%; }
        }
      `}</style>
    </div>
  )
}


