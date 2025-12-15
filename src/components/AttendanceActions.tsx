'use client'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface Attendance {
  id: string
  timeIn: string | null
  timeOut: string | null
}

export default function AttendanceActions({ todayAttendance }: { todayAttendance: Attendance | null }) {
  const router = useRouter()

  const handleClockIn = async () => {
    await fetch('/api/attendance/clock-in', { method: 'POST' })
    router.refresh()
  }

  const handleClockOut = async () => {
    await fetch('/api/attendance/clock-out', { method: 'POST' })
    router.refresh()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Attendance</h2>
          <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <div className="flex items-center gap-4">
          {todayAttendance?.timeIn && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              In: {format(new Date(todayAttendance.timeIn), 'hh:mm a')}
            </span>
          )}
          {todayAttendance?.timeOut && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Out: {format(new Date(todayAttendance.timeOut), 'hh:mm a')}
            </span>
          )}
          {!todayAttendance?.timeIn && (
            <button
              onClick={handleClockIn}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Clock In
            </button>
          )}
          {todayAttendance?.timeIn && !todayAttendance?.timeOut && (
            <button
              onClick={handleClockOut}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Clock Out
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
