import { 
  Employee,
  YesterdayClass,
  MediaRecord,
  TodayClass,
  AgencyTracking,
  StudentRegistration,
  ClassFormation,
  TrialClass,
  MediaOperation,
  SalesConversion,
  FinanceRecord,
  OfflineVisit,
  ToDoItem,
  StudentExam
} from './types';

export const EMPLOYEES: Employee[] = [
  'Michele Xu',
  'Pepper Wang',
  'Zita Zhao',
  'Simone Perversi',
  'Franco Wang',
  'Kim Lai',
  'Momo Ding',
  'Elena Tian'
];

export const TODO_ASSIGNEES: ToDoItem['assignee'][] = [
  'Michele Xu',
  'Pepper Wang',
  'Simone Perversi',
  'Zita Zhao'
];

export const EMPTY_ARRAY: any[] = [];

export const INITIAL_TODO_LIST: ToDoItem[] = [];

export const INITIAL_YESTERDAY_CLASSES: YesterdayClass[] = [];

export const INITIAL_TODAY_CLASSES: TodayClass[] = [];

export const INITIAL_AGENCY_TRACKING: AgencyTracking[] = [];

export const INITIAL_STUDENT_REGISTRATIONS: StudentRegistration[] = [];

export const INITIAL_CLASS_FORMATIONS: ClassFormation[] = [];

export const INITIAL_TRIAL_CLASSES: TrialClass[] = [];

export const MEDIA_ACCOUNTS = [
  { platform: '公众号', accountName: '意国蓝天' },
  { platform: '视频号', accountName: '意国蓝天情报局' },
  { platform: '视频号', accountName: '意国蓝天的小日记' },
  { platform: '视频号', accountName: '真的徐小翔' },
  { platform: '视频号', accountName: '徐大梨' },
  { platform: '小红书', accountName: '意小乖' },
  { platform: '小红书', accountName: '意国蓝天大梨教育' },
];

export const INITIAL_YESTERDAY_MEDIA: MediaRecord[] = MEDIA_ACCOUNTS.map((acc, idx) => ({
  id: `y-media-${idx}`,
  platform: acc.platform,
  accountName: acc.accountName,
  views: '',
  followers: '',
}));

export const INITIAL_MEDIA_OPERATIONS: MediaOperation[] = MEDIA_ACCOUNTS.map((acc, idx) => ({
  id: `t-media-${idx}`,
  accountName: acc.accountName,
  platform: acc.platform,
  content: '',
}));

export const INITIAL_SALES_CONVERSION: SalesConversion = {
  newLeads: [],
  followUpCustomers: [],
  collaborations: [],
};

export const INITIAL_FINANCE_RECORDS: FinanceRecord[] = [];

export const INITIAL_OFFLINE_VISITS: OfflineVisit[] = [];

export const INITIAL_STUDENT_EXAMS: StudentExam[] = [];
