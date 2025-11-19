import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthContext } from '../context/AuthContext'

interface ProtectedRouteProps {
  requireRole?: 'admin' | 'user'
  children: ReactNode
}

export function ProtectedRoute({ requireRole, children }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-500">인증 정보를 확인하는 중...</div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/" replace />
  }

  if (requireRole && profile?.role !== requireRole) {
    return <Navigate to="/home" replace />
  }

  if (profile?.status === 'blocked' || profile?.status === 'pending') {
    const isPending = profile.status === 'pending'
    return (
      <div className={`min-h-screen flex items-center justify-center ${isPending ? 'bg-yellow-50' : 'bg-red-50'}`}>
        <div className="p-6 bg-white shadow rounded-lg text-center space-y-2">
          <p className={`font-semibold ${isPending ? 'text-yellow-700' : 'text-red-600'}`}>
            {isPending ? '승인 대기 중인 계정입니다.' : '접근이 제한된 계정입니다.'}
          </p>
          <p className="text-sm text-slate-600">문제가 지속되면 관리자에게 문의해주세요.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}


