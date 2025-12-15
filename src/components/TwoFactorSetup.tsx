'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TwoFactorSetup({ enabled }: { enabled: boolean }) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSetup = async () => {
    setLoading(true)
    const res = await fetch('/api/profile/2fa/setup', { method: 'POST' })
    const data = await res.json()
    setQrCode(data.qrCode)
    setSecret(data.secret)
    setLoading(false)
  }

  const handleVerify = async () => {
    setError('')
    setLoading(true)
    const res = await fetch('/api/profile/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, secret }),
    })
    setLoading(false)

    if (!res.ok) {
      setError('Invalid code')
      return
    }

    setQrCode(null)
    setSecret(null)
    router.refresh()
  }

  const handleDisable = async () => {
    setLoading(true)
    await fetch('/api/profile/2fa/disable', { method: 'POST' })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Two-Factor Authentication</h2>
      {enabled ? (
        <div>
          <p className="text-green-600 mb-4">2FA is currently enabled</p>
          <button
            onClick={handleDisable}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Disabling...' : 'Disable 2FA'}
          </button>
        </div>
      ) : qrCode ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Scan this QR code with your authenticator app:</p>
          <img src={qrCode} alt="2FA QR Code" className="mx-auto" />
          <p className="text-xs text-gray-500">Manual entry: {secret}</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleVerify}
            disabled={loading || code.length !== 6}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Enable'}
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Protect your account with two-factor authentication</p>
          <button
            onClick={handleSetup}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Setup 2FA'}
          </button>
        </div>
      )}
    </div>
  )
}
