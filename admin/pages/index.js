import React from 'react';

// 状态样式分类函数
function getStatusClass(status) {
  switch (status) {
    case 0:
      return 'pending';
    case 1:
      return 'cancelled';
    case 2:
      return 'pending';
    case 3:
      return 'confirmed';
    default:
      return 'default';
  }
}

// 状态显示文本函数
function getStatusText(status) {
  switch (status) {
    case 0:
      return '待确认';
    case 1:
      return '已拒绝';
    case 2:
      return '待沟通';
    case 3:
      return '已同意';
    default:
      return '未知';
  }
}

export default function AdminHome() {
  // 状态管理
  const [activeTab, setActiveTab] = React.useState('appointments');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const itemsPerPage = 10;
  
  // API数据状态
  const [appointments, setAppointments] = React.useState([]);
  const [pendingAppointments, setPendingAppointments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [stats, setStats] = React.useState({ total: 0, pending: 0, processed: 0 });
  
  // API调用函数
  const fetchAppointments = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (params.status !== undefined) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const url = `/api/appointments${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAppointments(data.data || []);
        setStats(data.stats || { total: 0, pending: 0, processed: 0 });
        
        // 筛选出未处理的预约（status = 0）
        const pending = data.data.filter(apt => apt.status === 0);
        setPendingAppointments(pending);
      } else {
        throw new Error(data.message || '获取数据失败');
      }
    } catch (err) {
      console.error('获取预约数据失败:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // 组件加载时获取数据
  React.useEffect(() => {
    fetchAppointments();
  }, []);
  
  
  // 时间段筛选逻辑
  const filteredAppointments = React.useMemo(() => {
    if (!startDate && !endDate) {
      return appointments;
    }
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentTime);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate + ' 23:59:59') : new Date('2100-12-31');
      
      return appointmentDate >= start && appointmentDate <= end;
    });
  }, [appointments, startDate, endDate]);
  
  // 重置筛选
  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    fetchAppointments();
  };
  
  // 处理筛选
  const handleFilter = () => {
    setCurrentPage(1);
    fetchAppointments({
      startDate: startDate || undefined,
      endDate: endDate || undefined
    });
  };
  
  // 分页计算
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);
  
  // 分页处理函数
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="page">
      <header className="header">
        <div className="container nav">
          <div className="brand">TailorShop Admin</div>
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
          {activeTab === 'appointments' && (
            <div className="appointments-section">
              {/* 未处理预约信息表格 */}
              <div className="pending-appointments-section">
                <h2>未处理预约信息</h2>
                <div className="table-container">
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>预约时间</th>
                        <th>客户姓名</th>
                        <th>联系电话</th>
                        <th>状态</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                            加载中...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#dc2626' }}>
                            加载失败: {error}
                          </td>
                        </tr>
                      ) : pendingAppointments.slice(0, 5).map((appointment) => (
                        <tr key={appointment.id}>
                          <td>{new Date(appointment.appointmentTime).toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</td>
                          <td>{appointment.name}</td>
                          <td>{appointment.phone}</td>
                          <td>
                            <span className={`status status-${getStatusClass(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                          </td>
                          <td>
                            <button className="action-btn">处理</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="appointments-header">
                <h2>最近3天预约信息</h2>
                <div className="date-filter">
                  <div className="filter-group">
                    <label htmlFor="startDate">开始日期：</label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="date-input"
                    />
                  </div>
                  <div className="filter-group">
                    <label htmlFor="endDate">结束日期：</label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="date-input"
                    />
                  </div>
                  <button 
                    className="filter-btn" 
                    onClick={handleFilter}
                  >
                    筛选
                  </button>
                  <button 
                    className="filter-btn" 
                    onClick={handleResetFilter}
                  >
                    重置
                  </button>
                </div>
              </div>
              <div className="table-container">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>预约时间</th>
                      <th>客户姓名</th>
                      <th>联系电话</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                          加载中...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#dc2626' }}>
                          加载失败: {error}
                        </td>
                      </tr>
                    ) : currentAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{new Date(appointment.appointmentTime).toLocaleString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</td>
                        <td>{appointment.name}</td>
                        <td>{appointment.phone}</td>
                        <td>
                          <span className={`status status-${getStatusClass(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn">查看详情</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 分页组件 */}
              <div className="pagination">
                <div className="pagination-info">
                  显示第 {startIndex + 1}-{Math.min(endIndex, filteredAppointments.length)} 条，共 {filteredAppointments.length} 条记录
                  {stats.total > 0 && (
                    <span style={{ marginLeft: '16px', color: '#64748b' }}>
                      （总计: {stats.total} | 待处理: {stats.pending} | 已处理: {stats.processed}）
                    </span>
                  )}
                </div>
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    上一页
                  </button>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className="pagination-btn" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="blog-section">
              <h2>博客管理</h2>
              <div className="content-placeholder">
                <p>这里是博客管理功能的内容区域。</p>
                <p>您可以在这里上传和管理店铺日常博客内容。</p>
                <p>功能包括：</p>
                <ul>
                  <li>博客文章发布与编辑</li>
                  <li>图片上传与管理</li>
                  <li>文章分类与标签</li>
                  <li>发布状态管理</li>
                  <li>博客预览与发布</li>
                </ul>
                <div className="action-buttons">
                  <button className="primary-btn">新建博客</button>
                  <button className="secondary-btn">管理现有博客</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="images-section">
              <h2>图片管理</h2>
              <div className="content-placeholder">
                <p>这里是图片管理功能的内容区域。</p>
                <p>您可以在这里上传和管理主页轮播图片。</p>
                <p>功能包括：</p>
                <ul>
                  <li>轮播图片上传</li>
                  <li>图片排序与编辑</li>
                  <li>图片预览与删除</li>
                  <li>图片尺寸优化</li>
                  <li>轮播设置管理</li>
                </ul>
                <div className="action-buttons">
                  <button className="primary-btn">上传新图片</button>
                  <button className="secondary-btn">管理现有图片</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .page { color: #0f172a; background: #ffffff; }
        .container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
        .header { border-bottom: 1px solid #e2e8f0; }
        .nav { display: flex; align-items: center; height: 60px; }
        .brand { font-weight: 700; }
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


