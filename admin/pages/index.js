import React from 'react';

// 状态样式分类函数
function getStatusClass(status) {
  switch (status) {
    case '已确认':
      return 'confirmed';
    case '待确认':
      return 'pending';
    case '已完成':
      return 'completed';
    case '已取消':
      return 'cancelled';
    default:
      return 'default';
  }
}

export default function AdminHome() {
  // 状态管理
  const [activeTab, setActiveTab] = React.useState('appointments');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  
  // Mock数据：最近3天的预约信息（32条数据）
  const recentAppointments = [
    { id: 1, customerName: "张先生", serviceType: "量体定制", appointmentTime: "2024-01-15 09:00", status: "已确认", phone: "138****1234" },
    { id: 2, customerName: "李女士", serviceType: "试衣修改", appointmentTime: "2024-01-15 10:30", status: "待确认", phone: "139****5678" },
    { id: 3, customerName: "王先生", serviceType: "量体定制", appointmentTime: "2024-01-15 14:00", status: "已确认", phone: "137****9012" },
    { id: 4, customerName: "陈女士", serviceType: "试衣修改", appointmentTime: "2024-01-15 16:30", status: "已完成", phone: "136****3456" },
    { id: 5, customerName: "刘先生", serviceType: "量体定制", appointmentTime: "2024-01-16 09:30", status: "已确认", phone: "135****7890" },
    { id: 6, customerName: "赵女士", serviceType: "试衣修改", appointmentTime: "2024-01-16 11:00", status: "待确认", phone: "134****2345" },
    { id: 7, customerName: "孙先生", serviceType: "量体定制", appointmentTime: "2024-01-16 14:30", status: "已确认", phone: "133****6789" },
    { id: 8, customerName: "周女士", serviceType: "试衣修改", appointmentTime: "2024-01-16 16:00", status: "已完成", phone: "132****0123" },
    { id: 9, customerName: "吴先生", serviceType: "量体定制", appointmentTime: "2024-01-17 08:30", status: "已确认", phone: "131****4567" },
    { id: 10, customerName: "郑女士", serviceType: "试衣修改", appointmentTime: "2024-01-17 10:00", status: "待确认", phone: "130****8901" },
    { id: 11, customerName: "冯先生", serviceType: "量体定制", appointmentTime: "2024-01-17 13:30", status: "已确认", phone: "129****2345" },
    { id: 12, customerName: "韩女士", serviceType: "试衣修改", appointmentTime: "2024-01-17 15:00", status: "已完成", phone: "128****5678" },
    { id: 13, customerName: "杨先生", serviceType: "量体定制", appointmentTime: "2024-01-15 08:00", status: "已确认", phone: "127****9012" },
    { id: 14, customerName: "朱女士", serviceType: "试衣修改", appointmentTime: "2024-01-15 12:00", status: "待确认", phone: "126****3456" },
    { id: 15, customerName: "秦先生", serviceType: "量体定制", appointmentTime: "2024-01-15 15:30", status: "已确认", phone: "125****7890" },
    { id: 16, customerName: "尤女士", serviceType: "试衣修改", appointmentTime: "2024-01-15 17:00", status: "已完成", phone: "124****2345" },
    { id: 17, customerName: "许先生", serviceType: "量体定制", appointmentTime: "2024-01-16 08:00", status: "已确认", phone: "123****6789" },
    { id: 18, customerName: "何女士", serviceType: "试衣修改", appointmentTime: "2024-01-16 12:30", status: "待确认", phone: "122****0123" },
    { id: 19, customerName: "吕先生", serviceType: "量体定制", appointmentTime: "2024-01-16 15:30", status: "已确认", phone: "121****4567" },
    { id: 20, customerName: "施女士", serviceType: "试衣修改", appointmentTime: "2024-01-16 17:30", status: "已完成", phone: "120****8901" },
    { id: 21, customerName: "张先生", serviceType: "量体定制", appointmentTime: "2024-01-17 07:30", status: "已确认", phone: "119****2345" },
    { id: 22, customerName: "孔女士", serviceType: "试衣修改", appointmentTime: "2024-01-17 11:30", status: "待确认", phone: "118****5678" },
    { id: 23, customerName: "曹先生", serviceType: "量体定制", appointmentTime: "2024-01-17 14:00", status: "已确认", phone: "117****9012" },
    { id: 24, customerName: "严女士", serviceType: "试衣修改", appointmentTime: "2024-01-17 16:30", status: "已完成", phone: "116****3456" },
    { id: 25, customerName: "华先生", serviceType: "量体定制", appointmentTime: "2024-01-15 07:00", status: "已确认", phone: "115****7890" },
    { id: 26, customerName: "金女士", serviceType: "试衣修改", appointmentTime: "2024-01-15 11:30", status: "待确认", phone: "114****2345" },
    { id: 27, customerName: "魏先生", serviceType: "量体定制", appointmentTime: "2024-01-15 13:00", status: "已确认", phone: "113****6789" },
    { id: 28, customerName: "陶女士", serviceType: "试衣修改", appointmentTime: "2024-01-15 18:00", status: "已完成", phone: "112****0123" },
    { id: 29, customerName: "姜先生", serviceType: "量体定制", appointmentTime: "2024-01-16 07:00", status: "已确认", phone: "111****4567" },
    { id: 30, customerName: "戚女士", serviceType: "试衣修改", appointmentTime: "2024-01-16 13:00", status: "待确认", phone: "110****8901" },
    { id: 31, customerName: "谢先生", serviceType: "量体定制", appointmentTime: "2024-01-17 06:30", status: "已确认", phone: "109****2345" },
    { id: 32, customerName: "邹女士", serviceType: "试衣修改", appointmentTime: "2024-01-17 12:00", status: "已完成", phone: "108****5678" }
  ];
  
  // 分页计算
  const totalPages = Math.ceil(recentAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = recentAppointments.slice(startIndex, endIndex);
  
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
          <div className={`card ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <h3>订单管理</h3>
            <p>查看与更新客户订单状态。</p>
          </div>
          <div className={`card ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
            <h3>客户管理</h3>
            <p>客户档案、量体数据与偏好。</p>
          </div>
          <div className={`card ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            <h3>面料库存</h3>
            <p>品牌、色卡、库存与采购。</p>
          </div>
          <div className={`card ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            <h3>预约日历</h3>
            <p>试衣与量体安排一目了然。</p>
          </div>
        </div>

        {/* 动态内容区域 */}
        <div className="content-section">
          {activeTab === 'appointments' && (
            <div className="appointments-section">
              <h2>最近3天预约信息</h2>
              <div className="table-container">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>预约时间</th>
                      <th>客户姓名</th>
                      <th>联系电话</th>
                      <th>服务类型</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.appointmentTime}</td>
                        <td>{appointment.customerName}</td>
                        <td>{appointment.phone}</td>
                        <td>{appointment.serviceType}</td>
                        <td>
                          <span className={`status status-${getStatusClass(appointment.status)}`}>
                            {appointment.status}
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
                  显示第 {startIndex + 1}-{Math.min(endIndex, recentAppointments.length)} 条，共 {recentAppointments.length} 条记录
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

          {activeTab === 'customers' && (
            <div className="customers-section">
              <h2>客户管理</h2>
              <div className="content-placeholder">
                <p>这里是客户管理功能的内容区域。</p>
                <p>您可以在这里管理客户档案、量体数据与偏好设置。</p>
                <p>功能包括：</p>
                <ul>
                  <li>客户信息录入与编辑</li>
                  <li>量体数据管理</li>
                  <li>客户偏好设置</li>
                  <li>客户历史记录查询</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <h2>订单管理</h2>
              <div className="content-placeholder">
                <p>这里是订单管理功能的内容区域。</p>
                <p>您可以在这里查看与更新客户订单状态。</p>
                <p>功能包括：</p>
                <ul>
                  <li>订单列表查看</li>
                  <li>订单状态更新</li>
                  <li>订单详情管理</li>
                  <li>订单统计报表</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="inventory-section">
              <h2>面料库存</h2>
              <div className="content-placeholder">
                <p>这里是面料库存功能的内容区域。</p>
                <p>您可以在这里管理品牌、色卡、库存与采购。</p>
                <p>功能包括：</p>
                <ul>
                  <li>面料品牌管理</li>
                  <li>色卡库维护</li>
                  <li>库存数量跟踪</li>
                  <li>采购计划制定</li>
                </ul>
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
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 12px; }
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
        
        /* 预约表格样式 */
        .appointments-section { margin-top: 0; }
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
        }
        @media (max-width: 560px) { 
          .grid { grid-template-columns: 1fr; } 
          .appointments-table th, .appointments-table td { padding: 8px 6px; font-size: 0.75rem; }
          .pagination-numbers { flex-wrap: wrap; }
          .pagination-number { min-width: 32px; padding: 6px 8px; font-size: 0.75rem; }
        }
      `}</style>
    </div>
  )
}


