
import { Link } from 'react-router-dom';

interface Alert {
  id: number;
  time: string;
  type: string;
  zone: string;
  severity: string;
}

interface AlertListProps {
  alerts: Alert[];
}

export default function AlertList({ alerts }: AlertListProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'low':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'ri-error-warning-fill';
      case 'medium':
        return 'ri-alert-fill';
      case 'low':
        return 'ri-information-fill';
      default:
        return 'ri-information-line';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">최근 알림</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Link 
            key={alert.id}
            to={`/alert/${alert.id}`}
            className={`block border-l-4 p-4 rounded-r-lg transition-all hover:shadow-md cursor-pointer ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className={`${getSeverityIcon(alert.severity)} text-lg`}></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{alert.type}</span>
                  <span className="text-xs font-mono">{alert.time}</span>
                </div>
                <p className="text-xs">{alert.zone}</p>
                <div className="flex items-center gap-1 mt-2">
                  <i className="ri-eye-line text-xs"></i>
                  <span className="text-xs">클릭하여 상세보기</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
