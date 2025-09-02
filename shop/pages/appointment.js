import React from 'react'
import Link from 'next/link'

export default function AppointmentPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedTime, setSelectedTime] = React.useState('')
  const [customerName, setCustomerName] = React.useState('')
  const [customerPhone, setCustomerPhone] = React.useState('')
  const [customerEmail, setCustomerEmail] = React.useState('')
  const [customerNotes, setCustomerNotes] = React.useState('')
  const [currentMonthOffset, setCurrentMonthOffset] = React.useState(0)
  const dialogRef = React.useRef(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // 处理对话框打开时的焦点和滚动锁定
  React.useEffect(() => {
    if (isDialogOpen) {
      // 锁定背景页面滚动
      document.body.style.overflow = 'hidden'
      
      // 将焦点设置到对话框
      if (dialogRef.current) {
        dialogRef.current.focus()
      }
    } else {
      // 恢复背景页面滚动
      document.body.style.overflow = 'unset'
    }

    // 清理函数
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDialogOpen])

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isDialogOpen) {
      setIsDialogOpen(false)
    }
  }

  React.useEffect(() => {
    if (isDialogOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDialogOpen])

  // 生成单个月份的日历数据
  const generateCalendar = () => {
    const today = new Date()
    const targetDate = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1)
    const monthName = targetDate.toLocaleDateString('zh-CN', { month: 'long' })
    const year = targetDate.getFullYear()
    
    const firstDay = new Date(year, targetDate.getMonth(), 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const isCurrentMonth = date.getMonth() === targetDate.getMonth()
      const isToday = date.toDateString() === today.toDateString()
      const isPast = date < today
      const isAvailable = !isPast && isCurrentMonth
      
      days.push({
        date: date,
        isCurrentMonth,
        isToday,
        isPast,
        isAvailable
      })
    }
    
    return {
      name: monthName,
      year,
      days
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonthOffset(prev => Math.max(prev - 1, 0))
  }

  const goToNextMonth = () => {
    setCurrentMonthOffset(prev => Math.min(prev + 1, 2)) // 最多往后2个月（60天）
  }

  const handleDateClick = (date) => {
    if (date.isAvailable) {
      setSelectedDate(date.date)
      setIsDialogOpen(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // 这里可以添加预约提交逻辑
    console.log('预约信息:', {
      date: selectedDate,
      time: selectedTime,
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      notes: customerNotes
    })
    
    // 模拟提交成功
    alert('预约提交成功！我们会尽快与您联系确认。')
    setIsDialogOpen(false)
    // 重置表单
    setSelectedDate(null)
    setSelectedTime('')
    setCustomerName('')
    setCustomerPhone('')
    setCustomerEmail('')
    setCustomerNotes('')
  }

  const currentMonth = generateCalendar()

  return (
    <div className="page">
      <header className="header">
        <div className="navbar-area">
          <div className="container">
            <div className="navbar">
              <div className="navbar-brand">
                <div className="brand">TailorShop</div>
              </div>
              <nav className={`navbar-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
                <div className="nav-links">
                  <a href="/#services" className="nav-link" onClick={closeMenu}>服务</a>
                  <a href="/#gallery" className="nav-link" onClick={closeMenu}>作品</a>
                  <a href="/#about" className="nav-link" onClick={closeMenu}>关于</a>
                  <Link href="/appointment" className="nav-link cta" onClick={closeMenu}>预约试衣</Link>
                </div>
                <button 
                  className={`navbar-toggler ${isMenuOpen ? 'active' : ''}`} 
                  onClick={toggleMenu}
                  aria-label="Toggle navigation"
                >
                  <span className="toggler-icon"></span>
                  <span className="toggler-icon"></span>
                  <span className="toggler-icon"></span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="page-header">
      <h1>预约试衣</h1>
            <p>选择您方便的时间，我们将为您安排专业的量体服务</p>
          </div>

          <div className="calendar-section">
            <div className="calendar-container">
              <div className="month-calendar">
                <div className="month-header">
                  <button 
                    className="nav-month-btn prev" 
                    onClick={goToPreviousMonth}
                    disabled={currentMonthOffset === 0}
                  >
                    ‹
                  </button>
                  <h2>{currentMonth.name} {currentMonth.year}</h2>
                  <button 
                    className="nav-month-btn next" 
                    onClick={goToNextMonth}
                    disabled={currentMonthOffset === 2}
                  >
                    ›
                  </button>
                </div>
                <div className="calendar-grid">
                  <div className="weekdays">
                    <div>日</div>
                    <div>一</div>
                    <div>二</div>
                    <div>三</div>
                    <div>四</div>
                    <div>五</div>
                    <div>六</div>
                  </div>
                  <div className="days">
                    {currentMonth.days.map((day, dayIndex) => (
                      <button
                        key={dayIndex}
                        className={`day ${day.isCurrentMonth ? 'current-month' : ''} ${day.isToday ? 'today' : ''} ${day.isPast ? 'past' : ''} ${day.isAvailable ? 'available' : ''}`}
                        onClick={() => handleDateClick(day)}
                        disabled={!day.isAvailable}
                      >
                        {day.date.getDate()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-info">
            <div className="info-card">
              <h3>预约须知</h3>
              <ul>
                <li>请提前至少24小时预约</li>
                <li>预约成功后我们会电话确认</li>
                <li>如需取消请提前4小时告知</li>
                <li>首次预约可享受免费量体咨询</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* 预约对话框 */}
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <div 
            className="dialog" 
            ref={dialogRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-header">
              <h3>预约 {selectedDate?.toLocaleDateString('zh-CN')}</h3>
              <button className="close-btn" onClick={() => setIsDialogOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label>预约时间</label>
                <select 
                  value={selectedTime} 
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="">请选择时间</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>
              


              <div className="form-group">
                <label>姓名</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="请输入您的姓名"
                  required
                />
              </div>

              <div className="form-group">
                <label>手机号码</label>
                <input 
                  type="tel" 
                  value={customerPhone} 
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="请输入您的手机号码"
                  required
                />
              </div>

              <div className="form-group">
                <label>邮箱地址</label>
                <input 
                  type="email" 
                  value={customerEmail} 
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="请输入您的邮箱地址"
                  required
                />
              </div>

              <div className="form-group">
                <label>备注</label>
                <textarea 
                  value={customerNotes} 
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="请输入您的特殊需求或备注信息（可选）"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn secondary" onClick={() => setIsDialogOpen(false)}>
                  取消
                </button>
                <button type="submit" className="btn primary">
                  确认预约
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand">TailorShop</div>
              <p>专业定制，只为您的完美合身</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>服务</h4>
                <a href="/#services">量身定制</a>
                <a href="/#services">面料选择</a>
                <a href="/#services">工艺细节</a>
              </div>
              <div className="footer-section">
                <h4>关于</h4>
                <a href="/#about">公司介绍</a>
                <a href="/#gallery">作品展示</a>
                <a href="/#contact">联系我们</a>
              </div>
              <div className="footer-section">
                <h4>关注我们</h4>
                <a href="#" aria-label="wechat">WeChat</a>
                <a href="#" aria-label="instagram">Instagram</a>
                <a href="#" aria-label="weibo">Weibo</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} TailorShop. 保留所有权利。</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .page { 
          color: #1a202c; 
          background: #ffffff; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 24px; 
        }
        
        .header { 
          position: sticky; 
          top: 0; 
          backdrop-filter: blur(15px); 
          background: rgba(255,255,255,0.98); 
          z-index: 1000;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 2px 20px rgba(0,0,0,0.05);
        }
        
        .navbar-area { 
          position: relative; 
          z-index: 100;
        }
        
        .navbar { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          height: 80px; 
        }
        
        .navbar-brand { 
          display: flex;
          align-items: center;
        }
        
        .brand { 
          font-size: 28px;
          font-weight: 800; 
          letter-spacing: 1px;
          color: #1a202c;
          text-transform: uppercase;
          background: linear-gradient(135deg, #1a202c, #2d3748);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .navbar-nav { 
          display: flex;
          align-items: center;
          gap: 32px;
        }
        
        .nav-links { 
          display: flex;
          align-items: center;
          gap: 32px;
        }
        
        .nav-link { 
          color: #4a5568; 
          text-decoration: none; 
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.3px;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .nav-link:hover {
          color: #1a202c;
          background: rgba(26, 32, 44, 0.05);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: #37c2cc;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link:hover::after {
          width: 60%;
        }
        
        .nav-link.cta { 
          padding: 14px 28px; 
          border-radius: 8px; 
          background: linear-gradient(135deg, #37c2cc, #2d3748); 
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(55, 194, 204, 0.3);
          border: none;
        }
        
        .nav-link.cta:hover {
          background: linear-gradient(135deg, #2d3748, #37c2cc);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(55, 194, 204, 0.4);
        }

        .nav-link.cta::after {
          display: none;
        }

        .navbar-toggler {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 32px;
          height: 26px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        .toggler-icon {
          display: block;
          width: 100%;
          height: 3px;
          background: #1a202c;
          border-radius: 2px;
          transition: all 0.3s ease-in-out;
          transform-origin: center;
        }

        .navbar-toggler:hover .toggler-icon {
          background: #37c2cc;
        }

        .navbar-toggler.active .toggler-icon:nth-child(1) {
          transform: translateY(11.5px) rotate(45deg);
        }

        .navbar-toggler.active .toggler-icon:nth-child(2) {
          opacity: 0;
          transform: scale(0);
        }

        .navbar-toggler.active .toggler-icon:nth-child(3) {
          transform: translateY(-11.5px) rotate(-45deg);
        }

        .main-content {
          flex: 1;
          padding: 80px 0;
        }

        .page-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .page-header h1 {
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 20px;
          color: #1a202c;
        }

        .page-header p {
          font-size: 20px;
          color: #718096;
          margin: 0;
          max-width: 600px;
          margin: 0 auto;
        }

        .calendar-section {
          margin-bottom: 80px;
        }

        .calendar-container {
          display: flex;
          justify-content: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .month-calendar {
          background: #fff;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
          width: 100%;
        }

        .month-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .month-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
          flex: 1;
          text-align: center;
        }

        .nav-month-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          background: white;
          color: #4a5568;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-month-btn:hover:not(:disabled) {
          border-color: #667eea;
          color: #667eea;
          background: rgba(102, 126, 234, 0.05);
          transform: scale(1.1);
        }

        .nav-month-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-month-btn.prev {
          margin-right: 16px;
        }

        .nav-month-btn.next {
          margin-left: 16px;
        }

        .calendar-grid {
          display: flex;
          flex-direction: column;
        }

        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .weekdays div {
          text-align: center;
          font-weight: 600;
          color: #718096;
          font-size: 14px;
          padding: 8px 0;
        }

        .days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }

        .day {
          aspect-ratio: 1;
          border: none;
          background: transparent;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 40px;
        }

        .day.current-month {
          color: #1a202c;
        }

        .day:not(.current-month) {
          color: #cbd5e0;
        }

        .day.today {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-weight: 600;
        }

        .day.past {
          color: #a0aec0;
          cursor: not-allowed;
        }

        .day.available:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: scale(1.1);
        }

        .day.available:active {
          transform: scale(0.95);
        }

        .booking-info {
          margin-top: 60px;
        }

        .info-card {
          background: linear-gradient(135deg, #f7fafc, #edf2f7);
          border-radius: 20px;
          padding: 40px;
          border: 1px solid #e2e8f0;
        }

        .info-card h3 {
          font-size: 24px;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 24px;
        }

        .info-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-card li {
          padding: 12px 0;
          color: #4a5568;
          position: relative;
          padding-left: 24px;
        }

        .info-card li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #48bb78;
          font-weight: 600;
        }

        /* 对话框样式 */
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          overflow-y: auto;
        }

        .dialog {
          background: white;
          border-radius: 20px;
          padding: 0;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          overflow-x: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: dialogSlideIn 0.3s ease-out;
          box-sizing: border-box;
          outline: none;
        }

        .dialog:focus {
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        @keyframes dialogSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .dialog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 30px;
          border-bottom: 1px solid #e2e8f0;
          box-sizing: border-box;
          width: 100%;
        }

        .dialog-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1a202c;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #a0aec0;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #f7fafc;
          color: #4a5568;
        }

        .booking-form {
          padding: 30px;
          box-sizing: border-box;
          width: 100%;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #1a202c;
          font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
          font-family: inherit;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 32px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 32px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-family: inherit;
          position: relative;
          overflow: hidden;
          min-width: 140px;
          height: 52px;
        }

        .btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
        
        .btn.primary:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.6);
        }
        
        .btn.primary:active {
          transform: translateY(-1px);
        }

        .btn.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #1a202c;
          border: 2px solid rgba(26, 32, 44, 0.3);
          backdrop-filter: blur(20px);
        }
        
        .btn.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(26, 32, 44, 0.5);
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 255, 255, 0.2);
        }
        
        .btn.secondary:active {
          transform: translateY(-1px);
        }

        .footer {
          background: #1a202c;
          color: white;
          padding: 60px 0 24px;
          margin-top: auto;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
          margin-bottom: 40px;
        }
        
        .footer-brand .brand {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        
        .footer-brand p {
          color: #a0aec0;
          margin: 0;
        }
        
        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        
        .footer-section h4 {
          margin: 0 0 16px;
          font-size: 16px;
          font-weight: 600;
        }
        
        .footer-section a {
          display: block;
          color: #a0aec0;
          text-decoration: none;
          margin-bottom: 8px;
          transition: color 0.2s ease;
        }
        
        .footer-section a:hover {
          color: white;
        }
        
        .footer-bottom {
          border-top: 1px solid #2d3748;
          padding-top: 24px;
          text-align: center;
          color: #a0aec0;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 20px;
          }
          
          .header {
            position: relative;
          }

          .navbar {
            flex-direction: column;
            align-items: flex-start;
            height: auto;
            padding: 16px 0;
          }

          .navbar-brand {
            width: 100%;
            justify-content: space-between;
            padding-bottom: 16px;
            border-bottom: 1px solid #e2e8f0;
          }

          .navbar-nav {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            display: none;
          }

          .navbar-nav.mobile-open {
            display: flex;
          }

          .nav-links {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
          }

          .nav-link {
            width: 100%;
            text-align: center;
          }

          .navbar-toggler {
            display: flex;
          }
          
          .main-content {
            padding: 60px 0;
          }

          .page-header h1 {
            font-size: 36px;
          }

          .page-header p {
            font-size: 18px;
          }

          .calendar-container {
            max-width: 100%;
          }

          .month-calendar {
            padding: 20px;
          }

          .month-header h2 {
            font-size: 20px;
          }

          .nav-month-btn {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }

          .weekdays div {
            font-size: 12px;
            padding: 6px 0;
          }

          .day {
            font-size: 14px;
            min-height: 35px;
          }

          .form-actions {
            flex-direction: column;
          }

          .dialog {
            max-width: 95vw;
            margin: 0 10px;
          }

          .dialog-header {
            padding: 20px 20px;
          }

          .booking-form {
            padding: 20px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .footer-links {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .page-header h1 {
            font-size: 28px;
          }
          
          .page-header p {
            font-size: 16px;
          }

          .month-calendar {
            padding: 16px;
          }

          .day {
            font-size: 14px;
          }

          .footer-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}


