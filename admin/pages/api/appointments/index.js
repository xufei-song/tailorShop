import { AppointmentModel } from '../../../../lib/models/Appointment'
const { sendSimpleTestEmail, sendVerificationCode } = require('../../../../lib/email')
const { VerificationCodeModel } = require('../../../../lib/models/VerificationCode')

// 确保环境变量被设置
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db"
  console.log('设置 DATABASE_URL 环境变量:', process.env.DATABASE_URL)
}

// 检查邮件服务环境变量
if (!process.env.RESEND_API_KEY) {
  process.env.RESEND_API_KEY = "re_DvEBS6Y1_GCFMYcYyYUhuV47Ffo9doFv3"
  console.log('设置 RESEND_API_KEY 环境变量:', process.env.RESEND_API_KEY)
}
if (!process.env.FROM_EMAIL) {
  process.env.FROM_EMAIL = "onboarding@resend.dev"
  console.log('设置 FROM_EMAIL 环境变量:', process.env.FROM_EMAIL)
}

export default async function handler(req, res) {
  const { method } = req

  // 设置 CORS 头
  const allowedOrigins = [
    process.env.SHOP_BASE_URL || 'http://localhost:3000',  // 前端shop地址
    process.env.ADMIN_BASE_URL || 'http://localhost:3001', // 管理端地址
    'https://yourdomain.com', // 备用生产环境域名（可以删除）
    'https://www.yourdomain.com' // 备用生产环境 www 域名（可以删除）
  ]
  
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else if (process.env.NODE_ENV === 'development') {
    // 开发环境允许所有来源
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')

  // 处理 OPTIONS 预检请求
  if (method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // 添加调试打印
  console.log('=== 管理后台 API 请求调试信息 ===')
  console.log('请求方法:', method)
  console.log('请求 URL:', req.url)
  console.log('查询参数:', req.query)
  console.log('请求头:', req.headers)
  console.log('环境变量 DATABASE_URL:', process.env.DATABASE_URL)
  console.log('所有环境变量:', Object.keys(process.env).filter(key => key.includes('DATABASE')))
  console.log('================================')

  try {
    switch (method) {
      case 'GET':
        // 管理后台获取预约列表（包含更多管理功能）
        console.log('处理 GET 请求 - 获取预约列表')
        const { 
          isProcessed, 
          status,
          page = 1, 
          limit = 20,
          startDate,
          endDate 
        } = req.query
        
        const skip = (parseInt(page) - 1) * parseInt(limit)
        
        console.log('查询参数解析:', { isProcessed, status, page, limit, skip, startDate, endDate })
        
        // 验证日期格式
        let startDateObj = null
        let endDateObj = null
        
        if (startDate) {
          startDateObj = new Date(startDate)
          if (isNaN(startDateObj.getTime())) {
            return res.status(400).json({
              success: false,
              message: '开始日期格式不正确，请使用 YYYY-MM-DD 格式'
            })
          }
        }
        
        if (endDate) {
          endDateObj = new Date(endDate)
          if (isNaN(endDateObj.getTime())) {
            return res.status(400).json({
              success: false,
              message: '结束日期格式不正确，请使用 YYYY-MM-DD 格式'
            })
          }
          // 设置结束日期为当天的23:59:59，确保包含整天的数据
          endDateObj.setHours(23, 59, 59, 999)
        }
        
        // 验证日期范围
        if (startDateObj && endDateObj && startDateObj > endDateObj) {
          return res.status(400).json({
            success: false,
            message: '开始日期不能晚于结束日期'
          })
        }
        
        // 验证状态参数
        let statusFilter = undefined
        if (status !== undefined) {
          const statusNum = parseInt(status)
          if (isNaN(statusNum) || statusNum < 0 || statusNum > 3) {
            return res.status(400).json({
              success: false,
              message: '状态参数无效，请使用 0-3 之间的数字：0-未处理，1-拒绝，2-待沟通，3-同意'
            })
          }
          statusFilter = statusNum
        }
        
        let appointments
        console.log('开始调用 AppointmentModel.findAll...')
        
        if (startDateObj && endDateObj) {
          // 根据日期范围查询
          appointments = await AppointmentModel.findByDateRange(
            startDateObj,
            endDateObj
          )
        } else {
          // 普通查询 - 支持状态过滤和isProcessed过滤
          appointments = await AppointmentModel.findAll({
            status: statusFilter,
            isProcessed: isProcessed === 'true' ? true : isProcessed === 'false' ? false : undefined,
            skip,
            take: parseInt(limit),
            startDate: startDateObj,
            endDate: endDateObj
          })
        }
        
        console.log('查询结果:', appointments)

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

        // 发送预约确认邮件
        try {
          const emailResult = await sendAppointmentConfirmation({
            ...newAppointment,
            appointmentTime: newAppointment.appointmentTime.toISOString()
          });
          
          if (emailResult.success) {
            console.log('预约确认邮件发送成功');
          } else {
            console.warn('预约确认邮件发送失败:', emailResult.error);
          }
        } catch (emailError) {
          console.error('发送预约确认邮件时出错:', emailError);
          // 邮件发送失败不影响预约创建，只记录错误
        }

        res.status(201).json({
          success: true,
          data: newAppointment,
          message: '预约创建成功'
        })
        break

      case 'PUT':
        // 邮件发送接口
        const { action, type, appointment, to, subject, template, props } = req.body;

        if (action === 'send-email') {
          // 验证必填字段
          if (!appointment || !appointment.email || !appointment.name) {
            return res.status(400).json({
              success: false,
              message: '预约信息中邮箱和姓名为必填项'
            });
          }

          // 发送简单测试邮件
          const result = await sendSimpleTestEmail(
            appointment.email,
            `预约确认 - ${appointment.name}`,
            `亲爱的 ${appointment.name}，您的预约已成功创建。预约时间：${appointment.appointmentTime}`
          );

          if (result.success) {
            res.status(200).json({
              success: true,
              message: '邮件发送成功',
              data: result.data
            });
          } else {
            res.status(400).json({
              success: false,
              message: '邮件发送失败',
              error: result.error
            });
          }
        } else if (action === 'send-verification-code') {
          // 发送验证码邮件
          const { email, type = '验证码' } = req.body;

          // 验证必填字段
          if (!email) {
            return res.status(400).json({
              success: false,
              message: '邮箱地址为必填项'
            });
          }

          // 检查是否在冷却期内（1分钟内不能重复发送）
          const isInCooldown = await VerificationCodeModel.isInCooldown(email, type, 1);
          if (isInCooldown) {
            return res.status(429).json({
              success: false,
              message: '验证码发送过于频繁，请1分钟后再试'
            });
          }

          // 生成6位数字验证码
          const code = VerificationCodeModel.generateCode();

          // 发送验证码邮件
          const result = await sendVerificationCode(email, code, type);

          if (result.success) {
            // 将验证码存储到数据库，10分钟有效期
            await VerificationCodeModel.create({
              email,
              code,
              type,
              expiresInMinutes: 10
            });

            // 将中文类型转换为英文用于API响应
            let englishType;
            if (type === '注册验证码') {
              englishType = 'Registration Verification Code';
            } else if (type === '登录验证码') {
              englishType = 'Login Verification Code';
            } else if (type === '重置密码验证码') {
              englishType = 'Password Reset Verification Code';
            } else if (type === '验证码') {
              englishType = 'Verification Code';
            } else {
              englishType = type;
            }

            res.status(200).json({
              success: true,
              message: '验证码发送成功',
              data: {
                email: email,
                type: englishType,
                originalType: type, // 保留原始中文类型
                messageId: result.data.id,
                expiresIn: 10 // 10分钟有效期
              }
            });
          } else {
            // 根据错误类型提供更具体的错误信息
            let errorMessage = '验证码发送失败';
            if (result.error && result.error.statusCode === 403) {
              errorMessage = '邮件服务配置问题，请检查发送方域名设置';
            } else if (result.error && result.error.statusCode === 429) {
              errorMessage = '验证码发送过于频繁，请稍后再试';
            } else if (result.error && result.error.message) {
              errorMessage = result.error.message;
            }
            
            res.status(400).json({
              success: false,
              message: errorMessage,
              error: result.error
            });
          }
        } else if (action === 'verify-code') {
          // 验证验证码
          const { email, code, type = '验证码' } = req.body;

          // 验证必填字段
          if (!email || !code) {
            return res.status(400).json({
              success: false,
              message: '邮箱地址和验证码为必填项'
            });
          }

          // 验证验证码
          const verifyResult = await VerificationCodeModel.verify({
            email,
            code,
            type
          });

          if (verifyResult.success) {
            res.status(200).json({
              success: true,
              message: '验证码验证成功'
            });
          } else {
            res.status(400).json({
              success: false,
              message: verifyResult.message
            });
          }
        } else if (action === 'email-status') {
          // 获取邮件服务状态
          res.status(200).json({
            success: true,
            data: {
              service: 'Resend',
              configured: !!process.env.RESEND_API_KEY,
              fromEmail: process.env.FROM_EMAIL || 'noreply@resend.dev',
              supportedTypes: [
                'appointment_confirmation',
                'appointment_reminder',
                'verification_code',
                'custom'
              ]
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: '无效的操作。支持的操作：send-email, send-verification-code, verify-code, email-status'
          });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        res.status(405).json({
          success: false,
          message: `方法 ${method} 不被允许`
        })
    }
  } catch (error) {
    console.error('=== 管理后台 API 错误详情 ===')
    console.error('错误类型:', error.constructor.name)
    console.error('错误消息:', error.message)
    console.error('错误堆栈:', error.stack)
    console.error('============================')
    
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
