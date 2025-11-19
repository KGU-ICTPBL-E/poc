
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import ActiveUsersMonitor from './components/ActiveUsersMonitor';
import DataExportPanel from './components/DataExportPanel';
import SystemOverview from './components/SystemOverview';
import { activeUsers, systemStats } from '../../mocks/adminData';
import { supabase } from '../../lib/supabaseClient';
import type { UserProfile } from '../../context/AuthContext';
import { useAuthContext } from '../../context/AuthContext';
import { UserManagementPanel } from './components/UserManagementPanel';

export default function AdminPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const navigate = useNavigate();
  const { profile } = useAuthContext();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'overview', name: '시스템 현황', icon: 'ri-dashboard-line' },
    { id: 'users', name: '사용자 관리', icon: 'ri-user-settings-line' },
    { id: 'monitor', name: '접속 현황', icon: 'ri-eye-line' },
    { id: 'data', name: '데이터 관리', icon: 'ri-database-line' }
  ];

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback(message);
    setFeedbackType(type);
    setTimeout(() => {
      setFeedback(null);
      setFeedbackType(null);
    }, 4000);
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    const { data, error } = await supabase
      .from('user_info')
      .select('id, email, name, role, status, department')
      .order('email', { ascending: true });

    if (error) {
      showFeedback('사용자 목록을 불러오지 못했습니다.', 'error');
      setUsers([]);
    } else {
      setUsers((data as UserProfile[]) ?? []);
    }
    setUsersLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = async (userId: string, payload: Partial<Pick<UserProfile, 'role' | 'status'>>) => {
    setActionUserId(userId);
    const { error } = await supabase.from('user_info').update(payload).eq('id', userId);
    if (error) {
      showFeedback('사용자 정보를 업데이트하지 못했습니다.', 'error');
    } else {
      showFeedback('변경 사항이 저장되었습니다.', 'success');
      await fetchUsers();
    }
    setActionUserId(null);
  };

  const handleStatusChange = (userId: string, status: UserProfile['status']) => {
    updateUser(userId, { status });
  };

  const handleRoleChange = (userId: string, role: UserProfile['role']) => {
    updateUser(userId, { role });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-lg">
                <i className="ri-admin-line text-2xl text-white"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
                <p className="text-sm text-gray-600">X-RAY 검사 시스템 관리</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                to="/home" 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                모니터링 화면
              </Link>
              <div className="text-right">
                <p className="text-sm text-gray-600">현재 시간</p>
                <p className="text-lg font-semibold text-gray-900">{format(currentTime, 'HH:mm:ss')}</p>
              </div>
              {profile?.email && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">로그인</p>
                  <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                </div>
              )}
              <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-blue-700">관리자 모드</span>
              </div>
              <button
                onClick={async () => {
                  const { error } = await supabase.auth.signOut()
                  if (error) {
                    alert('로그아웃 중 오류가 발생했습니다.')
                  } else {
                    navigate('/', { replace: true })
                  }
                }}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium text-red-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-logout-box-line mr-1"></i>
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-8">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className={`${tab.icon} text-lg`}></i>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">시스템 전체 현황</h2>
                    <p className="text-blue-100">실시간 모니터링 및 관리</p>
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-full">
                    <i className="ri-settings-3-line text-4xl"></i>
                  </div>
                </div>
              </div>
              <SystemOverview stats={systemStats} />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">사용자 관리</h2>
                    <p className="text-green-100">회원가입 승인 및 사용자 권한 관리</p>
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-full">
                    <i className="ri-user-settings-line text-4xl"></i>
                  </div>
                </div>
              </div>
              {feedback && (
                <div
                  className={`rounded-lg px-4 py-3 text-sm ${
                    feedbackType === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}
                >
                  {feedback}
                </div>
              )}
              <UserManagementPanel
                users={users}
                loading={usersLoading}
                actionUserId={actionUserId}
                onRefresh={fetchUsers}
                onStatusChange={handleStatusChange}
                onRoleChange={handleRoleChange}
              />
            </div>
          )}

          {activeTab === 'monitor' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">접속 현황 모니터링</h2>
                    <p className="text-purple-100">현장 작업자 실시간 접속 상태</p>
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-full">
                    <i className="ri-eye-line text-4xl"></i>
                  </div>
                </div>
              </div>
              <ActiveUsersMonitor users={activeUsers} />
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">데이터 관리</h2>
                    <p className="text-orange-100">전체 데이터 열람 및 내보내기</p>
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-full">
                    <i className="ri-database-line text-4xl"></i>
                  </div>
                </div>
              </div>
              <DataExportPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
