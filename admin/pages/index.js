export default function AdminHome() {
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
          <a className="card" href="#orders">
            <h3>订单管理</h3>
            <p>查看与更新客户订单状态。</p>
          </a>
          <a className="card" href="#customers">
            <h3>客户管理</h3>
            <p>客户档案、量体数据与偏好。</p>
          </a>
          <a className="card" href="#inventory">
            <h3>面料库存</h3>
            <p>品牌、色卡、库存与采购。</p>
          </a>
          <a className="card" href="#calendar">
            <h3>预约日历</h3>
            <p>试衣与量体安排一目了然。</p>
          </a>
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
        .card { display: block; padding: 16px; border: 1px solid #e2e8f0; border-radius: 10px; text-decoration: none; color: inherit; background: #fff; }
        .card:hover { border-color: #0f172a; }
        @media (max-width: 960px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}


