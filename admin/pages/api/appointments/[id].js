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

        // 如果状态发生变化，发送邮件通知
        if (updateData.isProcessed !== undefined) {
          try {
            const emailResult = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/appointments`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'send-email',
                type: 'appointment_confirmation',
                appointment: {
                  ...updatedAppointment,
                  appointmentTime: updatedAppointment.appointmentTime.toISOString()
                }
              })
            });

            const emailResponse = await emailResult.json();
            
            if (emailResponse.success) {
              console.log('预约状态更新邮件发送成功');
            } else {
              console.warn('预约状态更新邮件发送失败:', emailResponse.error);
            }
          } catch (emailError) {
            console.error('发送预约状态更新邮件时出错:', emailError);
            // 邮件发送失败不影响预约更新，只记录错误
          }
        }

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
          
          // 发送预约处理完成邮件通知
          try {
            const emailResult = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/appointments`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'send-email',
                type: 'appointment_confirmation',
                appointment: {
                  ...processedAppointment,
                  appointmentTime: processedAppointment.appointmentTime.toISOString()
                }
              })
            });

            const emailResponse = await emailResult.json();
            
            if (emailResponse.success) {
              console.log('预约处理完成邮件发送成功');
            } else {
              console.warn('预约处理完成邮件发送失败:', emailResponse.error);
            }
          } catch (emailError) {
            console.error('发送预约处理完成邮件时出错:', emailError);
            // 邮件发送失败不影响预约处理，只记录错误
          }
          
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
