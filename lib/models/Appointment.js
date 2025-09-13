/**
 * Appointment 数据模型
 * 预约管理相关的方法
 */

import { prisma } from '../prisma'

export class AppointmentModel {
  /**
   * 创建新预约
   * @param {Object} appointmentData - 预约数据
   * @param {Date} appointmentData.appointmentTime - 预约时间
   * @param {string} appointmentData.name - 姓名
   * @param {string} appointmentData.phone - 手机号
   * @param {string} appointmentData.email - 邮箱地址
   * @param {string} [appointmentData.notes] - 备注
   * @returns {Promise<Object>} 创建的预约记录
   */
  static async create(appointmentData) {
    try {
      const appointment = await prisma.appointment.create({
        data: {
          appointmentTime: appointmentData.appointmentTime,
          name: appointmentData.name,
          phone: appointmentData.phone,
          email: appointmentData.email,
          notes: appointmentData.notes || null,
          isProcessed: false
        }
      })
      return appointment
    } catch (error) {
      console.error('创建预约失败:', error)
      throw new Error('创建预约失败')
    }
  }

  /**
   * 根据ID获取预约
   * @param {number} id - 预约ID
   * @returns {Promise<Object|null>} 预约记录
   */
  static async findById(id) {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: parseInt(id) }
      })
      return appointment
    } catch (error) {
      console.error('获取预约失败:', error)
      throw new Error('获取预约失败')
    }
  }

  /**
   * 获取所有预约
   * @param {Object} options - 查询选项
   * @param {boolean} [options.isProcessed] - 是否处理
   * @param {number} [options.skip] - 跳过记录数
   * @param {number} [options.take] - 获取记录数
   * @param {Date} [options.startDate] - 开始日期
   * @param {Date} [options.endDate] - 结束日期
   * @returns {Promise<Array>} 预约列表
   */
  static async findAll(options = {}) {
    try {
      const { isProcessed, skip = 0, take = 50, startDate, endDate } = options
      
      const where = {}
      if (typeof isProcessed === 'boolean') {
        where.isProcessed = isProcessed
      }

      // 添加时间范围查询
      if (startDate || endDate) {
        where.appointmentTime = {}
        if (startDate) {
          where.appointmentTime.gte = startDate
        }
        if (endDate) {
          where.appointmentTime.lte = endDate
        }
      }

      const appointments = await prisma.appointment.findMany({
        where,
        skip,
        take,
        orderBy: {
          appointmentTime: 'asc'
        }
      })
      return appointments
    } catch (error) {
      console.error('获取预约列表失败:', error)
      throw new Error('获取预约列表失败')
    }
  }

  /**
   * 更新预约
   * @param {number} id - 预约ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新后的预约记录
   */
  static async update(id, updateData) {
    try {
      const appointment = await prisma.appointment.update({
        where: { id: parseInt(id) },
        data: updateData
      })
      return appointment
    } catch (error) {
      console.error('更新预约失败:', error)
      throw new Error('更新预约失败')
    }
  }

  /**
   * 标记预约为已处理
   * @param {number} id - 预约ID
   * @returns {Promise<Object>} 更新后的预约记录
   */
  static async markAsProcessed(id) {
    try {
      const appointment = await prisma.appointment.update({
        where: { id: parseInt(id) },
        data: { isProcessed: true }
      })
      return appointment
    } catch (error) {
      console.error('标记预约为已处理失败:', error)
      throw new Error('标记预约为已处理失败')
    }
  }

  /**
   * 删除预约
   * @param {number} id - 预约ID
   * @returns {Promise<Object>} 删除的预约记录
   */
  static async delete(id) {
    try {
      const appointment = await prisma.appointment.delete({
        where: { id: parseInt(id) }
      })
      return appointment
    } catch (error) {
      console.error('删除预约失败:', error)
      throw new Error('删除预约失败')
    }
  }

  /**
   * 根据日期范围获取预约
   * @param {Date} startDate - 开始日期
   * @param {Date} endDate - 结束日期
   * @returns {Promise<Array>} 预约列表
   */
  static async findByDateRange(startDate, endDate) {
    try {
      const appointments = await prisma.appointment.findMany({
        where: {
          appointmentTime: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: {
          appointmentTime: 'asc'
        }
      })
      return appointments
    } catch (error) {
      console.error('根据日期范围获取预约失败:', error)
      throw new Error('根据日期范围获取预约失败')
    }
  }

  /**
   * 获取预约统计信息
   * @returns {Promise<Object>} 统计信息
   */
  static async getStats() {
    try {
      const [total, processed, pending] = await Promise.all([
        prisma.appointment.count(),
        prisma.appointment.count({ where: { isProcessed: true } }),
        prisma.appointment.count({ where: { isProcessed: false } })
      ])

      return {
        total,
        processed,
        pending
      }
    } catch (error) {
      console.error('获取预约统计失败:', error)
      throw new Error('获取预约统计失败')
    }
  }
}
