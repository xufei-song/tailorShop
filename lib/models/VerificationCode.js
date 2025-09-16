const { prisma } = require('../prisma')

/**
 * 验证码管理模型
 */
class VerificationCodeModel {
  /**
   * 生成6位数字验证码
   * @returns {string} 6位数字验证码
   */
  static generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * 创建验证码记录
   * @param {Object} params - 验证码参数
   * @param {string} params.email - 邮箱地址
   * @param {string} params.code - 验证码
   * @param {string} params.type - 验证码类型
   * @param {number} params.expiresInMinutes - 过期时间（分钟），默认10分钟
   * @returns {Promise<Object>} 创建的验证码记录
   */
  static async create({ email, code, type = 'verification', expiresInMinutes = 10 }) {
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes)

    // 先使该邮箱的旧验证码失效
    await this.invalidateByEmail(email, type)

    return await prisma.verificationCode.create({
      data: {
        email,
        code,
        type,
        expiresAt
      }
    })
  }

  /**
   * 验证验证码
   * @param {Object} params - 验证参数
   * @param {string} params.email - 邮箱地址
   * @param {string} params.code - 验证码
   * @param {string} params.type - 验证码类型
   * @returns {Promise<Object>} 验证结果
   */
  static async verify({ email, code, type = 'verification' }) {
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        type,
        isUsed: false,
        expiresAt: {
          gt: new Date() // 未过期
        }
      },
      orderBy: {
        createdAt: 'desc' // 获取最新的验证码
      }
    })

    if (!verificationCode) {
      return {
        success: false,
        message: '验证码无效或已过期'
      }
    }

    // 标记验证码为已使用
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { isUsed: true }
    })

    return {
      success: true,
      message: '验证码验证成功'
    }
  }

  /**
   * 使指定邮箱的验证码失效
   * @param {string} email - 邮箱地址
   * @param {string} type - 验证码类型
   * @returns {Promise<void>}
   */
  static async invalidateByEmail(email, type = 'verification') {
    await prisma.verificationCode.updateMany({
      where: {
        email,
        type,
        isUsed: false
      },
      data: {
        isUsed: true
      }
    })
  }

  /**
   * 清理过期的验证码
   * @returns {Promise<number>} 清理的记录数
   */
  static async cleanupExpired() {
    const result = await prisma.verificationCode.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    return result.count
  }

  /**
   * 获取指定邮箱的有效验证码
   * @param {string} email - 邮箱地址
   * @param {string} type - 验证码类型
   * @returns {Promise<Object|null>} 验证码记录或null
   */
  static async getValidCode(email, type = 'verification') {
    return await prisma.verificationCode.findFirst({
      where: {
        email,
        type,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * 检查邮箱是否在冷却期内（防止频繁发送）
   * @param {string} email - 邮箱地址
   * @param {string} type - 验证码类型
   * @param {number} cooldownMinutes - 冷却时间（分钟），默认1分钟
   * @returns {Promise<boolean>} 是否在冷却期内
   */
  static async isInCooldown(email, type = 'verification', cooldownMinutes = 1) {
    const recentCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        type,
        createdAt: {
          gte: new Date(Date.now() - cooldownMinutes * 60 * 1000)
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return !!recentCode
  }

  /**
   * 获取验证码统计信息
   * @returns {Promise<Object>} 统计信息
   */
  static async getStats() {
    const total = await prisma.verificationCode.count()
    const used = await prisma.verificationCode.count({
      where: { isUsed: true }
    })
    const expired = await prisma.verificationCode.count({
      where: {
        expiresAt: { lt: new Date() },
        isUsed: false
      }
    })
    const valid = await prisma.verificationCode.count({
      where: {
        expiresAt: { gt: new Date() },
        isUsed: false
      }
    })

    return {
      total,
      used,
      expired,
      valid
    }
  }
}

module.exports = { VerificationCodeModel }
