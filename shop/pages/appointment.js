import Link from 'next/link'

export default function AppointmentPage() {
  return (
    <main className="container">
      <h1>预约试衣</h1>
      <p>这是预约页面占位内容。后续将接入预约表单与可用时段。</p>
      <p>
        <Link href="/">返回首页</Link>
      </p>

      <style jsx>{`
        .container { max-width: 720px; margin: 40px auto; padding: 0 20px; }
      `}</style>
    </main>
  )
}


