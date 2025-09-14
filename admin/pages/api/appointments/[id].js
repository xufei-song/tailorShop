import { AppointmentModel } from '../../../../lib/models/Appointment'

// 确保环境变量被设置
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db"
  console.log('设置 DATABASE_URL 环境变量:', process.env.DATABASE_URL)
}

export default async function handler(req, res) {
  const { method, query } = req
  const { id } = query

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: '无效的预约ID'
    })
  }

  try {
    switch (method) {
      case 'GET':
        // 获取单个预约详情
        const appointment = await AppointmentModel.findById(id)
        
        if (!appointment) {
          return res.status(404).json({
            success: false,
            message: '预约不存在'
          })
        }

        res.status(200).json({
          success: true,
          data: appointment
        })
        break

      case 'PUT':
        // 更新预约（管理后台版本，支持更多字段）
        const { 
          appointmentTime, 
          name, 
          phone, 
          email, 
          notes, 
          isProcessed 
        } = req.body
        
        const updateData = {}
        if (appointmentTime) updateData.appointmentTime = new Date(appointmentTime)
        if (name) updateData.name = name
        if (phone) updateData.phone = phone
        if (email) updateData.email = email
        if (notes !== undefined) updateData.notes = notes
        if (typeof isProcessed === 'boolean') updateData.isProcessed = isProcessed

        const updatedAppointment = await AppointmentModel.update(id, updateData)

        res.status(200).json({
          success: true,
          data: updatedAppointment,
          message: '预约更新成功'
        })
        break

      case 'PATCH':
        // 快速标记为已处理
        const { action } = req.body
        
        if (action === 'mark-processed') {
          const processedAppointment = await AppointmentModel.markAsProcessed(id)
          res.status(200).json({
            success: true,
            data: processedAppointment,
            message: '预约已标记为处理完成'
          })
        } else {
          res.status(400).json({
            success: false,
            message: '无效的操作'
          })
        }
        break

      case 'DELETE':
        // 删除预约
        await AppointmentModel.delete(id)

        res.status(200).json({
          success: true,
          message: '预约删除成功'
        })
        break

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE'])
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
