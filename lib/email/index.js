// 邮件服务配置和工具函数
const { Resend } = require('resend');

// 确保环境变量被设置
if (!process.env.RESEND_API_KEY) {
  process.env.RESEND_API_KEY = "re_DvEBS6Y1_GCFMYcYyYUhuV47Ffo9doFv3"
  console.log('设置 RESEND_API_KEY 环境变量:', process.env.RESEND_API_KEY)
}
if (!process.env.FROM_EMAIL) {
  process.env.FROM_EMAIL = "onboarding@resend.dev"
  console.log('设置 FROM_EMAIL 环境变量:', process.env.FROM_EMAIL)
}

const resend = new Resend(process.env.RESEND_API_KEY);

// 邮件模板导入（暂时注释，使用HTML模板）
// const AppointmentConfirmation = require('./templates/AppointmentConfirmation').default;
// const AppointmentReminder = require('./templates/AppointmentReminder').default;

/**
 * 发送简单测试邮件
 * @param {string} to - 收件人邮箱
 * @param {string} subject - 邮件主题
 * @param {string} content - 邮件内容
 * @returns {Promise<Object>} 发送结果
 */
async function sendSimpleTestEmail(to, subject, content) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [to],
      subject: subject,
      html: `<h1>测试邮件</h1><p>${content}</p>`,
    });

    if (error) {
      console.error('邮件发送失败:', error);
      return { success: false, error };
    }

    console.log('邮件发送成功:', data);
    return { success: true, data };
  } catch (error) {
    console.error('发送邮件时出错:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 发送验证码邮件
 * @param {string} to - 收件人邮箱
 * @param {string} code - 验证码
 * @param {string} type - 验证码类型（如：注册、登录、重置密码等）
 * @returns {Promise<Object>} 发送结果
 */
async function sendVerificationCode(to, code, type = '验证码') {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY 环境变量未设置');
    }

    // 处理中文主题，使用英文作为备选
    let subject;
    if (type === '注册验证码') {
      subject = 'Registration Verification Code - TailorShop';
    } else if (type === '登录验证码') {
      subject = 'Login Verification Code - TailorShop';
    } else if (type === '重置密码验证码') {
      subject = 'Password Reset Verification Code - TailorShop';
    } else if (type === '验证码') {
      subject = 'Verification Code - TailorShop';
    } else {
      // 对于其他类型，使用英文
      subject = `${type} - TailorShop`;
    }
    
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: [to],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${type} - TailorShop</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Microsoft YaHei', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
            <!-- 邮件头部 -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px;">TailorShop 定制工坊</h1>
              <p style="color: #e8e8e8; margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">您的专属高端定制服务</p>
            </div>
            
            <!-- 主要内容区域 -->
            <div style="padding: 40px 30px;">
              <!-- 验证码卡片 -->
              <div style="background-color: #f8f9fa; padding: 40px 30px; border-radius: 12px; text-align: center; margin: 20px 0; border: 1px solid #e9ecef;">
                <h2 style="color: #2c3e50; margin: 0 0 30px 0; font-size: 24px; font-weight: 500;">${type}</h2>
                
                <!-- 验证码显示区域 -->
                <div style="background-color: #ffffff; padding: 30px 20px; border-radius: 10px; border: 2px dashed #3498db; margin: 20px 0; box-shadow: 0 2px 10px rgba(52, 152, 219, 0.1);">
                  <p style="color: #7f8c8d; margin: 0 0 15px 0; font-size: 16px; font-weight: 400;">您的验证码是：</p>
                  <div style="font-size: 36px; font-weight: 700; color: #3498db; letter-spacing: 8px; margin: 15px 0; font-family: 'Courier New', monospace;">${code}</div>
                </div>
                
                <p style="color: #7f8c8d; margin: 25px 0 0 0; font-size: 15px; font-weight: 400;">
                  <span style="color: #e74c3c; font-weight: 600;">⏰</span> 验证码有效期为 <strong style="color: #e74c3c;">10 分钟</strong>，请及时使用
                </p>
              </div>
              
              <!-- 安全提示 -->
              <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f39c12;">
                <p style="color: #8a6d3b; margin: 0; font-size: 14px; line-height: 1.5;">
                  <strong style="color: #d68910;">🔒 安全提示：</strong>请勿将验证码泄露给他人，我们不会主动向您索要验证码。如非本人操作，请忽略此邮件。
                </p>
              </div>
              
              <!-- 使用说明 -->
              <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3498db;">
                <p style="color: #2c3e50; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">📋 使用说明：</p>
                <ul style="color: #34495e; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                  <li>请在相应的页面输入上述验证码</li>
                  <li>验证码区分大小写，请准确输入</li>
                  <li>如验证码已过期，请重新获取</li>
                </ul>
              </div>
            </div>
            
            <!-- 邮件底部 -->
            <div style="background-color: #2c3e50; padding: 30px 20px; text-align: center;">
              <p style="color: #bdc3c7; font-size: 12px; margin: 0 0 10px 0; line-height: 1.4;">
                此邮件由系统自动发送，请勿回复。<br>
                如有疑问，请联系我们的客服团队。
              </p>
              <p style="color: #95a5a6; font-size: 11px; margin: 0;">
                © 2024 TailorShop 定制工坊. 保留所有权利。
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const { data, error } = await resend.emails.send(mailOptions);

    if (error) {
      console.error('验证码邮件发送失败:', error);
      return { success: false, error };
    }

    console.log('验证码邮件发送成功:', data);
    return { success: true, data };
  } catch (error) {
    console.error('发送验证码邮件时出错:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 发送预约确认邮件
 * @param {Object} appointment - 预约信息
 * @param {string} appointment.name - 客户姓名
 * @param {string} appointment.phone - 联系电话
 * @param {string} appointment.email - 邮箱地址
 * @param {string} appointment.appointmentTime - 预约时间
 * @param {string} appointment.notes - 备注信息
 * @param {number} appointment.status - 预约状态
 * @returns {Promise<Object>} 发送结果
 */
async function sendAppointmentConfirmation(appointment) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY 环境变量未设置');
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@resend.dev',
      to: [appointment.email],
      subject: `预约确认 - ${appointment.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">预约确认</h1>
          <p>客户姓名：${appointment.name}</p>
          <p>预约时间：${appointment.appointmentTime}</p>
          <p>联系电话：${appointment.phone}</p>
          <p>邮箱地址：${appointment.email}</p>
          ${appointment.notes ? `<p>备注：${appointment.notes}</p>` : ''}
        </div>
      `,
    });

    if (error) {
      console.error('邮件发送失败:', error);
      return { success: false, error };
    }

    console.log('预约确认邮件发送成功:', data);
    return { success: true, data };
  } catch (error) {
    console.error('发送预约确认邮件时出错:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 发送预约提醒邮件
 * @param {Object} appointment - 预约信息
 * @returns {Promise<Object>} 发送结果
 */
async function sendAppointmentReminder(appointment) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY 环境变量未设置');
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@resend.dev',
      to: [appointment.email],
      subject: `预约提醒 - ${appointment.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">预约提醒</h1>
          <p>客户姓名：${appointment.name}</p>
          <p>预约时间：${appointment.appointmentTime}</p>
          <p>联系电话：${appointment.phone}</p>
          <p>邮箱地址：${appointment.email}</p>
          ${appointment.notes ? `<p>备注：${appointment.notes}</p>` : ''}
        </div>
      `,
    });

    if (error) {
      console.error('邮件发送失败:', error);
      return { success: false, error };
    }

    console.log('预约提醒邮件发送成功:', data);
    return { success: true, data };
  } catch (error) {
    console.error('发送预约提醒邮件时出错:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 发送自定义邮件
 * @param {Object} options - 邮件选项
 * @param {string} options.to - 收件人邮箱
 * @param {string} options.subject - 邮件主题
 * @param {React.Component} options.template - 邮件模板组件
 * @param {Object} options.props - 模板属性
 * @returns {Promise<Object>} 发送结果
 */
async function sendCustomEmail({ to, subject, template, props = {} }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY 环境变量未设置');
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@resend.dev',
      to: [to],
      subject,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><h1>${subject}</h1><p>自定义邮件内容</p></div>`,
    });

    if (error) {
      console.error('邮件发送失败:', error);
      return { success: false, error };
    }

    console.log('自定义邮件发送成功:', data);
    return { success: true, data };
  } catch (error) {
    console.error('发送自定义邮件时出错:', error);
    return { success: false, error: error.message };
  }
}

// 导出所有邮件功能
module.exports = {
  sendSimpleTestEmail,
  sendVerificationCode,
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendCustomEmail
};
