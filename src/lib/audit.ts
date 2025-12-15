import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

export async function createAuditLog(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  changes?: Prisma.InputJsonValue,
  ipAddress?: string
) {
  await prisma.auditLog.create({
    data: { userId, action, entity, entityId, changes, ipAddress },
  })
}
