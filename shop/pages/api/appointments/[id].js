import { AppointmentModel } from '../../../../lib/models/Appointment'

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
        // 获取单个预约
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
        // 更新预约
        const { appointmentTime, name, phone, email, notes, isProcessed } = req.body
        
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

      case 'DELETE':
        // 删除预约
        await AppointmentModel.delete(id)

        res.status(200).json({
          success: true,
          message: '预约删除成功'
        })
        break

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
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
