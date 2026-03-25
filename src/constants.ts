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
  ToDoItem
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

export const INITIAL_TODO_LIST: ToDoItem[] = [
  { id: '1', assignee: 'Michele Xu', task: '整理昨日会议纪要', isCompleted: false, remarks: '' },
  { id: '2', assignee: 'Pepper Wang', task: '跟进米理申请进度', isCompleted: true, remarks: '已完成初步审核' },
];

export const INITIAL_YESTERDAY_CLASSES: YesterdayClass[] = [
  { id: '1', name: '意语B1班', teacher: 'Zita Zhao', feedbackCompleted: true, absentStudents: '无', remarks: '课堂气氛活跃' },
  { id: '2', name: '预科A2班', teacher: 'Simone Perversi', feedbackCompleted: false, absentStudents: '张三', remarks: '语法部分需要加强' },
];

export const INITIAL_YESTERDAY_MEDIA: MediaRecord[] = [
  { id: '1', platform: '小红书', accountName: '大梨教育A号', content: '米理申请攻略', data: '浏览1200, 赞45' },
  { id: '2', platform: '视频号', accountName: '意国蓝天', content: '上课日常', data: '播放500, 转发20' },
];

export const INITIAL_TODAY_CLASSES: TodayClass[] = [
  { id: '1', type: '线上', time: '10:00-12:00', name: '意语B1班', location: 'Zoom', teacher: 'Zita Zhao', feedbackReminder: true },
  { id: '2', type: '线下', time: '14:00-16:00', name: '预科A2班', location: '教室2', teacher: 'Franco Wang', feedbackReminder: true },
];

export const INITIAL_AGENCY_TRACKING: AgencyTracking[] = [
  { id: '1', student: '李同学', status: '预注册完成', deadline: '2026-03-30' },
];

export const INITIAL_STUDENT_REGISTRATIONS: StudentRegistration[] = [
  { id: '1', student: '王同学', type: '学考试报名', status: '已提交' },
];

export const INITIAL_CLASS_FORMATIONS: ClassFormation[] = [
  { id: '1', title: '意语B1周末班', status: '差2人' },
];

export const INITIAL_TRIAL_CLASSES: TrialClass[] = [
  { id: '1', student: '陈同学', channel: '小红书', time: '14:00', isArranged: true, isFollowUp: false },
];

export const INITIAL_MEDIA_OPERATIONS: MediaOperation[] = [
  { id: '1', content: '米理建筑系作品集Sample', platforms: ['小红书', '视频号'] },
];

export const INITIAL_SALES_CONVERSION: SalesConversion = {
  newLeads: ['赵同学 (咨询)', '钱同学 (试听)'],
  followUpCustomers: [{ name: '孙同学', status: '犹豫中' }],
  collaborations: [{ task: '确认下月排期', from: 'Pepper Wang', to: 'Zita Zhao' }],
};

export const INITIAL_FINANCE_RECORDS: FinanceRecord[] = [
  { id: '1', type: '应收款', amount: '5000', detail: '意语B1学费' },
  { id: '2', type: '发票', amount: '2000', detail: '已开具' },
];

export const INITIAL_OFFLINE_VISITS: OfflineVisit[] = [
  { id: '1', visitor: '周家长', time: '15:00', purpose: '咨询课程' },
];
