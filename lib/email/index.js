// 邮件服务配置和工具函数
const { Resend } = require('resend');

// 确保环境变量被设置
if (!process.env.RESEND_API_KEY) {
  console.warn('警告: RESEND_API_KEY 环境变量未设置，邮件发送功能将不可用');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// 邮件模板导入
const AppointmentConfirmation = require('./templates/AppointmentConfirmation').default;
const AppointmentReminder = require('./templates/AppointmentReminder').default;

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
export async function sendAppointmentConfirmation(appointment) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY 环境变量未设置');
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@resend.dev',
      to: [appointment.email],
      subject: `预约确认 - ${appointment.name}`,
      react: AppointmentConfirmation({ appointment }),
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
export async function sendAppointmentReminder(appointment) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY 环境变量未设置');
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@resend.dev',
      to: [appointment.email],
      subject: `预约提醒 - ${appointment.name}`,
      react: AppointmentReminder({ appointment }),
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
export async function sendCustomEmail({ to, subject, template, props = {} }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY 环境变量未设置');
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@resend.dev',
      to: [to],
      subject,
      react: template(props),
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

// 导出模板组件供外部使用
module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendCustomEmail,
  AppointmentConfirmation,
  AppointmentReminder
};
