import { AppointmentModel } from '../../../../lib/models/Appointment'

export default async function handler(req, res) {
  const { method } = req

  // 添加调试打印
  console.log('=== API 请求调试信息 ===')
  console.log('请求方法:', method)
  console.log('请求 URL:', req.url)
  console.log('查询参数:', req.query)
  console.log('请求头:', req.headers)
  console.log('环境变量 DATABASE_URL:', process.env.DATABASE_URL)
  console.log('所有环境变量:', Object.keys(process.env).filter(key => key.includes('DATABASE')))
  console.log('========================')

  try {
    switch (method) {
      case 'GET':
        // 获取预约列表
        console.log('处理 GET 请求 - 获取预约列表')
        const { isProcessed, page = 1, limit = 10 } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)
        
        console.log('查询参数解析:', { isProcessed, page, limit, skip })
        
        console.log('开始调用 AppointmentModel.findAll...')
        const appointments = await AppointmentModel.findAll({
          isProcessed: isProcessed === 'true' ? true : isProcessed === 'false' ? false : undefined,
          skip,
          take: parseInt(limit)
        })
        console.log('查询结果:', appointments)

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
    console.error('=== API 错误详情 ===')
    console.error('错误类型:', error.constructor.name)
    console.error('错误消息:', error.message)
    console.error('错误堆栈:', error.stack)
    console.error('==================')
    
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
