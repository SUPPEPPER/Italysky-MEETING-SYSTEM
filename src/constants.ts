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

export const INITIAL_TODO_LIST: ToDoItem[] = [];

export const INITIAL_YESTERDAY_CLASSES: YesterdayClass[] = [];

export const INITIAL_YESTERDAY_MEDIA: MediaRecord[] = [];

export const INITIAL_TODAY_CLASSES: TodayClass[] = [];

export const INITIAL_AGENCY_TRACKING: AgencyTracking[] = [];

export const INITIAL_STUDENT_REGISTRATIONS: StudentRegistration[] = [];

export const INITIAL_CLASS_FORMATIONS: ClassFormation[] = [];

export const INITIAL_TRIAL_CLASSES: TrialClass[] = [];

export const INITIAL_MEDIA_OPERATIONS: MediaOperation[] = [];

export const INITIAL_SALES_CONVERSION: SalesConversion = {
  newLeads: [],
  followUpCustomers: [],
  collaborations: [],
};

export const INITIAL_FINANCE_RECORDS: FinanceRecord[] = [];

export const INITIAL_OFFLINE_VISITS: OfflineVisit[] = [];

export const INITIAL_STUDENT_EXAMS: StudentExam[] = [];
