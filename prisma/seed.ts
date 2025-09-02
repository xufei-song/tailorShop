import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始种子数据...')

  // 创建示例预约数据
  const sampleAppointments = [
    {
      appointmentTime: new Date('2024-01-15T10:00:00Z'),
      name: '张三',
      phone: '13800138001',
      email: 'zhangsan@example.com',
      notes: '首次预约，需要量体',
      isProcessed: false
    },
    {
      appointmentTime: new Date('2024-01-16T14:00:00Z'),
      name: '李四',
      phone: '13800138002',
      email: 'lisi@example.com',
      notes: '修改上次的订单',
      isProcessed: true
    },
    {
      appointmentTime: new Date('2024-01-17T16:00:00Z'),
      name: '王五',
      phone: '13800138003',
      email: 'wangwu@example.com',
      notes: '试穿成品',
      isProcessed: false
    }
  ]

  for (const appointment of sampleAppointments) {
    await prisma.appointment.create({
      data: appointment
    })
  }

  console.log('种子数据创建完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
