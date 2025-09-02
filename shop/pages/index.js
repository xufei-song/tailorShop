import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [slides, setSlides] = React.useState([])
  const [intervalMs, setIntervalMs] = React.useState(5000)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/carousel', { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled) {
          setSlides(data.slides || [])
          setIntervalMs(data.intervalMs || 5000)
        }
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

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
                  <a href="#services" className="nav-link" onClick={closeMenu}>服务</a>
                  <a href="#gallery" className="nav-link" onClick={closeMenu}>作品</a>
                  <a href="#about" className="nav-link" onClick={closeMenu}>关于</a>
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

      <HeroCarousel images={slides.map(s => s.src)} intervalMs={intervalMs} />

      <section id="services" className="section feature-section">
        <div className="container">
          <div className="section-header">
            <h2>我们的服务</h2>
            <p>专业定制，只为您的完美合身</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✂️</div>
              <h3>量身定制</h3>
              <p>基于个人体型数据打造专属版型，贴合每一处线条，确保完美合身。</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧵</div>
              <h3>甄选面料</h3>
              <p>意大利、英国进口面料与优质国产面料，多场景自由选择，品质保证。</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>精工细作</h3>
              <p>手工驳头、开衩、锁眼，细节处尽显质感与耐穿性，传承匠心工艺。</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>专属售后</h3>
              <p>体重变化、场合变更提供免费微调与保养建议，终身服务保障。</p>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="section gallery-section">
        <div className="container">
          <div className="section-header">
            <h2>精选作品</h2>
            <p>每一件作品都承载着我们的匠心与您的故事</p>
          </div>
          <div className="gallery-grid">
            <div className="gallery-item">
              <div className="gallery-image" />
              <div className="gallery-overlay">
                <h4>商务正装</h4>
                <p>经典剪裁，商务精英首选</p>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-image" />
              <div className="gallery-overlay">
                <h4>休闲西装</h4>
                <p>舒适版型，日常穿着首选</p>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-image" />
              <div className="gallery-overlay">
                <h4>礼服定制</h4>
                <p>隆重场合，尽显尊贵气质</p>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-image" />
              <div className="gallery-overlay">
                <h4>大衣外套</h4>
                <p>保暖实用，秋冬必备单品</p>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-image" />
              <div className="gallery-overlay">
                <h4>衬衫定制</h4>
                <p>贴身舒适，职场必备</p>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-image" />
              <div className="gallery-overlay">
                <h4>裤装定制</h4>
                <p>修身版型，展现完美腿型</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>关于我们</h2>
              <p>
                我们是一家注重工艺与体验的现代裁缝店，从首次沟通、面料与版型选择到多次试身，
                为你提供轻松、透明且可控的定制流程。每一件作品都承载着我们的匠心与您的故事。
              </p>
              <div className="about-stats">
                <div className="stat">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">年经验</div>
                </div>
                <div className="stat">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">满意客户</div>
                </div>
                <div className="stat">
                  <div className="stat-number">3</div>
                  <div className="stat-label">次试身</div>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="image-placeholder" />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>联系与预约</h2>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">🕒</div>
                  <div>
                    <h4>营业时间</h4>
                    <p>周二至周日 11:00 - 20:00</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <h4>门店地址</h4>
                    <p>上海市黄浦区某某路 88 号</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h4>邮件预约</h4>
                    <p>hi@tailorshop.example</p>
                  </div>
                </div>
              </div>
              <div className="contact-actions">
                <Link href="/appointment" className="btn primary">立即预约</Link>
                <a href="mailto:hi@tailorshop.example" className="btn secondary">邮件咨询</a>
              </div>
            </div>
            <div className="contact-promo">
              <div className="promo-badge">首次到店立减</div>
              <h3>新客户专享</h3>
              <p>首次预约立享量体咨询优惠，体验专业定制服务</p>
              <div className="promo-features">
                <div className="promo-feature">✓ 免费量体咨询</div>
                <div className="promo-feature">✓ 面料样品体验</div>
                <div className="promo-feature">✓ 版型建议指导</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <a href="#services">量身定制</a>
                <a href="#services">面料选择</a>
                <a href="#services">工艺细节</a>
              </div>
              <div className="footer-section">
                <h4>关于</h4>
                <a href="#about">公司介绍</a>
                <a href="#gallery">作品展示</a>
                <a href="#contact">联系我们</a>
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
          display: none; /* Remove underline for CTA button */
        }

        .navbar-toggler {
          display: none; /* Hide by default on larger screens */
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

        .section {
          padding: 80px 0;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .section-header h2 {
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 16px;
          color: #1a202c;
        }
        
        .section-header p {
          font-size: 18px;
          color: #718096;
          margin: 0;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }
        
        .feature-card {
          padding: 32px;
          border-radius: 16px;
          background: #fff;
          border: 1px solid #e2e8f0;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: #cbd5e0;
        }
        
        .feature-icon {
          font-size: 48px;
          margin-bottom: 24px;
        }
        
        .feature-card h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px;
          color: #1a202c;
        }
        
        .feature-card p {
          color: #718096;
          line-height: 1.6;
          margin: 0;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .gallery-item {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 4/3;
        }
        
        .gallery-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f7fafc, #edf2f7);
        }
        
        .gallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          color: white;
          padding: 24px;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        
        .gallery-item:hover .gallery-overlay {
          transform: translateY(0);
        }
        
        .gallery-overlay h4 {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 600;
        }
        
        .gallery-overlay p {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        
        .about-text h2 {
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 24px;
          color: #1a202c;
        }
        
        .about-text p {
          font-size: 18px;
          line-height: 1.7;
          color: #4a5568;
          margin: 0 0 40px;
        }
        
        .about-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 8px;
        }
        
        .stat-label {
          color: #718096;
          font-size: 14px;
        }
        
        .about-image {
          display: flex;
          justify-content: center;
        }
        
        .image-placeholder {
          width: 400px;
          height: 300px;
          border-radius: 16px;
          background: linear-gradient(135deg, #f7fafc, #edf2f7);
        }

        .contact-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 60px;
          align-items: start;
        }
        
        .contact-info h2 {
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 32px;
          color: #1a202c;
        }
        
        .contact-details {
          margin-bottom: 40px;
        }
        
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .contact-icon {
          font-size: 24px;
          margin-top: 4px;
        }
        
        .contact-item h4 {
          margin: 0 0 4px;
          font-size: 18px;
          font-weight: 600;
          color: #1a202c;
        }
        
        .contact-item p {
          margin: 0;
          color: #718096;
        }
        
        .contact-actions {
          display: flex;
          gap: 16px;
        }
        
        .btn {
          display: inline-block;
          padding: 14px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        .btn.primary {
          background: #1a202c;
          color: #fff;
        }
        
        .btn.primary:hover {
          background: #2d3748;
          transform: translateY(-1px);
        }
        
        .btn.secondary {
          background: #f7fafc;
          color: #1a202c;
          border: 1px solid #e2e8f0;
        }
        
        .btn.secondary:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
        }
        
        .contact-promo {
          background: #1a202c;
          color: white;
          padding: 40px;
          border-radius: 16px;
          position: relative;
        }
        
        .promo-badge {
          position: absolute;
          top: -12px;
          right: 20px;
          background: #48bb78;
          color: white;
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
        }
        
        .contact-promo h3 {
          margin: 0 0 16px;
          font-size: 24px;
          font-weight: 600;
        }
        
        .contact-promo p {
          margin: 0 0 24px;
          color: #cbd5e0;
          line-height: 1.6;
        }
        
        .promo-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .promo-feature {
          color: #a0aec0;
          font-size: 14px;
        }

        .footer {
          background: #1a202c;
          color: white;
          padding: 60px 0 24px;
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
            position: relative; /* Allow header to be positioned relative for toggler */
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
            display: none; /* Hide by default on mobile */
          }

          .navbar-nav.mobile-open {
            display: flex; /* Show when mobile menu is open */
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
            display: flex; /* Show toggler on smaller screens */
          }
          
          .section {
            padding: 60px 0;
          }
          
          .section-header h2 {
            font-size: 28px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .about-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .contact-content {
            grid-template-columns: 1fr;
            gap: 40px;
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
          .menu {
            display: none;
          }
          
          .section-header h2 {
            font-size: 24px;
          }
          
          .contact-actions {
            flex-direction: column;
          }
          
          .footer-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

function HeroCarousel({ images, intervalMs = 5000 }) {
  const [index, setIndex] = React.useState(0)
  const timerRef = React.useRef(null)

  React.useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, intervalMs)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [images.length, intervalMs])

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length)
  }
  function next() {
    setIndex((i) => (i + 1) % images.length)
  }

  return (
    <section className="carousel" aria-label="Hero carousel">
      {images.map((src, i) => (
        <div key={src} className={`slide ${i === index ? 'active' : ''}`} style={{ backgroundImage: `url(${src})` }} />
      ))}

      <div className="overlay">
        <div className="hero-content">
          <h1>现代裁缝 · 定制你的专属合身</h1>
          <p>高级版型 | 精选面料 | 手工细节 | 三次试身</p>
          <div className="hero-actions">
            <Link href="/appointment" className="btn primary">预约试衣</Link>
            <a href="#gallery" className="btn secondary">查看作品</a>
          </div>
        </div>
      </div>

      <button className="nav-btn left" onClick={prev} aria-label="上一张">‹</button>
      <button className="nav-btn right" onClick={next} aria-label="下一张">›</button>

      <div className="dots">
        {images.map((_, i) => (
          <button key={i} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} aria-label={`第 ${i + 1} 张`} />
        ))}
      </div>

      <style jsx>{`
        .carousel { 
          position: relative; 
          height: 100vh; 
          overflow: hidden; 
        }
        
        .slide { 
          position: absolute; 
          inset: 0; 
          background-size: cover; 
          background-position: center; 
          opacity: 0; 
          transform: scale(1.05); 
          transition: opacity 800ms ease, transform 1200ms ease; 
        }
        
        .slide.active { 
          opacity: 1; 
          transform: scale(1); 
        }
        
        .overlay { 
          position: absolute; 
          inset: 0; 
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.4)); 
          padding: 0 24px; 
        }
        
        .hero-content {
          text-align: center;
          color: white;
          max-width: 800px;
        }
        
        .hero-content h1 { 
          font-size: 48px; 
          font-weight: 700;
          margin: 0 0 20px; 
          text-shadow: 0 4px 24px rgba(0,0,0,0.4);
          line-height: 1.2;
        }
        
        .hero-content p { 
          font-size: 20px;
          margin: 0 0 32px; 
          text-shadow: 0 2px 16px rgba(0,0,0,0.4);
          opacity: 0.95;
        }
        
        .hero-actions { 
          display: flex; 
          gap: 16px; 
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .hero-actions .btn {
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .hero-actions .btn.primary {
          background: #1a202c;
          color: white;
        }
        
        .hero-actions .btn.primary:hover {
          background: #2d3748;
          transform: translateY(-2px);
        }
        
        .hero-actions .btn.secondary {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
        }
        
        .hero-actions .btn.secondary:hover {
          background: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.5);
        }
        
        .nav-btn { 
          position: absolute; 
          top: 50%; 
          transform: translateY(-50%); 
          width: 48px; 
          height: 48px; 
          border-radius: 50%; 
          border: 1px solid rgba(255,255,255,0.3); 
          background: rgba(0,0,0,0.3); 
          color: #fff; 
          display: grid; 
          place-items: center; 
          cursor: pointer;
          font-size: 20px;
          transition: all 0.2s ease;
        }
        
        .nav-btn:hover {
          background: rgba(0,0,0,0.5);
          border-color: rgba(255,255,255,0.5);
        }
        
        .nav-btn.left { left: 24px; }
        .nav-btn.right { right: 24px; }
        
        .dots { 
          position: absolute; 
          bottom: 32px; 
          left: 0; 
          right: 0; 
          display: flex; 
          justify-content: center; 
          gap: 12px; 
        }
        
        .dot { 
          width: 12px; 
          height: 12px; 
          border-radius: 50%; 
          background: rgba(255,255,255,0.4); 
          border: none; 
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .dot:hover {
          background: rgba(255,255,255,0.6);
        }
        
        .dot.active { 
          background: #fff;
          transform: scale(1.2);
        }
        
        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 36px;
          }
          
          .hero-content p {
            font-size: 18px;
          }
          
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .nav-btn {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }
          
          .nav-btn.left { left: 16px; }
          .nav-btn.right { right: 16px; }
        }
        
        @media (max-width: 480px) {
          .hero-content h1 {
            font-size: 28px;
          }
          
          .hero-content p {
            font-size: 16px;
          }
        }
      `}</style>
    </section>
  )
}


