/**
 * Appointment 数据模型
 * 预约管理相关的方法
 */

import { prisma } from '../prisma'

// 预约状态常量
export const APPOINTMENT_STATUS = {
  PENDING: 0,      // 未处理
  REJECTED: 1,     // 拒绝
  PENDING_COMMUNICATION: 2, // 待沟通
  APPROVED: 3      // 同意
}

// 状态名称映射
export const STATUS_NAMES = {
  [APPOINTMENT_STATUS.PENDING]: '未处理',
  [APPOINTMENT_STATUS.REJECTED]: '拒绝',
  [APPOINTMENT_STATUS.PENDING_COMMUNICATION]: '待沟通',
  [APPOINTMENT_STATUS.APPROVED]: '同意'
}

export class AppointmentModel {
  /**
   * 创建新预约
   * @param {Object} appointmentData - 预约数据
   * @param {Date} appointmentData.appointmentTime - 预约时间
   * @param {string} appointmentData.name - 姓名
   * @param {string} appointmentData.phone - 手机号
   * @param {string} appointmentData.email - 邮箱地址
   * @param {string} [appointmentData.notes] - 备注
   * @param {number} [appointmentData.status] - 状态，默认为未处理
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
          status: appointmentData.status || APPOINTMENT_STATUS.PENDING
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
   * @param {number} [options.status] - 状态筛选
   * @param {number} [options.skip] - 跳过记录数
   * @param {number} [options.take] - 获取记录数
   * @param {Date} [options.startDate] - 开始日期
   * @param {Date} [options.endDate] - 结束日期
   * @returns {Promise<Array>} 预约列表
   */
  static async findAll(options = {}) {
    try {
      const { status, skip = 0, take = 50, startDate, endDate } = options
      
      const where = {}
      
      // 状态筛选
      if (typeof status === 'number') {
        where.status = status
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
   * 更新预约状态
   * @param {number} id - 预约ID
   * @param {number} status - 新状态
   * @returns {Promise<Object>} 更新后的预约记录
   */
  static async updateStatus(id, status) {
    try {
      const appointment = await prisma.appointment.update({
        where: { id: parseInt(id) },
        data: { status: parseInt(status) }
      })
      return appointment
    } catch (error) {
      console.error('更新预约状态失败:', error)
      throw new Error('更新预约状态失败')
    }
  }

  /**
   * 标记预约为已处理（兼容性方法）
   * @param {number} id - 预约ID
   * @returns {Promise<Object>} 更新后的预约记录
   * @deprecated 请使用 updateStatus(id, APPOINTMENT_STATUS.APPROVED)
   */
  static async markAsProcessed(id) {
    return this.updateStatus(id, APPOINTMENT_STATUS.APPROVED)
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
      const [total, pending, rejected, pendingCommunication, approved] = await Promise.all([
        prisma.appointment.count(),
        prisma.appointment.count({ where: { status: APPOINTMENT_STATUS.PENDING } }),
        prisma.appointment.count({ where: { status: APPOINTMENT_STATUS.REJECTED } }),
        prisma.appointment.count({ where: { status: APPOINTMENT_STATUS.PENDING_COMMUNICATION } }),
        prisma.appointment.count({ where: { status: APPOINTMENT_STATUS.APPROVED } })
      ])

      return {
        total,
        pending,
        rejected,
        pendingCommunication,
        approved,
        // 兼容性字段
        processed: approved
      }
    } catch (error) {
      console.error('获取预约统计失败:', error)
      throw new Error('获取预约统计失败')
    }
  }

  /**
   * 标记预约为拒绝
   * @param {number} id - 预约ID
   * @returns {Promise<Object>} 更新后的预约记录
   */
  static async reject(id) {
    return this.updateStatus(id, APPOINTMENT_STATUS.REJECTED)
  }

  /**
   * 标记预约为待沟通
   * @param {number} id - 预约ID
   * @returns {Promise<Object>} 更新后的预约记录
   */
  static async markAsPendingCommunication(id) {
    return this.updateStatus(id, APPOINTMENT_STATUS.PENDING_COMMUNICATION)
  }

  /**
   * 标记预约为同意
   * @param {number} id - 预约ID
   * @returns {Promise<Object>} 更新后的预约记录
   */
  static async approve(id) {
    return this.updateStatus(id, APPOINTMENT_STATUS.APPROVED)
  }

  /**
   * 获取状态名称
   * @param {number} status - 状态值
   * @returns {string} 状态名称
   */
  static getStatusName(status) {
    return STATUS_NAMES[status] || '未知状态'
  }

  /**
   * 获取所有状态选项
   * @returns {Array<Object>} 状态选项数组
   */
  static getStatusOptions() {
    return Object.entries(STATUS_NAMES).map(([value, name]) => ({
      value: parseInt(value),
      name
    }))
  }
}
