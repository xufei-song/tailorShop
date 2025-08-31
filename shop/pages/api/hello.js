export default function handler(req, res) {
  res.setHeader('content-type', 'text/plain; charset=utf-8')
  res.status(200).send('你好，来自 mock API 的文本')
}


