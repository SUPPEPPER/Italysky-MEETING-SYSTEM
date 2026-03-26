export type Employee = 
  | 'Michele Xu' 
  | 'Pepper Wang' 
  | 'Zita Zhao' 
  | 'Simone Perversi' 
  | 'Franco Wang' 
  | 'Kim Lai' 
  | 'Momo Ding' 
  | 'Elena Tian';

export interface YesterdayClass {
  id: string;
  name: string;
  teacher: Employee;
  feedbackCompleted: boolean;
  absentStudents: string;
  remarks: string;
}

export interface MediaRecord {
  id: string;
  platform: '小红书' | '视频号' | '公众号' | '抖音';
  accountName: string;
  content: string;
  data: string;
}

export interface TodayClass {
  id: string;
  type: '线上' | '线下';
  time: string;
  name: string;
  location: string;
  teacher: Employee;
  feedbackReminder: boolean;
}

export interface AgencyTracking {
  id: string;
  student: string;
  status: string;
  deadline: string;
}

export interface StudentRegistration {
  id: string;
  student: string;
  type: '预注册' | '学考试报名' | '学校报名' | '其他';
  status: string;
}

export interface ClassFormation {
  id: string;
  title: string;
  status: string;
}

export interface TrialClass {
  id: string;
  student: string;
  channel: string;
  time: string;
  isArranged: boolean;
  isFollowUp: boolean;
}

export interface MediaOperation {
  id: string;
  content: string;
  platforms: string[];
}

export interface SalesConversion {
  newLeads: string[];
  followUpCustomers: { name: string; status: string }[];
  collaborations: { task: string; from: Employee; to: Employee }[];
}

export interface FinanceRecord {
  id: string;
  type: '应收款' | '发票';
  amount: string;
  detail: string;
}

export interface OfflineVisit {
  id: string;
  visitor: string;
  time: string;
  purpose: string;
}

export interface ToDoItem {
  id: string;
  assignee: 'Michele Xu' | 'Pepper Wang' | 'Simone Perversi' | 'Zita Zhao';
  task: string;
  isCompleted: boolean;
  remarks: string;
}

export interface StudentExam {
  id: string;
  student: string;
  examName: string;
  date: string;
  score: string;
}
