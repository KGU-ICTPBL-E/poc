
import { useState, useEffect } from 'react';

interface ActiveUser {
  id: number;
  name: string;
  department: string;
  position: string;
  loginTime: string;
  lastActivity: string;
  ipAddress: string;
  status: 'active' | 'idle' | 'away';
}

interface ActiveUsersMonitorProps {
  users: ActiveUser[];
}

export default function ActiveUsersMonitor({ users }: ActiveUsersMonitorProps) {
  const [activeUsers, setActiveUsers] = useState(users);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // 실제로는 서버에서 실시간 데이터를 가져옴
      setActiveUsers(prev => prev.map(user => ({
        ...user,
        lastActivity: Math.random() > 0.7 ? new Date().toLocaleTimeString() : user.lastActivity,
        status: Math.random() > 0.8 ? 'idle' : user.status
      })));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'away': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '활성';
      case 'idle': return '대기';
      case 'away': return '자리비움';
      default: return '알 수 없음';
    }
  };

  const activeCount = activeUsers.filter(user => user.status === 'active').length;
  const idleCount = activeUsers.filter(user => user.status === 'idle').length;
  const awayCount = activeUsers.filter(user => user.status === 'away').length;

  return (
    <div className="space-y-6">
      {/* 현황 요약 */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
              <i className="ri-user-line text-xl text-blue-600"></i>
            </div>
            <h4 className="font-semibold text-gray-700">총 접속자</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeUsers.length}명</p>
          <p className="text-xs text-gray-600 mt-1">현재 시스템 접속 중</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg">
              <i className="ri-checkbox-circle-line text-xl text-green-600"></i>
            </div>
            <h4 className="font-semibold text-gray-700">활성 사용자</h4>
          </div>
          <p className="text-3xl font-bold text-green-600">{activeCount}명</p>
          <p className="text-xs text-gray-600 mt-1">실시간 모니터링 중</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-lg">
              <i className="ri-time-line text-xl text-yellow-600"></i>
            </div>
            <h4 className="font-semibold text-gray-700">대기 중</h4>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{idleCount}명</p>
          <p className="text-xs text-gray-600 mt-1">비활성 상태</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-lg">
              <i className="ri-user-unfollow-line text-xl text-red-600"></i>
            </div>
            <h4 className="font-semibold text-gray-700">자리비움</h4>
          </div>
          <p className="text-3xl font-bold text-red-600">{awayCount}명</p>
          <p className="text-xs text-gray-600 mt-1">장시간 미활동</p>
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">실시간 접속 현황</h3>
            <div className="text-sm text-gray-600">
              마지막 업데이트: {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">사용자</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">부서/직급</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">접속 시간</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">마지막 활동</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">IP 주소</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">상태</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                          <i className="ri-user-line text-gray-600"></i>
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.department}</p>
                        <p className="text-xs text-gray-600">{user.position}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{user.loginTime}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{user.lastActivity}</td>
                    <td className="py-4 px-4 text-sm text-gray-700 font-mono">{user.ipAddress}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(user.status)}`}></div>
                        <span className="text-sm font-medium text-gray-700">{getStatusText(user.status)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
