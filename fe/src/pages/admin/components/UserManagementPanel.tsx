import type { UserProfile } from '../../../context/AuthContext'

type Status = UserProfile['status']
type Role = UserProfile['role']

interface UserManagementPanelProps {
  users: UserProfile[]
  loading: boolean
  actionUserId: string | null
  onRefresh: () => void
  onStatusChange: (userId: string, status: Status) => void
  onRoleChange: (userId: string, role: Role) => void
}

const statusLabels: Record<Status, string> = {
  pending: '승인 대기',
  approved: '승인됨',
  blocked: '차단됨'
}

const statusBadgeClass: Record<Status, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  blocked: 'bg-red-100 text-red-700'
}

export function UserManagementPanel({
  users,
  loading,
  actionUserId,
  onRefresh,
  onStatusChange,
  onRoleChange
}: UserManagementPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">사용자 관리</h3>
          <p className="text-sm text-gray-500 mt-1">승인 상태와 역할을 실시간으로 변경할 수 있습니다.</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <i className="ri-refresh-line mr-1"></i>
          새로고침
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="py-12 text-center text-gray-500">사용자 데이터를 불러오는 중...</div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-gray-500">등록된 사용자가 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <i className="ri-user-line text-xl text-slate-600"></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-gray-900">{user.name ?? '이름 미등록'}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadgeClass[user.status]}`}>
                      {statusLabels[user.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.department && <p className="text-xs text-gray-500 mt-1">부서: {user.department}</p>}
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  <label className="text-xs text-gray-500">역할</label>
                  <select
                    value={user.role}
                    disabled={actionUserId === user.id}
                    onChange={(event) => onRoleChange(user.id, event.target.value as Role)}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">모니터링 사용자</option>
                    <option value="admin">관리자</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  <label className="text-xs text-gray-500">상태</label>
                  <select
                    value={user.status}
                    disabled={actionUserId === user.id}
                    onChange={(event) => onStatusChange(user.id, event.target.value as Status)}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">승인 대기</option>
                    <option value="approved">승인됨</option>
                    <option value="blocked">차단됨</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


