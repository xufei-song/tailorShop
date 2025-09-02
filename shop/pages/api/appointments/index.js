import { AppointmentModel } from '../../../../lib/models/Appointment'

export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        // 获取预约列表
        const { isProcessed, page = 1, limit = 10 } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)
        
        const appointments = await AppointmentModel.findAll({
          isProcessed: isProcessed === 'true' ? true : isProcessed === 'false' ? false : undefined,
          skip,
          take: parseInt(limit)
        })

        res.status(200).json({
          success: true,
          data: appointments
        })
        break

      case 'POST':
        // 创建新预约
        const { appointmentTime, name, phone, email, notes } = req.body

        // 验证必填字段
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
    console.error('API 错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
}
