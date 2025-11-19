
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuthContext } from '../../context/AuthContext';
import Calendar from './components/Calendar';
import SummaryCard from './components/SummaryCard';
import DonutChart from './components/DonutChart';
import ZoneChart from './components/ZoneChart';
import ProductionChart from './components/ProductionChart';
import DefectTypeChart from './components/DefectTypeChart';
import AlertList from './components/AlertList';
import { todaySummary, generateTimeSeriesData, defectTypes, hourlyProduction, recentAlerts } from '../../mocks/inspectionData';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dangerZones, setDangerZones] = useState<string[]>([]);
  const [adminCheckLoading, setAdminCheckLoading] = useState(false);
  const timeSeriesData = generateTimeSeriesData();
  const navigate = useNavigate();
  const { session, profile } = useAuthContext();

  // 실시간 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 위험 구역 시뮬레이션 (실제로는 실시간 데이터에서 가져옴)
  useEffect(() => {
    const checkDangerZones = () => {
      const zones = [];
      if (Math.random() > 0.8) zones.push('A');
      if (Math.random() > 0.85) zones.push('B');
      if (Math.random() > 0.9) zones.push('C');
      if (Math.random() > 0.87) zones.push('D');
      setDangerZones(zones);
    };

    const interval = setInterval(checkDangerZones, 5000);
    return () => clearInterval(interval);
  }, []);

  const donutData = [
    { name: '정상품', value: todaySummary.normalRate },
    { name: '불량품', value: todaySummary.defectRate }
  ];

  const zoneAData = timeSeriesData.map(d => ({ time: d.time, value: d.zoneA }));
  const zoneBData = timeSeriesData.map(d => ({ time: d.time, value: d.zoneB }));
  const zoneCData = timeSeriesData.map(d => ({ time: d.time, value: d.zoneC }));
  const zoneDData = timeSeriesData.map(d => ({ time: d.time, value: d.zoneD }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-orange-500 rounded-lg">
                <i className="ri-scan-line text-2xl text-white"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">X-RAY 검사 모니터링</h1>
                <p className="text-sm text-gray-600">실시간 이물질 검출 시스템</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={async () => {
                  if (!session?.user) {
                    alert('로그인이 필요합니다.')
                    return
                  }
                  
                  setAdminCheckLoading(true)
                  try {
                    // Supabase에서 현재 사용자의 role 확인
                    const { data: userInfo, error } = await supabase
                      .from('user_info')
                      .select('role, status')
                      .eq('id', session.user.id)
                      .single()
                    
                    if (error || !userInfo) {
                      alert('사용자 정보를 확인할 수 없습니다.')
                      return
                    }
                    
                    if (userInfo.status !== 'approved') {
                      alert('승인된 계정만 접근할 수 있습니다.')
                      return
                    }
                    
                    if (userInfo.role === 'admin') {
                      navigate('/admin')
                    } else {
                      alert('관리자 권한이 없습니다.')
                    }
                  } catch (err) {
                    alert('권한 확인 중 오류가 발생했습니다.')
                  } finally {
                    setAdminCheckLoading(false)
                  }
                }}
                disabled={adminCheckLoading}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adminCheckLoading ? '확인 중...' : '관리자 화면'}
              </button>
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
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">정상 가동 중</span>
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
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Calendar */}
          <div className="col-span-3">
            <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            
            <div className="mt-6">
              <AlertList alerts={recentAlerts} />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            {/* Date Display */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-1">
                    {format(selectedDate, 'yyyy년 M월 d일 (E)', { locale: ko })}
                  </h2>
                  <p className="text-orange-100">선택된 날짜의 검사 데이터</p>
                </div>
                <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-full">
                  <i className="ri-calendar-check-line text-4xl"></i>
                </div>
              </div>
            </div>

            {/* Today Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-2 border-orange-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-dashboard-line text-orange-500"></i>
                오늘 현황 요약
              </h2>
              <div className="grid grid-cols-4 gap-4">
                <SummaryCard
                  title="가동시간"
                  value={todaySummary.operatingTime}
                  icon="ri-time-line"
                  color="orange"
                />
                <SummaryCard
                  title="불량품 / 정상품"
                  value={`${todaySummary.defectRate}% / ${todaySummary.normalRate}%`}
                  icon="ri-pie-chart-line"
                  color="teal"
                />
                <SummaryCard
                  title="누적 생산량"
                  value={todaySummary.totalProduction.toLocaleString()}
                  subtitle={`목표: ${todaySummary.targetProduction.toLocaleString()}`}
                  icon="ri-stack-line"
                  color="blue"
                />
                <SummaryCard
                  title="가동 효율"
                  value={`${todaySummary.efficiency}%`}
                  icon="ri-speed-up-line"
                  color="green"
                />
              </div>
            </div>

            {/* Production Rate Donut Chart */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">생산 비율</h3>
                <div className="h-[240px]">
                  <DonutChart data={donutData} colors={['#14B8A6', '#F97316']} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">정상품</p>
                    <p className="text-2xl font-bold text-teal-600">{todaySummary.normalCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">불량품</p>
                    <p className="text-2xl font-bold text-orange-600">{todaySummary.defectCount}</p>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <DefectTypeChart data={defectTypes} />
              </div>
            </div>

            {/* Zone Details with Danger Indicators */}
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-md p-6 border-2 border-teal-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-line-chart-line text-teal-500"></i>
                세부요약
              </h2>
              <div className="grid grid-cols-4 gap-4">
                <div className={`relative ${dangerZones.includes('A') ? 'ring-4 ring-red-500 ring-opacity-50' : ''}`}>
                  {dangerZones.includes('A') && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 rounded-full animate-pulse z-10">
                      <i className="ri-alarm-warning-line text-white text-sm"></i>
                    </div>
                  )}
                  <ZoneChart data={zoneAData} zoneName="구역 A" color="#3B82F6" />
                </div>
                <div className={`relative ${dangerZones.includes('B') ? 'ring-4 ring-red-500 ring-opacity-50' : ''}`}>
                  {dangerZones.includes('B') && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 rounded-full animate-pulse z-10">
                      <i className="ri-alarm-warning-line text-white text-sm"></i>
                    </div>
                  )}
                  <ZoneChart data={zoneBData} zoneName="구역 B" color="#10B981" />
                </div>
                <div className={`relative ${dangerZones.includes('C') ? 'ring-4 ring-red-500 ring-opacity-50' : ''}`}>
                  {dangerZones.includes('C') && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 rounded-full animate-pulse z-10">
                      <i className="ri-alarm-warning-line text-white text-sm"></i>
                    </div>
                  )}
                  <ZoneChart data={zoneCData} zoneName="구역 C" color="#F59E0B" />
                </div>
                <div className={`relative ${dangerZones.includes('D') ? 'ring-4 ring-red-500 ring-opacity-50' : ''}`}>
                  {dangerZones.includes('D') && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 rounded-full animate-pulse z-10">
                      <i className="ri-alarm-warning-line text-white text-sm"></i>
                    </div>
                  )}
                  <ZoneChart data={zoneDData} zoneName="구역 D" color="#8B5CF6" />
                </div>
              </div>
            </div>

            {/* Hourly Production Chart */}
            <ProductionChart data={hourlyProduction} />

            {/* Statistics Grid */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
                    <i className="ri-shield-check-line text-xl text-blue-600"></i>
                  </div>
                  <h4 className="font-semibold text-gray-700">검출 정확도</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">99.2%</p>
                <p className="text-xs text-gray-600 mt-1">전일 대비 +0.3%</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg">
                    <i className="ri-flashlight-line text-xl text-purple-600"></i>
                  </div>
                  <h4 className="font-semibold text-gray-700">평균 검사 시간</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">1.2초</p>
                <p className="text-xs text-gray-600 mt-1">제품당 평균</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-lg">
                    <i className="ri-alarm-warning-line text-xl text-red-600"></i>
                  </div>
                  <h4 className="font-semibold text-gray-700">금속 이물질</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">45건</p>
                <p className="text-xs text-gray-600 mt-1">오늘 검출</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg">
                    <i className="ri-contrast-drop-line text-xl text-orange-600"></i>
                  </div>
                  <h4 className="font-semibold text-gray-700">비금속 이물질</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">32건</p>
                <p className="text-xs text-gray-600 mt-1">오늘 검출</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
