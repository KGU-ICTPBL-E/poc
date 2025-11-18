
export const pendingUsers = [
  {
    id: 1,
    name: '이민수',
    email: 'minsu.lee@company.com',
    department: '생산관리팀',
    position: '주임',
    requestDate: '2024-01-15',
    reason: 'X-RAY 검사 장비 모니터링 업무를 담당하게 되어 시스템 접근 권한이 필요합니다.'
  },
  {
    id: 2,
    name: '박지영',
    email: 'jiyoung.park@company.com',
    department: '품질관리팀',
    position: '대리',
    requestDate: '2024-01-14',
    reason: '품질 관리 업무 수행을 위해 검사 데이터 열람 권한이 필요합니다.'
  },
  {
    id: 3,
    name: '김태현',
    email: 'taehyun.kim@company.com',
    department: '생산1팀',
    position: '사원',
    requestDate: '2024-01-13',
    reason: '현장 작업자로서 실시간 검사 현황 모니터링이 필요합니다.'
  }
];

export const activeUsers = [
  {
    id: 1,
    name: '김현수',
    department: '생산관리팀',
    position: '팀장',
    loginTime: '08:30:15',
    lastActivity: '14:32:45',
    ipAddress: '192.168.1.101',
    status: 'active' as const
  },
  {
    id: 2,
    name: '이수진',
    department: '품질관리팀',
    position: '과장',
    loginTime: '09:15:22',
    lastActivity: '14:28:12',
    ipAddress: '192.168.1.102',
    status: 'active' as const
  },
  {
    id: 3,
    name: '박민호',
    department: '생산1팀',
    position: '주임',
    loginTime: '07:45:33',
    lastActivity: '14:15:08',
    ipAddress: '192.168.1.103',
    status: 'idle' as const
  },
  {
    id: 4,
    name: '정유리',
    department: '생산2팀',
    position: '사원',
    loginTime: '08:00:44',
    lastActivity: '13:45:22',
    ipAddress: '192.168.1.104',
    status: 'away' as const
  },
  {
    id: 5,
    name: '최동욱',
    department: '기술팀',
    position: '대리',
    loginTime: '09:30:11',
    lastActivity: '14:30:55',
    ipAddress: '192.168.1.105',
    status: 'active' as const
  }
];

export const systemStats = {
  totalUsers: 47,
  activeUsers: 12,
  totalInspections: 1234567,
  systemUptime: '99.8%',
  avgResponseTime: 245,
  errorRate: 0.2,
  storageUsed: 2.4,
  storageTotal: 10.0
};
