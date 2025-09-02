import { AppointmentModel } from '../../../lib/models/Appointment'

export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        // 管理后台获取预约列表（包含更多管理功能）
        const { 
          isProcessed, 
          page = 1, 
          limit = 20,
          startDate,
          endDate 
        } = req.query
        
        const skip = (parseInt(page) - 1) * parseInt(limit)
        
        let appointments
        if (startDate && endDate) {
          // 根据日期范围查询
          appointments = await AppointmentModel.findByDateRange(
            new Date(startDate),
            new Date(endDate)
          )
        } else {
          // 普通查询
          appointments = await AppointmentModel.findAll({
            isProcessed: isProcessed === 'true' ? true : isProcessed === 'false' ? false : undefined,
            skip,
            take: parseInt(limit)
          })
        }

        // 获取统计信息
        const stats = await AppointmentModel.getStats()

        res.status(200).json({
          success: true,
          data: appointments,
          stats,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: stats.total
          }
        })
        break

      case 'POST':
        // 管理后台创建预约（可能用于手动添加）
        const { appointmentTime, name, phone, email, notes } = req.body

        if (!appointmentTime || !name || !phone || !email) {
          return res.status(400).json({
            success: false,
            message: '预约时间、姓名、手机号和邮箱为必填项'
          })
        }

        const newAppointment = await AppointmentModel.create({
          appointmentTime: new Date(appointmentTime),
          name,
          phone,
          email,
          notes
        })

        res.status(201).json({
          success: true,
          data: newAppointment,
          message: '预约创建成功'
        })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).json({
          success: false,
          message: `方法 ${method} 不被允许`
        })
    }
  } catch (error) {
    console.error('管理后台 API 错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
}
