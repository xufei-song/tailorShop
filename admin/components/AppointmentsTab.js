import React from 'react';
import { sharedStyles } from './shared-styles';

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

export default function AppointmentsTab() {
  // 状态管理
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
  const [isDateFiltered, setIsDateFiltered] = React.useState(false);
  
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
      console.log('<xqc>url ======>', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAppointments(data.data || []);
        setStats(data.stats || { total: 0, pending: 0, processed: 0 });
        
        // 设置是否进行了日期筛选
        setIsDateFiltered(!!(params.startDate || params.endDate));
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

  // 单独获取未处理预约的函数
  const fetchPendingAppointments = async () => {
    try {
      const response = await fetch('/api/appointments?status=0');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPendingAppointments(data.data || []);
      } else {
        throw new Error(data.message || '获取未处理预约失败');
      }
    } catch (err) {
      console.error('获取未处理预约失败:', err);
    }
  };
  
  // 组件加载时获取数据
  React.useEffect(() => {
    // 获取未来3天的预约信息
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    
    // 格式化日期为 YYYY-MM-DD 格式
    const startDate = today.toISOString().split('T')[0];
    const endDate = threeDaysLater.toISOString().split('T')[0];
    
    // 获取未来3天的预约数据
    fetchAppointments({
      startDate: startDate,
      endDate: endDate
    });
    
    // 获取所有未处理预约
    fetchPendingAppointments();
  }, []);
  
  // 时间段筛选逻辑
  const filteredAppointments = React.useMemo(() => {
    // 如果API已经进行了日期筛选，直接使用API结果
    if (isDateFiltered) {
      return appointments;
    }
    
    // 如果没有进行日期筛选，在客户端进行筛选
    if (!startDate && !endDate) {
      return appointments;
    }
    
    // 客户端筛选
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentTime);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate + ' 23:59:59') : new Date('2100-12-31');
      
      return appointmentDate >= start && appointmentDate <= end;
    });
  }, [appointments, startDate, endDate, isDateFiltered]);
  
  // 重置筛选
  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    setIsDateFiltered(false);
    
    // 重置到未来3天的数据
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    
    const startDate = today.toISOString().split('T')[0];
    const endDate = threeDaysLater.toISOString().split('T')[0];
    
    fetchAppointments({
      startDate: startDate,
      endDate: endDate
    });
  };
  
  // 处理筛选
  const handleFilter = () => {
    // 检查是否设置了至少一个日期
    if (!startDate && !endDate) {
      alert('请至少选择一个开始日期或结束日期');
      return;
    }
    
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
    <>
      <style jsx>{sharedStyles}</style>
      <div className="appointments-section">
      {/* 未处理预约信息表格 */}
      <div className="pending-appointments-section">
        <h2>未处理预约信息 ({pendingAppointments.length} 条)</h2>
        <div className="pending-table-container">
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
              ) : pendingAppointments.map((appointment) => (
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
        <h2>未来3天预约信息</h2>
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
    </>
  );
}