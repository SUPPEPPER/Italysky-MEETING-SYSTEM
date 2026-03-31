/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Download, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  Users, 
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Globe,
  CreditCard,
  FileText,
  UserPlus,
  Monitor,
  Edit2,
  Trash2,
  X,
  Bell,
  FileDown,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { useCloudBaseData, setDbErrorCallback } from './hooks/useCloudBaseData';
import { auth, db } from './cloudbase';
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
import { 
  EMPLOYEES,
  TODO_ASSIGNEES,
  INITIAL_YESTERDAY_CLASSES,
  INITIAL_YESTERDAY_MEDIA,
  INITIAL_TODAY_CLASSES,
  INITIAL_TODO_LIST,
  INITIAL_AGENCY_TRACKING,
  INITIAL_STUDENT_REGISTRATIONS,
  INITIAL_CLASS_FORMATIONS,
  INITIAL_TRIAL_CLASSES,
  INITIAL_MEDIA_OPERATIONS,
  INITIAL_SALES_CONVERSION,
  INITIAL_FINANCE_RECORDS,
  INITIAL_OFFLINE_VISITS,
  INITIAL_STUDENT_EXAMS
} from './constants';
import { Language, translations } from './translations';

export default function App() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // State
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [lang, setLang] = useCloudBaseData<Language>('lang', 'zh', user?.uid);
  const t = translations[lang];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [exportStartDate, setExportStartDate] = useState(new Date());
  const [exportEndDate, setExportEndDate] = useState(new Date());
  
  // Format date to YYYY-MM-DD in local time
  const dateString = currentDate.toLocaleDateString('en-CA');

  const [cooperationNote, setCooperationNote, init13, docExists13] = useCloudBaseData('cooperationNote', '', user?.uid, dateString);
  const [yesterdayClasses, setYesterdayClasses, init1, docExists1] = useCloudBaseData<YesterdayClass[]>('yesterdayClasses', INITIAL_YESTERDAY_CLASSES, user?.uid, dateString);
  const [yesterdayMedia, setYesterdayMedia, init2, docExists2] = useCloudBaseData<MediaRecord[]>('yesterdayMedia', INITIAL_YESTERDAY_MEDIA, user?.uid, dateString);
  const [todayClasses, setTodayClasses, init3, docExists3] = useCloudBaseData<TodayClass[]>('todayClasses', INITIAL_TODAY_CLASSES, user?.uid, dateString);
  const [agencyTracking, setAgencyTracking, init4, docExists4] = useCloudBaseData<AgencyTracking[]>('agencyTracking', INITIAL_AGENCY_TRACKING, user?.uid, dateString);
  const [studentRegistrations, setStudentRegistrations, init5, docExists5] = useCloudBaseData<StudentRegistration[]>('studentRegistrations', INITIAL_STUDENT_REGISTRATIONS, user?.uid, dateString);
  const [classFormations, setClassFormations, init6, docExists6] = useCloudBaseData<ClassFormation[]>('classFormations', INITIAL_CLASS_FORMATIONS, user?.uid, dateString);
  const [trialClasses, setTrialClasses, init7, docExists7] = useCloudBaseData<TrialClass[]>('trialClasses', INITIAL_TRIAL_CLASSES, user?.uid, dateString);
  const [mediaOperations, setMediaOperations, init8, docExists8] = useCloudBaseData<MediaOperation[]>('mediaOperations', INITIAL_MEDIA_OPERATIONS, user?.uid, dateString);
  const [salesConversion, setSalesConversion, init9, docExists9] = useCloudBaseData<SalesConversion>('salesConversion', INITIAL_SALES_CONVERSION, user?.uid, dateString);
  const [financeRecords, setFinanceRecords, init10, docExists10] = useCloudBaseData<FinanceRecord[]>('financeRecords', INITIAL_FINANCE_RECORDS, user?.uid, dateString);
  const [offlineVisits, setOfflineVisits, init11, docExists11] = useCloudBaseData<OfflineVisit[]>('offlineVisits', INITIAL_OFFLINE_VISITS, user?.uid, dateString);
  const [studentExams, setStudentExams, init16, docExists16] = useCloudBaseData<StudentExam[]>('studentExams', INITIAL_STUDENT_EXAMS, user?.uid, dateString);

  const [redList, setRedList, init14, docExists14] = useCloudBaseData<{id: string, name: string, reason: string}[]>('redList', [], user?.uid);
  const [bossInstructions, setBossInstructions, init15, docExists15] = useCloudBaseData<string[]>('bossInstructions', [], user?.uid, dateString);
  const [todoList, setTodoList, init12, docExists12] = useCloudBaseData<ToDoItem[]>('todoList', INITIAL_TODO_LIST, user?.uid, dateString);

  const isDataLoaded = init1 && init2 && init3 && init4 && init5 && init6 && init7 && init8 && init9 && init10 && init11 && init12 && init13 && init14 && init15 && init16;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    setDbErrorCallback((show) => setDbError(show));
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const loginState = await auth.getLoginState();
        // 如果是匿名登录，我们还需要检查本地是否有我们自定义的用户名状态
        if (loginState && loginState.user) {
          const savedUser = localStorage.getItem('custom_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Failed to get login state', e);
      } finally {
        setAuthLoading(false);
      }
    };
    checkLogin();
  }, []);

  const handleCustomAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedUsername || !trimmedPassword) {
      alert('请输入用户名和密码');
      return;
    }
    
    try {
      setAuthLoading(true);
      
      // 1. 确保底层已经匿名登录，这样才能访问数据库
      let loginState = await auth.getLoginState();
      if (!loginState) {
        await auth.anonymousAuthProvider().signIn();
      }
      
      const usersRef = db.collection('app_users');
      
      if (isRegisterMode) {
        // 注册逻辑
        const existRes = await usersRef.where({ username: trimmedUsername }).get();
        if (existRes.data && existRes.data.length > 0) {
          alert('该用户名已被注册，请直接登录或换一个名字');
          return;
        }
        
        await usersRef.add({
          username: trimmedUsername,
          password: trimmedPassword, // 注意：实际生产环境不建议明文存储密码
          createdAt: new Date().toISOString()
        });
        
        const newUser = { uid: trimmedUsername, name: trimmedUsername };
        localStorage.setItem('custom_user', JSON.stringify(newUser));
        setUser(newUser);
        alert('注册成功！已为您自动登录');
        
      } else {
        // 登录逻辑
        const res = await usersRef.where({
          username: trimmedUsername,
          password: trimmedPassword
        }).get();
        
        if (res.data && res.data.length > 0) {
          const loggedInUser = { uid: res.data[0]._id, name: trimmedUsername };
          localStorage.setItem('custom_user', JSON.stringify(loggedInUser));
          setUser(loggedInUser);
        } else {
          alert('用户名或密码错误');
        }
      }
    } catch (err: any) {
      console.error('Auth failed', err);
      alert(`操作失败: ${err.message || '请检查网络或控制台配置'}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      setAuthLoading(true);
      await auth.anonymousAuthProvider().signIn();
      const loginState = await auth.getLoginState();
      const anonUser = { uid: loginState?.user?.uid || 'anonymous', name: '匿名用户' };
      localStorage.setItem('custom_user', JSON.stringify(anonUser));
      setUser(anonUser);
    } catch (e) {
      console.error('Anonymous login failed', e);
      alert('匿名登录失败，请确保在腾讯云控制台开启了匿名登录。');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('custom_user');
    await auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    const carryOverData = async () => {
      if (!user || !isDataLoaded) return;

      const yesterdayDate = new Date(currentDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayDateString = yesterdayDate.toLocaleDateString('en-CA');

      const fetchYesterday = async (key: string) => {
        const docId = `dashboard_shared_${yesterdayDateString}_${key}`;
        try {
          const res = await db.collection('dashboard_data').doc(docId).get();
          if (res.data && res.data.length > 0) {
            return res.data[0].value;
          }
        } catch (e) {
          console.error(`Failed to fetch yesterday's ${key}`, e);
        }
        return null;
      };

      // 1. Carry over todayClasses to yesterdayClasses (Review)
      if (!docExists1) {
        const prevTodayClasses = await fetchYesterday('todayClasses');
        if (prevTodayClasses && Array.isArray(prevTodayClasses) && prevTodayClasses.length > 0) {
          const mapped = prevTodayClasses.map((c: any) => ({
            id: c.id,
            name: c.name,
            teacher: c.teacher,
            feedbackCompleted: false,
            absentStudents: '',
            remarks: c.remarks || ''
          }));
          setYesterdayClasses(mapped);
        }
      }

      // 2. Carry over Finance Records (Accounts Receivable and Invoices)
      if (!docExists10) {
        const prevFinance = await fetchYesterday('financeRecords');
        if (prevFinance && Array.isArray(prevFinance) && prevFinance.length > 0) {
          setFinanceRecords(prevFinance);
        }
      }

      // 3. Carry over Boss Instructions
      if (!docExists15) {
        const prevInstructions = await fetchYesterday('bossInstructions');
        if (prevInstructions && Array.isArray(prevInstructions) && prevInstructions.length > 0) {
          setBossInstructions(prevInstructions);
        }
      }

      // 4. Carry over Cooperation Note (Joint Programs)
      if (!docExists13) {
        const prevNote = await fetchYesterday('cooperationNote');
        if (prevNote) {
          setCooperationNote(prevNote);
        }
      }

      // 5. Carry over Student Exams
      if (!docExists16) {
        const prevExams = await fetchYesterday('studentExams');
        if (prevExams && Array.isArray(prevExams) && prevExams.length > 0) {
          setStudentExams(prevExams);
        }
      }

      // 6. Carry over Student Registrations
      if (!docExists5) {
        const prevRegs = await fetchYesterday('studentRegistrations');
        if (prevRegs && Array.isArray(prevRegs) && prevRegs.length > 0) {
          setStudentRegistrations(prevRegs);
        }
      }

      // 7. Carry over Trial Classes
      if (!docExists7) {
        const prevTrials = await fetchYesterday('trialClasses');
        if (prevTrials && Array.isArray(prevTrials) && prevTrials.length > 0) {
          setTrialClasses(prevTrials);
        }
      }

      // 8. Carry over Agency Tracking
      if (!docExists4) {
        const prevAgency = await fetchYesterday('agencyTracking');
        if (prevAgency && Array.isArray(prevAgency) && prevAgency.length > 0) {
          setAgencyTracking(prevAgency);
        }
      }
    };

    carryOverData();
  }, [currentDate, user, isDataLoaded, docExists1, docExists4, docExists5, docExists7, docExists10, docExists13, docExists15, docExists16]);

  const performanceData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 1100 },
  ];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    type: string;
    data: any;
    isEdit: boolean;
  } | null>(null);

  const openModal = (type: string, title: string, data: any = null, isEdit: boolean = false) => {
    setModalConfig({ type, title, data, isEdit });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalConfig(null);
  };

  const handleDelete = (type: string, id: string) => {
    openModal('confirmDelete', t.confirmDelete, { type, id });
  };

  const toggleTodoStatus = (id: string) => {
    setTodoList(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalConfig) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    // Handle special types (checkboxes, arrays)
    if (modalConfig.type === 'yesterdayClass') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        name: data.name as string,
        teacher: data.teacher as Employee,
        feedbackCompleted: formData.get('feedbackCompleted') === 'on',
        absentStudents: data.absentStudents as string,
        remarks: data.remarks as string,
      };
      if (modalConfig.isEdit) {
        setYesterdayClasses(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setYesterdayClasses(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'yesterdayMedia') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        platform: data.platform as any,
        accountName: data.accountName as string,
        content: data.content as string,
        data: data.data as string,
      };
      if (modalConfig.isEdit) {
        setYesterdayMedia(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setYesterdayMedia(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'redList') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        name: data.name as string,
        reason: data.reason as string,
      };
      if (modalConfig.isEdit) {
        setRedList(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setRedList(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'todayClass') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        type: data.type as any,
        time: data.time as string,
        name: data.name as string,
        location: data.location as string,
        teacher: data.teacher as Employee,
        feedbackReminder: formData.get('feedbackReminder') === 'on',
      };
      if (modalConfig.isEdit) {
        setTodayClasses(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setTodayClasses(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'agencyTracking') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        student: data.student as string,
        status: data.status as string,
        deadline: data.deadline as string,
      };
      if (modalConfig.isEdit) {
        setAgencyTracking(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setAgencyTracking(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'studentRegistration') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        student: data.student as string,
        type: data.type as any,
        status: data.status as string,
      };
      if (modalConfig.isEdit) {
        setStudentRegistrations(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setStudentRegistrations(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'classFormation') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        title: data.title as string,
        status: data.status as string,
      };
      if (modalConfig.isEdit) {
        setClassFormations(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setClassFormations(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'trialClass') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        student: data.student as string,
        channel: data.channel as string,
        time: data.time as string,
        isArranged: formData.get('isArranged') === 'on',
        isFollowUp: formData.get('isFollowUp') === 'on',
      };
      if (modalConfig.isEdit) {
        setTrialClasses(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setTrialClasses(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'mediaOperation') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        content: data.content as string,
        platforms: (data.platforms as string).split(',').map(p => p.trim()),
      };
      if (modalConfig.isEdit) {
        setMediaOperations(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setMediaOperations(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'financeRecord') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        type: data.type as any,
        amount: data.amount as string,
        detail: data.detail as string,
      };
      if (modalConfig.isEdit) {
        setFinanceRecords(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setFinanceRecords(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'offlineVisit') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        visitor: data.visitor as string,
        time: data.time as string,
        purpose: data.purpose as string,
      };
      if (modalConfig.isEdit) {
        setOfflineVisits(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setOfflineVisits(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'todoItem') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        assignee: data.assignee as any,
        task: data.task as string,
        isCompleted: formData.get('isCompleted') === 'on',
        remarks: data.remarks as string,
      };
      if (modalConfig.isEdit) {
        setTodoList(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setTodoList(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'newLead') {
      const lead = data.lead as string;
      setSalesConversion(prev => ({ ...prev, newLeads: [...prev.newLeads, lead] }));
    } else if (modalConfig.type === 'followUpCustomer') {
      const newItem = { name: data.name as string, status: data.status as string };
      setSalesConversion(prev => ({ ...prev, followUpCustomers: [...prev.followUpCustomers, newItem] }));
    } else if (modalConfig.type === 'collaboration') {
      const newItem = { task: data.task as string, from: data.from as Employee, to: data.to as Employee };
      setSalesConversion(prev => ({ ...prev, collaborations: [...prev.collaborations, newItem] }));
    } else if (modalConfig.type === 'studentExam') {
      const newItem = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        date: data.date as string,
        student: data.student as string,
        examName: data.examName as string,
        score: data.score as string,
      };
      if (modalConfig.isEdit) {
        setStudentExams(prev => prev.map(i => i.id === newItem.id ? newItem : i));
      } else {
        setStudentExams(prev => [...prev, newItem]);
      }
    } else if (modalConfig.type === 'confirmDelete') {
      const { type, id } = modalConfig.data;
      switch (type) {
        case 'yesterdayClass': setYesterdayClasses(prev => prev.filter(i => i.id !== id)); break;
        case 'yesterdayMedia': setYesterdayMedia(prev => prev.filter(i => i.id !== id)); break;
        case 'redList': setRedList(prev => prev.filter(i => i.id !== id)); break;
        case 'todayClass': setTodayClasses(prev => prev.filter(i => i.id !== id)); break;
        case 'agencyTracking': setAgencyTracking(prev => prev.filter(i => i.id !== id)); break;
        case 'studentRegistration': setStudentRegistrations(prev => prev.filter(i => i.id !== id)); break;
        case 'classFormation': setClassFormations(prev => prev.filter(i => i.id !== id)); break;
        case 'trialClass': setTrialClasses(prev => prev.filter(i => i.id !== id)); break;
        case 'mediaOperation': setMediaOperations(prev => prev.filter(i => i.id !== id)); break;
        case 'financeRecord': setFinanceRecords(prev => prev.filter(i => i.id !== id)); break;
        case 'offlineVisit': setOfflineVisits(prev => prev.filter(i => i.id !== id)); break;
        case 'todoItem': setTodoList(prev => prev.filter(i => i.id !== id)); break;
        case 'studentExam': setStudentExams(prev => prev.filter(i => i.id !== id)); break;
      }
    } else if (modalConfig.type === 'clearAll') {
      setYesterdayClasses([]);
      setYesterdayMedia([]);
      setTodayClasses([]);
      setAgencyTracking([]);
      setStudentRegistrations([]);
      setClassFormations([]);
      setTrialClasses([]);
      setMediaOperations([]);
      setSalesConversion({ newLeads: [], followUpCustomers: [], collaborations: [] });
      setFinanceRecords([]);
      setOfflineVisits([]);
      setTodoList([]);
      setCooperationNote('');
      setRedList([]);
      setBossInstructions([]);
      setStudentExams([]);
    } else if (modalConfig.type === 'exportExcel') {
      await handleExportExcel();
      return; // handleExportExcel already closes the modal
    }

    closeModal();
  };

  const openExportModal = () => {
    setExportStartDate(currentDate);
    setExportEndDate(currentDate);
    openModal('exportExcel', t.exportExcel);
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const start = new Date(exportStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(exportEndDate);
      end.setHours(23, 59, 59, 999);

      if (start > end) {
        alert('开始日期不能晚于结束日期');
        setIsExporting(false);
        return;
      }

      // Generate all date strings in the range
      const dateStrings: string[] = [];
      let current = new Date(start);
      while (current <= end) {
        dateStrings.push(current.toLocaleDateString('en-CA'));
        current.setDate(current.getDate() + 1);
      }

      let allData: any[] = [];

      // Fetch data for each date
      for (const ds of dateStrings) {
        const fetchCollection = async (key: string, sectionName: string) => {
          const docId = `dashboard_shared_${ds}_${key}`;
          try {
            const res = (await db.collection('dashboard_data').doc(docId).get()) as any;
            // Handle both array and object response from CloudBase doc().get()
            let val = null;
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
              val = res.data[0].value;
            } else if (res.data && !Array.isArray(res.data)) {
              val = res.data.value;
            }

            if (val !== null && val !== undefined) {
              if (Array.isArray(val)) {
                return val.map((item: any) => ({ Date: ds, Section: sectionName, ...item }));
              } else if (typeof val === 'string' || typeof val === 'number') {
                return [{ Date: ds, Section: sectionName, Value: val }];
              } else if (val && typeof val === 'object') {
                return [{ Date: ds, Section: sectionName, ...val }];
              }
            }
          } catch (e) {
            console.error(`Error fetching ${key} for ${ds}:`, e);
          }
          return [];
        };

        const [yClasses, tClasses, tList, fRecords, sExams, sRegs, tTrials, aTracking, bInstructions] = await Promise.all([
          fetchCollection('yesterdayClasses', '昨日复盘'),
          fetchCollection('todayClasses', '今日课表'),
          fetchCollection('todoList', '待办事项'),
          fetchCollection('financeRecords', '财务记录'),
          fetchCollection('studentExams', '学生考试'),
          fetchCollection('studentRegistrations', '学生报名'),
          fetchCollection('trialClasses', '试听追踪'),
          fetchCollection('agencyTracking', '中介追踪'),
          fetchCollection('bossInstructions', '老板指令')
        ]);

        allData = [...allData, ...yClasses, ...tClasses, ...tList, ...fRecords, ...sExams, ...sRegs, ...tTrials, ...aTracking, ...bInstructions];
      }

      if (allData.length === 0) {
        alert('该时间段内没有数据可导出');
        closeModal();
        setIsExporting(false);
        return;
      }

      const ws = XLSX.utils.json_to_sheet(allData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Dashboard Data");
      XLSX.writeFile(wb, `Dali_Education_Report_${exportStartDate.toLocaleDateString('en-CA')}_to_${exportEndDate.toLocaleDateString('en-CA')}.xlsx`);
      closeModal();
    } catch (error) {
      console.error('Excel Export Error:', error);
      alert('Excel 导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950/50 p-4">
        <div className="bg-slate-800/40 p-8 rounded-2xl shadow-2xl shadow-brand-blue/10 w-full max-w-md text-center">
          <h1 className="text-3xl font-serif font-bold text-slate-100 mb-2">{t.brandName}</h1>
          <p className="text-slate-400 mb-8">{t.systemName}</p>
          
          <form onSubmit={handleCustomAuth} className="flex flex-col gap-4 mb-4">
            <input
              type="text"
              placeholder="用户名 (如: 张三)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 text-slate-100 border border-white/10 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              required
            />
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 text-slate-100 border border-white/10 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              required
            />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-brand-blue hover:bg-blue-700 text-slate-100 rounded-xl font-bold transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={authLoading}
            >
              {authLoading ? '处理中...' : (isRegisterMode ? '注册并登录' : '登录')}
            </button>
          </form>

          <div className="flex items-center justify-between text-sm text-slate-400 mb-6">
            <button 
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
              }}
              className="hover:text-brand-blue transition-colors"
            >
              {isRegisterMode ? '已有账号？去登录' : '没有账号？去注册'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-xs text-slate-500 italic">
              本平台为内部平台，请勿外传链接
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950/50 font-sans" ref={dashboardRef}>
      {dbError && (
        <div className="bg-brand-red/10 border-b border-red-200 p-4 text-red-800 text-sm text-center shadow-lg shadow-black/20 relative z-[60]">
          <p className="font-bold mb-1">⚠️ 数据库连接失败 (网络请求错误)</p>
          <p>请检查：1. <code>.env</code> 文件中的 <code>VITE_TCB_REGION</code> 是否正确。2. 云开发控制台是否已开启数据库服务。3. 是否已将当前域名添加到“安全应用来源”。</p>
          <button onClick={() => setDbError(false)} className="absolute right-4 top-4 text-brand-red hover:text-red-700">
            ✕
          </button>
        </div>
      )}
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 shadow-lg shadow-brand-blue/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left: Brand and Date Navigation */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full lg:w-auto">
              <div className="flex flex-col leading-tight text-center sm:text-left shrink-0">
                <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-slate-100 whitespace-nowrap">
                  {t.brandName}
                </h1>
                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.2em] whitespace-nowrap">
                  {t.systemName}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5 w-full sm:w-auto justify-center">
                <button 
                  onClick={() => changeDate(-1)}
                  className="p-1.5 hover:text-brand-blue transition-colors rounded-full hover:bg-white/5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 px-2 relative group">
                  <Calendar className="w-4 h-4 text-slate-400 pointer-events-none" />
                  <input 
                    type="date" 
                    value={dateString}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [year, month, day] = e.target.value.split('-').map(Number);
                        setCurrentDate(new Date(year, month - 1, day));
                      }
                    }}
                    className="bg-transparent border-none text-slate-200 font-bold text-sm cursor-pointer hover:text-brand-blue transition-colors outline-none focus:ring-0 w-[110px]"
                  />
                </div>
                <button 
                  onClick={() => changeDate(1)}
                  className="p-1.5 hover:text-brand-blue transition-colors rounded-full hover:bg-white/5"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-[10px] bg-slate-800 border border-white/10 rounded-full hover:bg-slate-700 hover:text-brand-blue transition-colors whitespace-nowrap font-bold"
                >
                  {t.today}
                </button>
              </div>
            </div>

            {/* Right: Actions and User */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="flex items-center bg-slate-800/50 rounded-xl p-1 border border-white/5">
                <button
                  onClick={() => setLang('zh')}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap",
                    lang === 'zh' ? "bg-brand-blue text-slate-100 shadow-lg shadow-black/20" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  中文
                </button>
                <button
                  onClick={() => setLang('it')}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap",
                    lang === 'it' ? "bg-brand-blue text-slate-100 shadow-lg shadow-black/20" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Italiano
                </button>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => openModal('clearAll', t.clearAll)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-brand-red/10 text-brand-red hover:bg-brand-red/20 rounded-xl text-xs font-bold transition-all whitespace-nowrap border border-brand-red/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.clearAll}</span>
                </button>
                
                <button
                  onClick={openExportModal}
                  className="flex items-center gap-1.5 px-3 py-2 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-blue/5 whitespace-nowrap border border-brand-blue/20"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.exportExcel}</span>
                </button>

                <div className="w-px h-6 bg-white/10 mx-1"></div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-slate-100 flex items-center justify-center font-bold text-sm shadow-lg shadow-brand-blue/20 border border-white/10">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-brand-red hover:bg-brand-red/10 rounded-full transition-colors"
                    title="退出登录"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Boss Instructions Banner - Redesigned for official look */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg shrink-0">
            <Bell className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-500">{t.bossInstructions}</span>
          </div>
          <div className="flex-1 flex flex-wrap gap-x-8 gap-y-2">
            {bossInstructions.map((instruction, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                {instruction}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="p-8 max-w-6xl mx-auto">
        {/* Section 1: Yesterday Review */}
        <SectionBlock title={t.yesterdayReview} icon={<Clock className="w-6 h-6" />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Yesterday Classes */}
            <SubSection title={t.yesterdayClasses} onAdd={() => openModal('yesterdayClass', t.addRecord)}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-950/50 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">{t.courseName}</th>
                      <th className="px-4 py-3">{t.teacher}</th>
                      <th className="px-4 py-3">{t.feedbackStatus}</th>
                      <th className="px-4 py-3">{t.absentStudents}</th>
                      <th className="px-4 py-3">{t.remarks}</th>
                      <th className="px-4 py-3 text-right">{t.operation}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {yesterdayClasses.map(cls => (
                      <tr key={cls.id} className="hover:bg-slate-950/50 group">
                        <td className="px-4 py-3 font-bold text-slate-200">{cls.name}</td>
                        <td className="px-4 py-3 text-slate-400">{cls.teacher}</td>
                        <td className="px-4 py-3">
                          {cls.feedbackCompleted ? (
                            <span className="text-brand-green flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-4 h-4" /> {t.completed}
                            </span>
                          ) : (
                            <span className="text-brand-red flex items-center gap-1 font-bold">
                              <AlertCircle className="w-4 h-4" /> {t.pending}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{cls.absentStudents}</td>
                        <td className="px-4 py-3 text-slate-400 italic text-xs">{cls.remarks}</td>
                        <td className="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openModal('yesterdayClass', t.editRecord, cls, true)} className="p-1 hover:text-brand-blue"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete('yesterdayClass', cls.id)} className="p-1 hover:text-brand-red"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SubSection>

            {/* Yesterday Media */}
            <SubSection title={t.yesterdayMedia} onAdd={() => openModal('yesterdayMedia', t.addRecord)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {yesterdayMedia.map(media => (
                  <div key={media.id} className="p-4 bg-slate-950/50 rounded-xl border border-white/5 relative group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2 py-1 rounded uppercase">
                        {media.platform}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">{media.accountName}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-200 mb-2">{media.content}</p>
                    <div className="text-xs text-slate-400 font-mono bg-slate-800/40 p-2 rounded border border-white/5">
                      {media.data}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('yesterdayMedia', t.editRecord, media, true)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-blue"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('yesterdayMedia', media.id)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>
          </div>
        </SectionBlock>

        {/* Section 2: Today Teaching Tasks */}
        <SectionBlock title={t.todayTeaching} icon={<BookOpen className="w-6 h-6" />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SubSection title={t.todaySchedule} onAdd={() => openModal('todayClass', t.addRecord)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {todayClasses.map(cls => (
                  <div key={cls.id} className={cn(
                    "p-4 rounded-xl border flex flex-col gap-2 relative group",
                    cls.type === '线上' ? "bg-blue-50 border-blue-100" : "bg-green-50 border-green-100"
                  )}>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded uppercase",
                        cls.type === '线上' ? "bg-brand-blue text-slate-100" : "bg-brand-green text-slate-100"
                      )}>
                        {cls.type === '线上' ? t.online : t.offline}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{cls.time}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{cls.name}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3" /> {cls.location}
                      </span>
                      <span className="font-bold text-slate-300">@{cls.teacher}</span>
                    </div>
                    {cls.feedbackReminder && (
                      <div className="mt-2 text-[10px] font-bold text-brand-red flex items-center gap-1 animate-pulse">
                        <AlertCircle className="w-3 h-3" /> {t.feedbackReminder}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('todayClass', t.editRecord, cls, true)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-blue"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('todayClass', cls.id)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            {/* Red List Warning */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-brand-red flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-brand-red rounded-full" />
                  {t.redList}
                </h3>
                <button 
                  onClick={() => openModal('redList', t.addRecord)}
                  className="p-1.5 bg-brand-red/10 text-brand-red rounded-lg hover:bg-brand-red/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {redList.map(item => (
                  <div key={item.id} className="p-4 bg-brand-red/10 border border-red-100 rounded-xl flex items-center justify-between relative group">
                    <div>
                      <div className="text-sm font-bold text-red-900">{item.name}</div>
                      <div className="text-[10px] font-bold text-brand-red uppercase tracking-wider">{item.reason}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-800/40 rounded-lg shadow-lg shadow-black/20 text-brand-red group-hover:opacity-0 transition-opacity">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="absolute right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal('redList', t.editRecord, item, true)} className="p-1.5 bg-slate-800/40 rounded-lg shadow-lg shadow-black/20 hover:text-brand-blue"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete('redList', item.id)} className="p-1.5 bg-slate-800/40 rounded-lg shadow-lg shadow-black/20 hover:text-brand-red"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* Section 2.5: 1803 To Do List */}
        <SectionBlock title={t.todoListTitle} icon={<CheckCircle2 className="w-6 h-6" />}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-bold italic">
                {t.todoListSubtitle}
              </p>
              <button 
                onClick={() => openModal('todoItem', t.addRecord)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-slate-100 rounded-xl text-xs font-bold hover:bg-brand-blue transition-all shadow-lg shadow-black/20"
              >
                <Plus className="w-3.5 h-3.5" /> {t.addTask}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {TODO_ASSIGNEES.map(assignee => {
                const personTasks = todoList.filter(t => t.assignee === assignee);
                return (
                  <div key={assignee} className="flex flex-col gap-3 p-5 bg-slate-800/40 rounded-2xl border border-white/10 shadow-lg shadow-black/20 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-blue-10 rounded-lg flex items-center justify-center text-brand-blue font-bold text-xs">
                          {assignee.split(' ')[0][0]}
                        </div>
                        <h4 className="text-sm font-bold text-slate-100">
                          {assignee}
                        </h4>
                      </div>
                      <button 
                        onClick={() => openModal('todoItem', `${t.add} ${assignee}`, { assignee })}
                        className="p-1.5 hover:bg-slate-800/80 rounded-lg text-brand-blue transition-colors"
                        title={t.addTask}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-h-[120px]">
                      {personTasks.length > 0 ? (
                        personTasks.map(item => (
                          <div key={item.id} className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5 group relative hover:border-brand-blue-30 transition-colors">
                            <div className="flex flex-col gap-2.5">
                              <p className={cn(
                                "text-xs font-bold leading-relaxed",
                                item.isCompleted ? "text-slate-400 line-through" : "text-slate-200"
                              )}>
                                {item.task}
                              </p>
                              
                              {item.remarks && (
                                <div className="text-[10px] text-slate-400 italic bg-slate-800/80 p-2 rounded-lg border border-white/5 flex gap-2">
                                  <span className="text-slate-300 font-bold">#</span>
                                  {item.remarks}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-1">
                                <button 
                                  onClick={() => toggleTodoStatus(item.id)}
                                  className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all",
                                    item.isCompleted 
                                      ? "bg-green-100 text-brand-green" 
                                      : "bg-slate-800/40 text-slate-400 hover:bg-slate-800/80 border border-white/5"
                                  )}
                                >
                                  {item.isCompleted ? (
                                    <><CheckCircle2 className="w-3 h-3" /> {t.completed}</>
                                  ) : (
                                    <><Clock className="w-3 h-3" /> {t.pending}</>
                                  )}
                                </button>
                                
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => openModal('todoItem', t.editRecord, item, true)} 
                                    className="p-1.5 hover:text-brand-blue bg-slate-800/40 rounded-md shadow-lg shadow-black/20 border border-white/5"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete('todoItem', item.id)} 
                                    className="p-1.5 hover:text-brand-red bg-slate-800/40 rounded-md shadow-lg shadow-black/20 border border-white/5"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl py-6">
                          <CheckCircle2 className="w-6 h-6 text-slate-100 mb-2" />
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.noTasks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionBlock>

        {/* Section 3: Today Academic Affairs */}
        <SectionBlock title={t.academicAffairs} icon={<Calendar className="w-6 h-6" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <SubSection title={t.agencyTracking} onAdd={() => openModal('agencyTracking', t.addRecord)}>
              <div className="space-y-3">
                {agencyTracking.map(item => (
                  <div key={item.id} className="p-3 bg-slate-950/50 rounded-xl border border-white/10 relative group">
                    <div className="text-sm font-bold text-slate-200 mb-1">{item.student}</div>
                    <div className="text-xs text-brand-blue font-bold mb-1">[{item.status}]</div>
                    <div className="text-[10px] text-brand-red font-bold">{t.deadline}: {item.deadline}</div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('agencyTracking', t.editRecord, item, true)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-blue"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('agencyTracking', item.id)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.studentRegistration} onAdd={() => openModal('studentRegistration', t.addRecord)}>
              <div className="space-y-3">
                {studentRegistrations.map(item => (
                  <div key={item.id} className="p-3 bg-slate-950/50 rounded-xl border border-white/10 relative group">
                    <div className="text-sm font-bold text-slate-200 mb-1">{item.student}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">{item.type}</span>
                      <span className="text-[10px] font-bold text-brand-green">{item.status}</span>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('studentRegistration', t.editRecord, item, true)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-blue"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('studentRegistration', item.id)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.classFormation} onAdd={() => openModal('classFormation', t.addRecord)}>
              <div className="space-y-3">
                {classFormations.map(item => (
                  <div key={item.id} className="p-3 bg-yellow-50 rounded-xl border border-yellow-200 relative group">
                    <div className="text-sm font-bold text-slate-200 mb-1">{item.title}</div>
                    <div className="text-xs font-bold text-brand-yellow">{item.status}</div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('classFormation', t.editRecord, item, true)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-blue"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('classFormation', item.id)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.trialClasses} onAdd={() => openModal('trialClass', t.addRecord)}>
              <div className="space-y-3">
                {trialClasses.map(item => (
                  <div key={item.id} className="p-3 bg-blue-50 rounded-xl border border-blue-200 relative group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-200">{item.student}</span>
                      <span className="text-[10px] font-bold text-brand-blue">{item.time}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mb-2">{t.channel}: {item.channel}</div>
                    <div className="flex gap-2">
                      {item.isArranged && <span className="text-[10px] font-bold bg-green-100 text-brand-green px-1.5 py-0.5 rounded">{t.isArranged}</span>}
                      {item.isFollowUp && <span className="text-[10px] font-bold bg-yellow-100 text-brand-yellow px-1.5 py-0.5 rounded">{t.isFollowUp}</span>}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('trialClass', t.editRecord, item, true)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-blue"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('trialClass', item.id)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.studentExams} onAdd={() => openModal('studentExam', t.addRecord)}>
              <div className="space-y-3">
                {studentExams.map(item => (
                  <div key={item.id} className="p-3 bg-slate-950/50 rounded-xl border border-white/10 relative group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-200">{item.student}</span>
                      <span className="text-[10px] font-bold text-brand-blue">{item.date}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-300 mb-1">{item.examName}</div>
                    <div className="text-[10px] text-brand-red font-bold">{t.score}: {item.score}</div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('studentExam', t.editRecord, item, true)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-blue"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('studentExam', item.id)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>
          </div>
        </SectionBlock>

        {/* Section 4: Media Operations */}
        <SectionBlock title={t.mediaOperation} icon={<TrendingUp className="w-6 h-6" />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SubSection title={t.todayMediaProduction} onAdd={() => openModal('mediaOperation', t.addRecord)}>
              <div className="space-y-4">
                {mediaOperations.map(op => (
                  <div key={op.id} className="p-4 bg-slate-950/50 rounded-xl border border-white/10 relative group">
                    <h4 className="text-sm font-bold text-slate-200 mb-2">{t.content}：{op.content}</h4>
                    <div className="flex flex-wrap gap-2">
                      {op.platforms.map(p => (
                        <span key={p} className="text-[10px] font-bold bg-slate-800/40 border border-white/10 px-2 py-1 rounded-full text-slate-400">
                          {p}
                        </span>
                      ))}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('mediaOperation', t.editRecord, op, true)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-blue"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('mediaOperation', op.id)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>
          </div>
        </SectionBlock>

        {/* Section 5: Sales Conversion */}
        <SectionBlock title={t.salesConversion} icon={<Users className="w-6 h-6" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SubSection title={t.newLeads} onAdd={() => openModal('newLead', t.addRecord)}>
              <div className="flex flex-wrap gap-2">
                {salesConversion.newLeads.map((lead, idx) => (
                  <span key={idx} className="text-xs font-bold bg-blue-50 text-brand-blue border border-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-2 group">
                    {lead}
                    <button 
                      onClick={() => setSalesConversion(prev => ({ ...prev, newLeads: prev.newLeads.filter((_, i) => i !== idx) }))}
                      className="opacity-0 group-hover:opacity-100 hover:text-brand-red transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.followUp} onAdd={() => openModal('followUpCustomer', t.addRecord)}>
              <div className="space-y-3">
                {salesConversion.followUpCustomers.map((customer, idx) => (
                  <div key={idx} className="p-3 bg-yellow-50 rounded-xl border border-yellow-200 relative group">
                    <div className="text-sm font-bold text-slate-200">{customer.name}</div>
                    <div className="text-xs font-bold text-brand-yellow">{customer.status}</div>
                    <button 
                      onClick={() => setSalesConversion(prev => ({ ...prev, followUpCustomers: prev.followUpCustomers.filter((_, i) => i !== idx) }))}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:text-brand-red transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.collaboration} onAdd={() => openModal('collaboration', t.addRecord)}>
              <div className="space-y-3">
                {salesConversion.collaborations.map((collab, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/50 rounded-xl border border-white/10 relative group">
                    <p className="text-xs font-bold text-slate-300 mb-2">{collab.task}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span>{t.from}: {collab.from}</span>
                      <span>{t.to}: {collab.to}</span>
                    </div>
                    <button 
                      onClick={() => setSalesConversion(prev => ({ ...prev, collaborations: prev.collaborations.filter((_, i) => i !== idx) }))}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:text-brand-red transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </SubSection>
          </div>
        </SectionBlock>

        {/* Section 6: Finance */}
        <SectionBlock title={t.financeRecords} icon={<CreditCard className="w-6 h-6" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {financeRecords.map(record => (
              <div key={record.id} className="p-4 bg-slate-800/40 border border-white/10 rounded-xl shadow-lg shadow-black/20 flex items-center gap-4 relative group">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  record.type === '应收款' ? "bg-brand-red/10 text-brand-red" : "bg-green-50 text-brand-green"
                )}>
                  {record.type === '应收款' ? <AlertCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{record.type === '应收款' ? t.receivable : t.invoice}</div>
                  <div className="text-lg font-bold text-slate-100">¥{record.amount}</div>
                  <div className="text-[10px] text-slate-400">{record.detail}</div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal('financeRecord', t.editRecord, record, true)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-blue"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => handleDelete('financeRecord', record.id)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
            <button 
              onClick={() => openModal('financeRecord', t.addRecord)}
              className="p-4 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-brand-blue hover:text-brand-blue transition-all"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-bold">{t.addRecord}</span>
            </button>
          </div>
        </SectionBlock>

        {/* Section 7: Sino-Foreign Cooperation & Boss Instructions Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionBlock title={t.cooperationNotes} icon={<Globe className="w-6 h-6" />}>
            <textarea 
              value={cooperationNote}
              onChange={(e) => setCooperationNote(e.target.value)}
              placeholder={t.cooperationPlaceholder}
              className="w-full h-32 p-4 bg-slate-800/40 text-slate-100 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all resize-none"
            />
          </SectionBlock>

          <SectionBlock title={t.bossInstructions} icon={<Bell className="w-6 h-6" />}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {bossInstructions.map((inst, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-950/50 p-3 rounded-xl border border-white/10 group">
                    <span className="flex-1 text-sm font-bold text-slate-200">{inst}</span>
                    <button 
                      onClick={() => setBossInstructions(prev => prev.filter((_, i) => i !== idx))}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-red transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  id="new-instruction"
                  type="text" 
                  placeholder={lang === 'zh' ? "输入新指令..." : "Inserisci nuova istruzione..."}
                  className="flex-1 px-4 py-2 bg-slate-800/40 text-slate-100 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      if (val) {
                        setBossInstructions(prev => [...prev, val]);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('new-instruction') as HTMLInputElement;
                    if (input.value) {
                      setBossInstructions(prev => [...prev, input.value]);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 text-slate-100 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  {t.add}
                </button>
              </div>
            </div>
          </SectionBlock>
        </div>

        {/* Section 8: Offline Visits */}
        <SectionBlock title={t.offlineVisits} icon={<UserPlus className="w-6 h-6" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {offlineVisits.map(visit => (
              <div key={visit.id} className="p-4 bg-slate-800/40 border border-white/10 rounded-xl shadow-lg shadow-black/20 relative group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-100">{visit.visitor}</span>
                  <span className="text-xs font-bold text-brand-blue">{visit.time}</span>
                </div>
                <p className="text-xs text-slate-400">{t.purposeLabel}{visit.purpose}</p>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal('offlineVisit', t.editRecord, visit, true)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-blue"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => handleDelete('offlineVisit', visit.id)} className="p-1 bg-slate-800/40 rounded shadow-lg shadow-black/20 hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
            <button 
              onClick={() => openModal('offlineVisit', t.addRecord)}
              className="p-4 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-brand-blue hover:text-brand-blue transition-all"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-bold">{t.addVisit}</span>
            </button>
          </div>
        </SectionBlock>
      </main>

      {/* Modal */}
      {isModalOpen && modalConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/40 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
              <h3 className="text-xl font-serif font-bold text-slate-100">{modalConfig.title}</h3>
              <button onClick={closeModal} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {modalConfig.type === 'yesterdayClass' && (
                <>
                  <Input label={t.courseName} name="name" defaultValue={modalConfig.data?.name} required />
                  <Select label={t.teacher} name="teacher" options={EMPLOYEES} defaultValue={modalConfig.data?.teacher} />
                  <Checkbox label={t.feedbackCompleted} name="feedbackCompleted" defaultChecked={modalConfig.data?.feedbackCompleted} />
                  <Input label={t.absentStudents} name="absentStudents" defaultValue={modalConfig.data?.absentStudents} />
                  <Input label={t.remarks} name="remarks" defaultValue={modalConfig.data?.remarks} />
                </>
              )}
              {modalConfig.type === 'yesterdayMedia' && (
                <>
                  <Select label={t.platform} name="platform" options={['小红书', '视频号', '公众号', '抖音']} defaultValue={modalConfig.data?.platform} />
                  <Input label={t.accountName} name="accountName" defaultValue={modalConfig.data?.accountName} required />
                  <Input label={t.content} name="content" defaultValue={modalConfig.data?.content} required />
                  <Input label={t.data} name="data" defaultValue={modalConfig.data?.data} placeholder={lang === 'zh' ? "如：点赞 100, 收藏 50" : "es: Like 100, Preferiti 50"} />
                </>
              )}
              {modalConfig.type === 'redList' && (
                <>
                  <Input label={t.student} name="name" defaultValue={modalConfig.data?.name} required />
                  <Input label={t.remarks} name="reason" defaultValue={modalConfig.data?.reason} required />
                </>
              )}
              {modalConfig.type === 'todayClass' && (
                <>
                  <Select label={t.type} name="type" options={[{ label: t.online, value: '线上' }, { label: t.offline, value: '线下' }]} defaultValue={modalConfig.data?.type} />
                  <Input label={t.time} name="time" defaultValue={modalConfig.data?.time} placeholder={lang === 'zh' ? "如：14:00-16:00" : "es: 14:00-16:00"} required />
                  <Input label={t.courseName} name="name" defaultValue={modalConfig.data?.name} required />
                  <Input label={t.location} name="location" defaultValue={modalConfig.data?.location} required />
                  <Select label={t.teacher} name="teacher" options={EMPLOYEES} defaultValue={modalConfig.data?.teacher} />
                  <Checkbox label={t.feedbackReminder} name="feedbackReminder" defaultChecked={modalConfig.data?.feedbackReminder} />
                </>
              )}
              {modalConfig.type === 'agencyTracking' && (
                <>
                  <Input label={t.student} name="student" defaultValue={modalConfig.data?.student} required />
                  <Input label={t.status} name="status" defaultValue={modalConfig.data?.status} required />
                  <Input label={t.deadline} name="deadline" defaultValue={modalConfig.data?.deadline} placeholder="YYYY-MM-DD" required />
                </>
              )}
              {modalConfig.type === 'studentRegistration' && (
                <>
                  <Input label={t.student} name="student" defaultValue={modalConfig.data?.student} required />
                  <Select label={t.type} name="type" options={[
                    { label: lang === 'zh' ? '预注册' : 'Pre-registrazione', value: '预注册' },
                    { label: lang === 'zh' ? '学考试报名' : 'Iscrizione esame', value: '学考试报名' },
                    { label: lang === 'zh' ? '学校报名' : 'Iscrizione scuola', value: '学校报名' },
                    { label: lang === 'zh' ? '其他' : 'Altro', value: '其他' }
                  ]} defaultValue={modalConfig.data?.type} />
                  <Input label={t.status} name="status" defaultValue={modalConfig.data?.status} required />
                </>
              )}
              {modalConfig.type === 'classFormation' && (
                <>
                  <Input label={t.title} name="title" defaultValue={modalConfig.data?.title} required />
                  <Input label={t.status} name="status" defaultValue={modalConfig.data?.status} required />
                </>
              )}
              {modalConfig.type === 'trialClass' && (
                <>
                  <Input label={t.student} name="student" defaultValue={modalConfig.data?.student} required />
                  <Input label={t.time} name="time" defaultValue={modalConfig.data?.time} required />
                  <Input label={t.channel} name="channel" defaultValue={modalConfig.data?.channel} required />
                  <div className="flex gap-4">
                    <Checkbox label={t.isArranged} name="isArranged" defaultChecked={modalConfig.data?.isArranged} />
                    <Checkbox label={t.isFollowUp} name="isFollowUp" defaultChecked={modalConfig.data?.isFollowUp} />
                  </div>
                </>
              )}
              {modalConfig.type === 'mediaOperation' && (
                <>
                  <Input label={t.content} name="content" defaultValue={modalConfig.data?.content} required />
                  <Input label={t.platform} name="platforms" defaultValue={modalConfig.data?.platforms?.join(', ')} placeholder={lang === 'zh' ? "多个平台用逗号分隔" : "Separa più piattaforme con virgole"} required />
                </>
              )}
              {modalConfig.type === 'financeRecord' && (
                <>
                  <Select label={t.type} name="type" options={[{ label: t.receivable, value: '应收款' }, { label: t.invoice, value: '发票' }]} defaultValue={modalConfig.data?.type} />
                  <Input label={t.amount} name="amount" defaultValue={modalConfig.data?.amount} required />
                  <Input label={t.detail} name="detail" defaultValue={modalConfig.data?.detail} required />
                </>
              )}
              {modalConfig.type === 'offlineVisit' && (
                <>
                  <Input label={t.visitor} name="visitor" defaultValue={modalConfig.data?.visitor} required />
                  <Input label={t.time} name="time" defaultValue={modalConfig.data?.time} required />
                  <Input label={t.purpose} name="purpose" defaultValue={modalConfig.data?.purpose} required />
                </>
              )}
              {modalConfig.type === 'todoItem' && (
                <>
                  <Select label={t.assignee} name="assignee" options={TODO_ASSIGNEES} defaultValue={modalConfig.data?.assignee} />
                  <Input label={t.task} name="task" defaultValue={modalConfig.data?.task} required />
                  <Checkbox label={t.isCompleted} name="isCompleted" defaultChecked={modalConfig.data?.isCompleted} />
                  <Input label={t.remarks} name="remarks" defaultValue={modalConfig.data?.remarks} />
                </>
              )}
              {modalConfig.type === 'newLead' && (
                <Input label={t.leadName} name="lead" required />
              )}
              {modalConfig.type === 'followUpCustomer' && (
                <>
                  <Input label={t.student} name="name" required />
                  <Input label={t.status} name="status" required />
                </>
              )}
              {modalConfig.type === 'collaboration' && (
                <>
                  <Input label={t.task} name="task" required />
                  <Select label={t.from} name="from" options={EMPLOYEES} />
                  <Select label={t.to} name="to" options={EMPLOYEES} />
                </>
              )}
              {modalConfig.type === 'studentExam' && (
                <>
                  <Input label={t.date} name="date" type="date" required defaultValue={currentDate.toLocaleDateString('en-CA')} />
                  <Input label={t.student} name="student" required defaultValue={modalConfig.data?.student || ''} />
                  <Input label={t.examName} name="examName" required defaultValue={modalConfig.data?.examName || ''} />
                  <Input label={t.score} name="score" required defaultValue={modalConfig.data?.score || ''} />
                </>
              )}
              {modalConfig.type === 'exportExcel' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-300">开始日期</label>
                    <input 
                      type="date" 
                      value={exportStartDate.toLocaleDateString('en-CA')}
                      onChange={(e) => setExportStartDate(new Date(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-950/50 text-slate-100 rounded-xl border border-white/10 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-300">结束日期</label>
                    <input 
                      type="date" 
                      value={exportEndDate.toLocaleDateString('en-CA')}
                      onChange={(e) => setExportEndDate(new Date(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-950/50 text-slate-100 rounded-xl border border-white/10 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                    />
                  </div>
                </div>
              )}
              {modalConfig.type === 'clearAll' && (
                <div className="py-4 text-center text-slate-300 font-medium">
                  {t.confirmClearAll}
                </div>
              )}
              {modalConfig.type === 'confirmDelete' && (
                <div className="py-4 text-center text-slate-300 font-medium">
                  {t.confirmDelete}
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 bg-slate-800/80 text-slate-400 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit"
                  disabled={isExporting}
                  className={cn(
                    "flex-1 px-4 py-2.5 text-slate-100 rounded-xl font-bold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                    (modalConfig.type === 'clearAll' || modalConfig.type === 'confirmDelete')
                      ? "bg-brand-red hover:bg-brand-red/80" 
                      : "bg-brand-blue hover:bg-brand-blue"
                  )}
                >
                  {isExporting ? '导出中...' : (modalConfig.type === 'clearAll' ? t.clearAll : modalConfig.type === 'confirmDelete' ? t.confirmDelete : modalConfig.type === 'exportExcel' ? t.exportExcel : t.save)}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Footer / Employee List */}
      <footer className="bg-slate-900 text-slate-100 p-8 mt-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <Users className="w-4 h-4" /> {t.teamMembers}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {EMPLOYEES.map(emp => (
              <div key={emp} className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-xs">
                  {emp.split(' ')[0][0]}{emp.split(' ')[1]?.[0] || ''}
                </div>
                <span className="text-[10px] font-bold text-center">{emp}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-[10px] text-slate-400 font-bold">
            {t.footerText}
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
interface SectionBlockProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SectionBlock({ title, icon, children }: SectionBlockProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card"
    >
      <div className="section-header">
        {icon}
        {title}
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.section>
  );
}

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
}

function SubSection({ title, children, onAdd }: SubSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-brand-blue rounded-full" />
          {title}
        </h3>
        {onAdd && (
          <button 
            onClick={onAdd}
            className="p-1 hover:bg-slate-800/80 rounded-lg text-brand-blue transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

// Form Components
function Input({ label, name, defaultValue, required, placeholder, type = "text" }: { label: string; name: string; defaultValue?: string; required?: boolean; placeholder?: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-400">{label}</label>
      <input 
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-slate-950/50 text-slate-100 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
      />
    </div>
  );
}

function Select({ label, name, options, defaultValue }: { label: string; name: string; options: (string | { label: string; value: string })[]; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-400">{label}</label>
      <select 
        name={name}
        defaultValue={defaultValue}
        className="w-full px-3 py-2 bg-slate-950/50 text-slate-100 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
      >
        {options.map(opt => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const labelText = typeof opt === 'string' ? opt : opt.label;
          return <option key={value} value={value}>{labelText}</option>;
        })}
      </select>
    </div>
  );
}

function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input 
        type="checkbox" 
        name={name}
        defaultChecked={defaultChecked}
        className="w-4 h-4 rounded border-white/10 bg-slate-950/50 text-brand-blue focus:ring-brand-blue"
      />
      <span className="text-xs font-bold text-slate-400 group-hover:text-slate-100 transition-colors">{label}</span>
    </label>
  );
}
