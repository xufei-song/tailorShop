import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Button,
  Row,
  Column,
} from '@react-email/components';

export default function AppointmentConfirmation({ 
  appointment = {
    name: '客户姓名',
    phone: '13800138000',
    email: 'customer@example.com',
    appointmentTime: '2024-01-01 10:00',
    notes: '备注信息',
    status: 0
  }
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      0: '待处理',
      1: '已拒绝',
      2: '待沟通',
      3: '已同意'
    };
    return statusMap[status] || '未知状态';
  };

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* 头部 */}
          <Section style={header}>
            <Heading style={h1}>预约确认通知</Heading>
            <Text style={subtitle}>感谢您选择我们的定制服务</Text>
          </Section>

          {/* 主要内容 */}
          <Section style={content}>
            <Text style={greeting}>亲爱的 {appointment.name}，</Text>
            
            <Text style={paragraph}>
              您的预约申请已成功提交，我们已收到您的预约信息。以下是您的预约详情：
            </Text>

            {/* 预约信息卡片 */}
            <Section style={card}>
              <Row>
                <Column style={labelColumn}>
                  <Text style={label}>预约时间：</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{formatDate(appointment.appointmentTime)}</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={label}>客户姓名：</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{appointment.name}</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={label}>联系电话：</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{appointment.phone}</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={label}>邮箱地址：</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{appointment.email}</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={label}>当前状态：</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={statusValue}>{getStatusText(appointment.status)}</Text>
                </Column>
              </Row>
              
              {appointment.notes && (
                <Row>
                  <Column style={labelColumn}>
                    <Text style={label}>备注信息：</Text>
                  </Column>
                  <Column style={valueColumn}>
                    <Text style={value}>{appointment.notes}</Text>
                  </Column>
                </Row>
              )}
            </Section>

            <Text style={paragraph}>
              我们将在 24 小时内审核您的预约申请，并通过电话或邮件与您确认具体的服务时间。
              如有任何疑问，请随时联系我们。
            </Text>

            {/* 联系信息 */}
            <Section style={contactInfo}>
              <Text style={contactTitle}>联系我们</Text>
              <Text style={contactText}>电话：400-123-4567</Text>
              <Text style={contactText}>邮箱：service@tailorshop.com</Text>
              <Text style={contactText}>地址：北京市朝阳区定制街123号</Text>
            </Section>
          </Section>

          <Hr style={hr} />
          
          {/* 页脚 */}
          <Section style={footer}>
            <Text style={footerText}>
              此邮件由系统自动发送，请勿回复。
            </Text>
            <Text style={footerText}>
              © 2024 TailorShop 定制工坊. 保留所有权利。
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// 样式定义
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px 0',
  textAlign: 'center',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  padding: '0',
};

const subtitle = {
  color: '#6b7280',
  fontSize: '16px',
  margin: '0 0 32px',
};

const content = {
  padding: '0 24px',
};

const greeting = {
  color: '#1f2937',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 24px',
};

const card = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const labelColumn = {
  width: '30%',
  verticalAlign: 'top',
};

const valueColumn = {
  width: '70%',
  verticalAlign: 'top',
};

const label = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 8px',
};

const value = {
  color: '#1f2937',
  fontSize: '14px',
  margin: '0 0 8px',
};

const statusValue = {
  color: '#059669',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 8px',
};

const contactInfo = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const contactTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const contactText = {
  color: '#4b5563',
  fontSize: '14px',
  margin: '0 0 4px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  padding: '0 24px',
  textAlign: 'center',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 4px',
};
