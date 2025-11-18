
import { useState } from 'react';

export default function DataExportPanel() {
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [selectedDataType, setSelectedDataType] = useState('all');
  const [exportFormat, setExportFormat] = useState('excel');

  const handleExport = () => {
    // 실제로는 서버에 데이터 내보내기 요청
    console.log('데이터 내보내기:', {
      dateRange: selectedDateRange,
      dataType: selectedDataType,
      format: exportFormat
    });
    alert('데이터 내보내기가 시작되었습니다. 완료되면 다운로드 링크를 이메일로 전송해드립니다.');
  };

  const dataStats = [
    { label: '오늘 검사 데이터', count: '2,847건', size: '15.2MB' },
    { label: '이번 주 데이터', count: '18,432건', size: '98.7MB' },
    { label: '이번 달 데이터', count: '76,891건', size: '412.3MB' },
    { label: '전체 데이터', count: '1,234,567건', size: '6.8GB' }
  ];

  return (
    <div className="space-y-6">
      {/* 데이터 현황 */}
      <div className="grid grid-cols-4 gap-6">
        {dataStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg">
                <i className="ri-file-chart-line text-xl text-orange-600"></i>
              </div>
              <h4 className="font-semibold text-gray-700">{stat.label}</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            <p className="text-xs text-gray-600 mt-1">용량: {stat.size}</p>
          </div>
        ))}
      </div>

      {/* 데이터 내보내기 */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">데이터 내보내기</h3>
          <p className="text-sm text-gray-600 mt-1">원하는 조건으로 데이터를 내보낼 수 있습니다.</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* 날짜 범위 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">날짜 범위</label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-8"
              >
                <option value="today">오늘</option>
                <option value="week">이번 주</option>
                <option value="month">이번 달</option>
                <option value="quarter">분기</option>
                <option value="year">올해</option>
                <option value="all">전체</option>
                <option value="custom">사용자 지정</option>
              </select>
            </div>

            {/* 데이터 유형 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">데이터 유형</label>
              <select
                value={selectedDataType}
                onChange={(e) => setSelectedDataType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-8"
              >
                <option value="all">전체 데이터</option>
                <option value="inspection">검사 결과</option>
                <option value="defects">불량품 데이터</option>
                <option value="production">생산량 데이터</option>
                <option value="alerts">알림 기록</option>
                <option value="users">사용자 활동</option>
              </select>
            </div>

            {/* 내보내기 형식 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">파일 형식</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-8"
              >
                <option value="excel">Excel (.xlsx)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="json">JSON (.json)</option>
                <option value="pdf">PDF 보고서</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <i className="ri-information-line mr-1"></i>
              대용량 데이터는 처리 시간이 오래 걸릴 수 있습니다.
            </div>
            <button
              onClick={handleExport}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-download-line mr-2"></i>
              데이터 내보내기
            </button>
          </div>
        </div>
      </div>

      {/* 최근 내보내기 기록 */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">최근 내보내기 기록</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {[
              { date: '2024-01-15 14:30', type: '전체 데이터', format: 'Excel', size: '412.3MB', status: '완료' },
              { date: '2024-01-14 09:15', type: '불량품 데이터', format: 'CSV', size: '25.7MB', status: '완료' },
              { date: '2024-01-13 16:45', type: '생산량 데이터', format: 'PDF', size: '8.2MB', status: '완료' },
              { date: '2024-01-12 11:20', type: '검사 결과', format: 'JSON', size: '156.8MB', status: '완료' }
            ].map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg">
                    <i className="ri-file-download-line text-green-600"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{record.type} ({record.format})</p>
                    <p className="text-sm text-gray-600">{record.date} • {record.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {record.status}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <i className="ri-download-line"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
