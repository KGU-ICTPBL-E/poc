
interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalInspections: number;
  systemUptime: string;
  avgResponseTime: number;
  errorRate: number;
  storageUsed: number;
  storageTotal: number;
}

interface SystemOverviewProps {
  stats: SystemStats;
}

export default function SystemOverview({ stats }: SystemOverviewProps) {
  const storagePercentage = (stats.storageUsed / stats.storageTotal) * 100;

  return (
    <div className="space-y-6">
      {/* 주요 지표 */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
              <i className="ri-user-line text-xl text-blue-600"></i>
            </div>
            <h4 className="font-semibold text-gray-700">총 사용자</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}명</p>
          <p className="text-xs text-gray-600 mt-1">등록된 전체 사용자</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg">
              <i className="ri-checkbox-circle-line text-xl text-green-600"></i>
            </div>
            <h4 className="font-semibold text-gray-700">활성 사용자</h4>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.activeUsers}명</p>
          <p className="text-xs text-gray-600 mt-1">현재 접속 중</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg">
              <i className="ri-scan-line text-xl text-orange-600"></i>
            </div>
            <h4 className="font-semibold text-gray-700">총 검사 건수</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalInspections.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">누적 검사 완료</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg">
              <i className="ri-time-line text-xl text-purple-600"></i>
            </div>
            <h4 className="font-semibold text-gray-700">시스템 가동시간</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.systemUptime}</p>
          <p className="text-xs text-gray-600 mt-1">연속 가동 중</p>
        </div>
      </div>

      {/* 시스템 성능 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">시스템 성능</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">평균 응답시간</span>
                <span className="text-sm font-bold text-gray-900">{stats.avgResponseTime}ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${Math.min((1000 - stats.avgResponseTime) / 10, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">오류율</span>
                <span className="text-sm font-bold text-gray-900">{stats.errorRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${stats.errorRate * 10}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">저장소 사용량</span>
                <span className="text-sm font-bold text-gray-900">
                  {stats.storageUsed}GB / {stats.storageTotal}GB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${storagePercentage > 80 ? 'bg-red-500' : storagePercentage > 60 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                  style={{ width: `${storagePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">시스템 상태</h3>
          <div className="space-y-4">
            {[
              { name: 'X-RAY 검사 장비', status: 'online', uptime: '99.9%' },
              { name: '데이터베이스', status: 'online', uptime: '99.8%' },
              { name: '웹 서버', status: 'online', uptime: '99.9%' },
              { name: '백업 시스템', status: 'online', uptime: '98.5%' },
              { name: '알림 서비스', status: 'warning', uptime: '97.2%' }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'online' ? 'bg-green-500' : 
                    service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">{service.name}</span>
                </div>
                <span className="text-sm text-gray-600">{service.uptime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">최근 시스템 활동</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[
              { time: '14:32', event: '사용자 김현수가 로그인했습니다.', type: 'info' },
              { time: '14:28', event: '구역 A에서 금속 이물질이 검출되었습니다.', type: 'warning' },
              { time: '14:15', event: '일일 백업이 완료되었습니다.', type: 'success' },
              { time: '14:08', event: '새로운 사용자 등록 요청이 있습니다.', type: 'info' },
              { time: '13:55', event: '시스템 성능 최적화가 완료되었습니다.', type: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <span className="text-sm text-gray-600 font-mono">{activity.time}</span>
                <span className="text-sm text-gray-900">{activity.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
