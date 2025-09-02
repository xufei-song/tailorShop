import { AppointmentModel } from '../../../lib/models/Appointment'

export default async function handler(req, res) {
  const { method } = req

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({
      success: false,
      message: `方法 ${method} 不被允许`
    })
  }

  try {
    // 获取预约统计信息
    const stats = await AppointmentModel.getStats()

    res.status(200).json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('获取统计信息失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
}
