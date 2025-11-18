import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface AlertDetail {
  id: number;
  time: string;
  type: string;
  zone: string;
  severity: string;
  description: string;
  location: string;
  detectedItem: string;
  confidence: number;
  imageUrl: string;
  machineId: string;
  operator: string;
  actionTaken: string;
  status: 'pending' | 'investigating' | 'resolved';
}

export default function AlertDetail() {
  const { id } = useParams();
  const [alert, setAlert] = useState<AlertDetail | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져옴
    const mockAlert: AlertDetail = {
      id: parseInt(id || '1'),
      time: '14:32:15',
      type: '금속 이물질 검출',
      zone: '구역 A - 라인 2',
      severity: 'high',
      description: '제품 내부에서 금속 이물질이 검출되었습니다. 즉시 확인이 필요합니다.',
      location: 'X: 142mm, Y: 78mm, Z: 23mm',
      detectedItem: '금속편 (추정 크기: 2.3mm x 1.8mm)',
      confidence: 98.7,
      imageUrl: 'https://readdy.ai/api/search-image?query=X-ray%20industrial%20inspection%20metal%20foreign%20object%20detection%20in%20food%20product%20showing%20clear%20metallic%20contamination%20with%20measurement%20overlay%20and%20detection%20markers&width=800&height=600&seq=xray-metal-detection&orientation=landscape',
      machineId: 'XR-001',
      operator: '김현수',
      actionTaken: '생산 라인 일시 정지, 해당 제품 분리',
      status: 'investigating'
    };
    setAlert(mockAlert);
  }, [id]);

  if (!alert) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-200 rounded-full">
            <i className="ri-loader-4-line text-2xl text-gray-400 animate-spin"></i>
          </div>
          <p className="text-gray-600">알림 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'medium':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'low':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'investigating':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'investigating':
        return '조사중';
      case 'resolved':
        return '해결완료';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line text-xl text-gray-600"></i>
              </Link>
              <div className="w-12 h-12 flex items-center justify-center bg-red-500 rounded-lg">
                <i className="ri-alarm-warning-line text-2xl text-white"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">알림 상세 정보</h1>
                <p className="text-sm text-gray-600">검출된 이물질 정보 및 대응 현황</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(alert.status)}`}>
                {getStatusText(alert.status)}
              </span>
              <div className="text-right">
                <p className="text-sm text-gray-600">검출 시간</p>
                <p className="text-lg font-semibold text-gray-900">{alert.time}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {/* Alert Overview */}
        <div className={`rounded-lg border-2 p-6 mb-8 ${getSeverityColor(alert.severity)}`}>
          <div className="flex items-start gap-4">
            <div className={`w-3 h-3 rounded-full ${getSeverityBadgeColor(alert.severity)} mt-2`}></div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{alert.type}</h2>
              <p className="text-lg mb-3">{alert.zone}</p>
              <p className="text-sm leading-relaxed">{alert.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* X-Ray Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="ri-image-line text-orange-500"></i>
              X-RAY 검출 이미지
            </h3>
            <div className="relative">
              <img 
                src={alert.imageUrl}
                alt="X-RAY 검출 이미지"
                className="w-full h-80 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-orange-300 transition-colors"
                onClick={() => setIsImageModalOpen(true)}
              />
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                신뢰도: {alert.confidence}%
              </div>
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                <p className="text-sm">클릭하여 확대</p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">위치 좌표</p>
                <p className="font-semibold text-gray-900">{alert.location}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">검출된 이물질</p>
                <p className="font-semibold text-gray-900">{alert.detectedItem}</p>
              </div>
            </div>
          </div>

          {/* Alert Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-information-line text-blue-500"></i>
                기본 정보
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">알림 ID</span>
                  <span className="font-semibold">#{alert.id.toString().padStart(6, '0')}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">검출 시간</span>
                  <span className="font-semibold">{format(new Date(), 'yyyy년 M월 d일 (E)', { locale: ko })} {alert.time}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">장비 ID</span>
                  <span className="font-semibold">{alert.machineId}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">담당 작업자</span>
                  <span className="font-semibold">{alert.operator}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">심각도</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityBadgeColor(alert.severity)} text-white`}>
                    {alert.severity === 'high' ? '높음' : alert.severity === 'medium' ? '보통' : '낮음'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Taken */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-shield-check-line text-green-500"></i>
                대응 조치
              </h3>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <p className="text-green-700">{alert.actionTaken}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">추가 조치</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                  라인 재가동
                </button>
                <button className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                  보고서 생성
                </button>
                <button className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                  긴급 정지
                </button>
                <button className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                  알림 해제
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setIsImageModalOpen(false)}>
          <div className="max-w-4xl max-h-[90vh] p-4">
            <div className="relative">
              <img 
                src={alert.imageUrl}
                alt="X-RAY 검출 이미지 확대"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl text-gray-700"></i>
              </button>
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                <p className="text-sm">검출 위치: {alert.location}</p>
                <p className="text-sm">신뢰도: {alert.confidence}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}