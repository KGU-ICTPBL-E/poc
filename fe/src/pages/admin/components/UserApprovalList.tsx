
import { useState } from 'react';

interface PendingUser {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  requestDate: string;
  reason: string;
}

interface UserApprovalListProps {
  users: PendingUser[];
}

export default function UserApprovalList({ users }: UserApprovalListProps) {
  const [pendingUsers, setPendingUsers] = useState(users);

  const handleApprove = (userId: number) => {
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    // 실제로는 API 호출
    console.log(`사용자 ${userId} 승인됨`);
  };

  const handleReject = (userId: number) => {
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    // 실제로는 API 호출
    console.log(`사용자 ${userId} 거부됨`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">회원가입 승인 대기</h3>
          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-yellow-800">{pendingUsers.length}명 대기 중</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {pendingUsers.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-user-check-line text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">승인 대기 중인 사용자가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full">
                        <i className="ri-user-line text-xl text-blue-600"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">부서</p>
                        <p className="text-sm font-medium text-gray-900">{user.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">직급</p>
                        <p className="text-sm font-medium text-gray-900">{user.position}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">신청일</p>
                        <p className="text-sm font-medium text-gray-900">{user.requestDate}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">신청 사유</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{user.reason}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-check-line mr-1"></i>
                      승인
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-close-line mr-1"></i>
                      거부
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
