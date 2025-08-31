import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [slides, setSlides] = React.useState([])
  const [intervalMs, setIntervalMs] = React.useState(5000)

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

  return (
    <div className="page">
      <header className="header">
        <div className="container nav">
          <div className="brand">TailorShop</div>
          <nav className="menu">
            <a href="#services">服务</a>
            <a href="#gallery">作品</a>
            <a href="#about">关于</a>
            <Link href="/appointment" className="cta">预约试衣</Link>
          </nav>
        </div>
      </header>

      <HeroCarousel images={slides.map(s => s.src)} intervalMs={intervalMs} />

      <section id="services" className="section">
        <div className="container">
          <h2>我们的服务</h2>
          <div className="grid">
            <div className="card">
              <h3>量身定制</h3>
              <p>基于个人体型数据打造专属版型，贴合每一处线条。</p>
            </div>
            <div className="card">
              <h3>甄选面料</h3>
              <p>意大利、英国进口面料与优质国产面料，多场景自由选择。</p>
            </div>
            <div className="card">
              <h3>精工细作</h3>
              <p>手工驳头、开衩、锁眼，细节处尽显质感与耐穿性。</p>
            </div>
            <div className="card">
              <h3>专属售后</h3>
              <p>体重变化、场合变更提供免费微调与保养建议。</p>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="section alt">
        <div className="container">
          <h2>部分作品</h2>
          <div className="masonry">
            <div className="tile" />
            <div className="tile" />
            <div className="tile" />
            <div className="tile" />
            <div className="tile" />
            <div className="tile" />
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <h2>关于我们</h2>
          <p>
            我们是一家注重工艺与体验的现代裁缝店，从首次沟通、面料与版型选择到多次试身，
            为你提供轻松、透明且可控的定制流程。
          </p>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container contact">
          <div>
            <h2>联系与预约</h2>
            <p>营业时间：周二至周日 11:00 - 20:00</p>
            <p>门店地址：上海市黄浦区某某路 88 号</p>
            <a className="btn primary" href="mailto:hi@tailorshop.example">邮件预约</a>
          </div>
          <div className="contactCard">
            <div className="badge">首次到店立减</div>
            <p>首次预约立享量体咨询优惠</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <span>© {new Date().getFullYear()} TailorShop</span>
          <a href="#" aria-label="wechat">WeChat</a>
          <a href="#" aria-label="instagram">Instagram</a>
          <a href="#" aria-label="weibo">Weibo</a>
        </div>
      </footer>

      <style jsx>{`
        .page { color: #0f172a; background: #ffffff; }
        .container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
        .header { position: sticky; top: 0; backdrop-filter: blur(6px); background: rgba(255,255,255,0.7); z-index: 20; }
        .nav { display: flex; align-items: center; justify-content: space-between; height: 64px; }
        .brand { font-weight: 700; letter-spacing: 0.5px; }
        .menu a { margin-left: 16px; color: #0f172a; text-decoration: none; }
        .menu .cta { padding: 8px 12px; border-radius: 8px; background: #0f172a; color: #fff; }

        .btn { display: inline-block; padding: 10px 16px; border-radius: 10px; text-decoration: none; }
        .btn.primary { background: #0f172a; color: #fff; }
        .btn.secondary { background: #e2e8f0; color: #0f172a; }

        .section { padding: 64px 0; }
        .section.alt { background: #f8fafc; }
        h2 { margin: 0 0 20px; }
        .grid { display: grid; gap: 16px; grid-template-columns: repeat(4, 1fr); }
        .card { padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; }

        .masonry { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
        .tile { height: 120px; border-radius: 10px; background: linear-gradient(135deg, #f1f5f9, #e2e8f0); }

        .contact { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; align-items: center; }
        .contactCard { position: relative; padding: 24px; border-radius: 12px; background: #0f172a; color: #fff; }
        .badge { position: absolute; top: -10px; right: -10px; background: #22c55e; color: #fff; font-size: 12px; padding: 6px 8px; border-radius: 999px; }

        .footer { border-top: 1px solid #e2e8f0; padding: 24px 0; margin-top: 40px; }
        .footer .container { display: flex; gap: 16px; align-items: center; }

        @media (max-width: 960px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
          .masonry { grid-template-columns: repeat(3, 1fr); }
          .contact { grid-template-columns: 1fr; }
          .hero h1 { font-size: 32px; }
        }
        @media (max-width: 560px) {
          .grid { grid-template-columns: 1fr; }
          .masonry { grid-template-columns: repeat(2, 1fr); }
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
        <h1>现代裁缝 · 定制你的专属合身</h1>
        <p>高级版型 | 精选面料 | 手工细节 | 三次试身</p>
        <div className="heroActions">
          <Link href="/appointment" className="btn primary">预约试衣</Link>
          <a href="#gallery" className="btn secondary">查看作品</a>
        </div>
      </div>

      <button className="navBtn left" onClick={prev} aria-label="上一张">‹</button>
      <button className="navBtn right" onClick={next} aria-label="下一张">›</button>

      <div className="dots">
        {images.map((_, i) => (
          <button key={i} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} aria-label={`第 ${i + 1} 张`} />
        ))}
      </div>

      <style jsx>{`
        .carousel { position: relative; height: 100vh; overflow: hidden; }
        .slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transform: scale(1.05); transition: opacity 600ms ease, transform 1200ms ease; }
        .slide.active { opacity: 1; transform: scale(1); }
        .overlay { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; color: #fff; background: linear-gradient(180deg, #00000066, #00000022 30%, #00000066); padding: 0 20px; }
        .overlay h1 { font-size: 44px; margin: 0 0 12px; text-shadow: 0 4px 24px rgba(0,0,0,0.35); }
        .overlay p { margin: 0 0 20px; text-shadow: 0 2px 16px rgba(0,0,0,0.3); }
        .heroActions { display: flex; gap: 12px; justify-content: center; }
        .navBtn { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 999px; border: 1px solid #ffffff88; background: #00000055; color: #fff; display: grid; place-items: center; cursor: pointer; }
        .navBtn.left { left: 16px; }
        .navBtn.right { right: 16px; }
        .dots { position: absolute; bottom: 18px; left: 0; right: 0; display: flex; justify-content: center; gap: 8px; }
        .dot { width: 8px; height: 8px; border-radius: 999px; background: #ffffff88; border: none; cursor: pointer; }
        .dot.active { background: #fff; }
        @media (max-width: 560px) {
          .overlay h1 { font-size: 30px; }
        }
      `}</style>
    </section>
  )
}


