import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProfileForm from '@/components/ProfileForm'
import TwoFactorSetup from '@/components/TwoFactorSetup'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  const employee = await prisma.employee.findUnique({
    where: { id: session?.user.id },
    include: { position: { include: { department: true } }, organization: true },
  })

  if (!employee) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileForm employee={employee} />
        <TwoFactorSetup enabled={employee.twoFactorEnabled} />
      </div>
    </div>
  )
}
