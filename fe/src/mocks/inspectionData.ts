export const todaySummary = {
  operatingTime: '22h 30m',
  defectRate: 5,
  normalRate: 95,
  totalProduction: 2847,
  defectCount: 142,
  normalCount: 2705,
  targetProduction: 3000,
  efficiency: 94.9
};

export const generateTimeSeriesData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      zoneA: Math.floor(Math.random() * 30) + 20,
      zoneB: Math.floor(Math.random() * 30) + 20,
      zoneC: Math.floor(Math.random() * 30) + 20,
      zoneD: Math.floor(Math.random() * 30) + 20
    });
  }
  return data;
};

export const defectTypes = [
  { name: '금속 이물질', value: 45, color: '#EF4444' },
  { name: '비금속 이물질', value: 32, color: '#F59E0B' },
  { name: '크랙/파손', value: 28, color: '#3B82F6' },
  { name: '형상 불량', value: 22, color: '#8B5CF6' },
  { name: '기타', value: 15, color: '#6B7280' }
];

export const hourlyProduction = [
  { hour: '00:00', production: 98, defect: 5 },
  { hour: '01:00', production: 102, defect: 4 },
  { hour: '02:00', production: 95, defect: 6 },
  { hour: '03:00', production: 110, defect: 3 },
  { hour: '04:00', production: 105, defect: 7 },
  { hour: '05:00', production: 98, defect: 4 },
  { hour: '06:00', production: 115, defect: 5 },
  { hour: '07:00', production: 120, defect: 8 },
  { hour: '08:00', production: 125, defect: 6 },
  { hour: '09:00', production: 118, defect: 5 },
  { hour: '10:00', production: 122, defect: 7 },
  { hour: '11:00', production: 128, defect: 4 },
  { hour: '12:00', production: 95, defect: 3 },
  { hour: '13:00', production: 130, defect: 9 },
  { hour: '14:00', production: 125, defect: 6 },
  { hour: '15:00', production: 120, defect: 5 },
  { hour: '16:00', production: 118, defect: 7 },
  { hour: '17:00', production: 122, defect: 4 },
  { hour: '18:00', production: 115, defect: 6 },
  { hour: '19:00', production: 110, defect: 5 },
  { hour: '20:00', production: 108, defect: 8 },
  { hour: '21:00', production: 105, defect: 4 },
  { hour: '22:00', production: 98, defect: 5 },
  { hour: '23:00', production: 92, defect: 3 }
];

export const recentAlerts = [
  { id: 1, time: '14:32:15', type: '금속 이물질 검출', zone: '구역 A', severity: 'high' },
  { id: 2, time: '14:28:42', type: '비금속 이물질 검출', zone: '구역 C', severity: 'medium' },
  { id: 3, time: '14:15:33', type: '형상 불량', zone: '구역 B', severity: 'low' },
  { id: 4, time: '14:08:21', type: '금속 이물질 검출', zone: '구역 D', severity: 'high' },
  { id: 5, time: '13:55:18', type: '크랙 감지', zone: '구역 A', severity: 'medium' }
];