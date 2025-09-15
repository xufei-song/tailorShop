// 简单的邮件发送测试
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

/**
 * 发送简单测试邮件
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

module.exports = {
  sendSimpleTestEmail
};
