import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'shop', 'data', 'carousel.json')
    const json = fs.readFileSync(filePath, 'utf-8')
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.setHeader('cache-control', 'no-store')
    res.status(200).send(json)
  } catch (e) {
    res.status(500).json({ error: 'Failed to load carousel config' })
  }
}


