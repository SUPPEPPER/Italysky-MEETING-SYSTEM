/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
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
  LogOut,
  Instagram,
  Youtube,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  INITIAL_STUDENT_EXAMS,
  EMPTY_ARRAY,
  MEDIA_ACCOUNTS
} from './constants';
import { Language, translations } from './translations';

export default function App() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // State
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [lang, setLang] = useCloudBaseData<Language>('lang', 'zh', user?.uid);
  const t = translations[lang];

  // Format date to YYYY-MM-DD manually to avoid locale issues
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  
  const dateString = formatDate(currentDate);

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

  const [redList, setRedList, init14, docExists14] = useCloudBaseData<{id: string, name: string, reason: string}[]>('redList', EMPTY_ARRAY, user?.uid);
  const [bossInstructions, setBossInstructions, init15, docExists15] = useCloudBaseData<string[]>('bossInstructions', EMPTY_ARRAY, user?.uid, dateString);
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

  const isProcessingCarryOver = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const carryOverData = async () => {
      if (!user || !isDataLoaded) {
        return;
      }

      // Prevent parallel runs for the same date
      if (isProcessingCarryOver.current === dateString) {
        return;
      }
      isProcessingCarryOver.current = dateString;

      const yesterdayDate = new Date(currentDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayDateString = formatDate(yesterdayDate);

      console.log(`[CarryOver] Starting carry-over for ${dateString}. Yesterday was ${yesterdayDateString}`);

      const fetchYesterdayData = async (key: string) => {
        const docId = `dashboard_shared_${yesterdayDateString}_${key}`;
        try {
          const res = await db.collection('dashboard_data').doc(docId).get();
          const data = res.data as any;
          if (data) {
            // Handle both object and array responses from CloudBase
            const value = Array.isArray(data) ? (data.length > 0 ? data[0].value : null) : data.value;
            if (value !== undefined && value !== null) {
              return value;
            }
          }
        } catch (e) {
          console.error(`[CarryOver] Error fetching ${key} for ${yesterdayDateString}:`, e);
        }
        return null;
      };

      // Define which keys we need from yesterday
      const keysToFetch = [
        'todayClasses',      // For mapping to yesterdayClasses
        'yesterdayMedia',    // For carry over
        'mediaOperations',   // For carry over
        'financeRecords',    // Continuous
        'agencyTracking',    // Continuous
        'studentRegistrations', // Continuous
        'classFormations',   // Continuous
        'trialClasses',      // Continuous
        'studentExams',      // Continuous
        'offlineVisits',     // Continuous
        'bossInstructions',  // Continuous
        'cooperationNote',   // Continuous
        'salesConversion'    // Continuous
      ];

      // Fetch all in parallel for efficiency
      const results = await Promise.all(keysToFetch.map(key => fetchYesterdayData(key)));
      
      if (!isMounted || isProcessingCarryOver.current !== dateString) return;
      
      const yesterdayData: Record<string, any> = {};
      keysToFetch.forEach((key, i) => {
        yesterdayData[key] = results[i];
      });

      console.log(`[CarryOver] Data fetched for ${yesterdayDateString}:`, Object.keys(yesterdayData).filter(k => yesterdayData[k] !== null));

      // 1. Today's Classes (Yesterday) -> Yesterday's Review (Today)
      // Only if today's yesterdayClasses doesn't exist yet
      if (!docExists1) {
        const prevTodayClasses = yesterdayData['todayClasses'];
        if (prevTodayClasses && Array.isArray(prevTodayClasses) && prevTodayClasses.length > 0) {
          console.log(`[CarryOver] Mapping ${prevTodayClasses.length} todayClasses from ${yesterdayDateString} to yesterdayClasses for ${dateString}`);
          const mapped = prevTodayClasses.map((c: any) => ({
            id: c.id || Math.random().toString(36).substr(2, 9),
            name: c.name || '',
            teacher: c.teacher || '',
            feedbackCompleted: false,
            absentStudents: '',
            remarks: ''
          }));
          setYesterdayClasses(mapped);
        }
      }

      // 2. Continuous Tasks (Carry over if today's doc doesn't exist AND yesterday has data)
      // This prevents overwriting with empty data if the fetch failed or yesterday was empty
      
      // Finance Records (init10)
      if (!docExists10 && yesterdayData['financeRecords'] && Array.isArray(yesterdayData['financeRecords']) && yesterdayData['financeRecords'].length > 0) {
        setFinanceRecords(yesterdayData['financeRecords']);
      }

      // Academic Affairs
      if (!docExists4 && yesterdayData['agencyTracking']) setAgencyTracking(yesterdayData['agencyTracking']);
      if (!docExists5 && yesterdayData['studentRegistrations']) setStudentRegistrations(yesterdayData['studentRegistrations']);
      if (!docExists6 && yesterdayData['classFormations']) setClassFormations(yesterdayData['classFormations']);
      if (!docExists7 && yesterdayData['trialClasses']) setTrialClasses(yesterdayData['trialClasses']);
      if (!docExists16 && yesterdayData['studentExams']) setStudentExams(yesterdayData['studentExams']);
      if (!docExists11 && yesterdayData['offlineVisits']) setOfflineVisits(yesterdayData['offlineVisits']);
      if (!docExists15 && yesterdayData['bossInstructions']) setBossInstructions(yesterdayData['bossInstructions']);
      if (!docExists13 && yesterdayData['cooperationNote']) setCooperationNote(yesterdayData['cooperationNote']);
      if (!docExists9 && yesterdayData['salesConversion']) setSalesConversion(yesterdayData['salesConversion']);

      // 3. Media and Operations (Carry over if today's doc doesn't exist AND yesterday has data)
      if (!docExists2 && yesterdayData['yesterdayMedia'] && Array.isArray(yesterdayData['yesterdayMedia']) && yesterdayData['yesterdayMedia'].length > 0) {
        setYesterdayMedia(yesterdayData['yesterdayMedia']);
      }
      
      if (!docExists8 && yesterdayData['mediaOperations'] && Array.isArray(yesterdayData['mediaOperations']) && yesterdayData['mediaOperations'].length > 0) {
        setMediaOperations(yesterdayData['mediaOperations']);
      }

      console.log(`[CarryOver] Finished carry-over for ${dateString}`);
    };

    carryOverData();

    return () => {
      isMounted = false;
    };
  }, [currentDate, user, isDataLoaded, docExists1, docExists2, docExists4, docExists5, docExists6, docExists7, docExists8, docExists9, docExists10, docExists11, docExists13, docExists15, docExists16]);

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
      const newItem: MediaRecord = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        platform: data.platform as any,
        accountName: data.accountName as string,
        views: (data.views as string) || '',
        followers: (data.followers as string) || '',
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
      const newItem: MediaOperation = {
        id: modalConfig.isEdit ? modalConfig.data.id : Math.random().toString(36).substr(2, 9),
        accountName: data.accountName as string,
        platform: data.platform as string,
        content: data.content as string,
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
    }

    closeModal();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-white p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-black/5 w-full max-w-md text-center border border-slate-100">
          <h1 className="text-3xl font-serif font-bold text-brand-black mb-2">{t.brandName}</h1>
          <p className="text-slate-500 mb-8">{t.systemName}</p>
          
          <form onSubmit={handleCustomAuth} className="flex flex-col gap-4 mb-4">
            <input
              type="text"
              placeholder="用户名 (如: 张三)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 text-brand-black border border-slate-200 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-all"
              required
            />
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 text-brand-black border border-slate-200 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-all"
              required
            />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-brand-black hover:bg-slate-800 text-brand-white rounded-xl font-bold transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={authLoading}
            >
              {authLoading ? '处理中...' : (isRegisterMode ? '注册并登录' : '登录')}
            </button>
          </form>

          <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
            <button 
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
              }}
              className="hover:text-brand-red transition-colors"
            >
              {isRegisterMode ? '已有账号？去登录' : '没有账号？去注册'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 italic">
              本平台为内部平台，请勿外传链接
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-brand-black border-t-brand-red rounded-full animate-spin mb-6"></div>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-serif font-bold tracking-tighter text-brand-black mb-2">{t.brandName}</h1>
          <p className="text-[10px] font-bold text-brand-red uppercase tracking-[0.4em]">{t.systemName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans" ref={dashboardRef}>
      {dbError && (
        <div className="bg-brand-red text-white p-4 text-sm text-center shadow-2xl relative z-[60] font-bold">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 items-center">
              <p className="uppercase tracking-widest">⚠️ 数据库连接失败 (网络请求错误)</p>
              <p className="text-[10px] opacity-90 font-normal">请检查：1. .env 文件中的 VITE_TCB_REGION 是否正确。2. 云开发控制台是否已开启数据库服务。3. 是否已将当前域名添加到“安全应用来源”。</p>
            </div>
            <button onClick={() => setDbError(false)} className="p-1 hover:bg-white/20 transition-colors rounded-none">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left: Brand and Date Navigation */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
              <div className="flex flex-col leading-tight text-center sm:text-left shrink-0">
                <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-brand-black whitespace-nowrap">
                  {t.brandName}
                </h1>
                <span className="text-[10px] font-bold text-brand-red uppercase tracking-[0.2em] whitespace-nowrap">
                  {t.systemName}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-none border border-slate-200">
                <button 
                  onClick={() => changeDate(-1)}
                  className="p-2 hover:bg-white rounded-none text-brand-black transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 shadow-sm min-w-[140px] justify-center">
                  <Calendar className="w-4 h-4 text-brand-red" />
                  <span className="text-sm font-bold text-brand-black">{dateString}</span>
                </div>
                <button 
                  onClick={() => changeDate(1)}
                  className="p-2 hover:bg-white rounded-none text-brand-black transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-[10px] bg-brand-black text-brand-white border border-brand-black hover:bg-brand-red hover:border-brand-red transition-colors whitespace-nowrap font-bold"
                >
                  {t.today}
                </button>
              </div>
            </div>

            {/* Right: Actions and User */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
              <div className="flex items-center bg-slate-50 p-1 border border-slate-200">
                <button
                  onClick={() => setLang('zh')}
                  className={cn(
                    "px-3 py-1.5 text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap",
                    lang === 'zh' ? "bg-brand-black text-brand-white shadow-sm" : "text-slate-500 hover:text-brand-black"
                  )}
                >
                  中文
                </button>
                <button
                  onClick={() => setLang('it')}
                  className={cn(
                    "px-3 py-1.5 text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap",
                    lang === 'it' ? "bg-brand-black text-brand-white shadow-sm" : "text-slate-500 hover:text-brand-black"
                  )}
                >
                  Italiano
                </button>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => openModal('clearAll', t.clearAll)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-brand-red/10 text-brand-red hover:bg-brand-red/20 rounded-none text-xs font-bold transition-all whitespace-nowrap border border-brand-red/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.clearAll}</span>
                </button>
                
                <div className="w-px h-6 bg-slate-200 mx-0.5"></div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-black text-brand-white flex items-center justify-center font-bold text-sm border border-slate-200 shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-brand-red hover:bg-brand-red/10 rounded-none transition-colors"
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
      <div className="bg-brand-black border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center gap-6">
          <div className="flex items-center gap-3 bg-brand-red px-4 py-2 rounded-none shrink-0">
            <Bell className="w-5 h-5 text-brand-white" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-white">{t.bossInstructions}</span>
          </div>
          <div className="flex-1 flex flex-wrap gap-x-8 gap-y-2">
            {bossInstructions.map((instruction, idx) => (
              <div key={idx} className="flex items-center gap-2 text-brand-white font-bold text-sm">
                <div className="w-1.5 h-1.5 bg-brand-red rounded-full" />
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
              <div className="overflow-x-auto border border-black">
                <table className="w-full text-sm text-left">
                  <thead className="bg-black text-white font-bold uppercase text-xs tracking-widest">
                    <tr>
                      <th className="px-4 py-4 border-b border-black">{t.courseName}</th>
                      <th className="px-4 py-4 border-b border-black">{t.teacher}</th>
                      <th className="px-4 py-4 border-b border-black">{t.feedbackStatus}</th>
                      <th className="px-4 py-4 border-b border-black">{t.absentStudents}</th>
                      <th className="px-4 py-4 border-b border-black">{t.remarks}</th>
                      <th className="px-4 py-4 border-b border-black text-right">{t.operation}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {yesterdayClasses.map(cls => (
                      <tr key={cls.id} className="hover:bg-slate-50 group">
                        <td className="px-4 py-3 font-bold text-brand-black">{cls.name}</td>
                        <td className="px-4 py-3 text-slate-500">{cls.teacher}</td>
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
                        <td className="px-4 py-3 text-slate-500">{cls.absentStudents}</td>
                        <td className="px-4 py-3 text-slate-500 italic text-xs">{cls.remarks}</td>
                        <td className="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openModal('yesterdayClass', t.editRecord, cls, true)} className="p-1 hover:text-brand-red transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete('yesterdayClass', cls.id)} className="p-1 hover:text-brand-red transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SubSection>

            {/* Yesterday Media */}
            <SubSection title={t.yesterdayMedia}>
              <div className="grid grid-cols-1 gap-4">
                {yesterdayMedia.map((media, idx) => (
                  <div key={media.id} className="p-4 bg-white border border-slate-200 rounded-none flex flex-col sm:flex-row sm:items-center gap-4 hover:border-brand-black transition-colors">
                    <div className="w-full sm:w-1/3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">{media.platform}</div>
                      <div className="text-sm font-bold text-brand-black font-serif">{media.accountName}</div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.views}</label>
                        <input 
                          type="text"
                          value={media.views || ''}
                          onChange={(e) => {
                            const newList = [...yesterdayMedia];
                            newList[idx] = { ...newList[idx], views: e.target.value };
                            setYesterdayMedia(newList);
                          }}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 text-xs font-bold focus:outline-none focus:border-brand-black"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.followers}</label>
                        <input 
                          type="text"
                          value={media.followers || ''}
                          onChange={(e) => {
                            const newList = [...yesterdayMedia];
                            newList[idx] = { ...newList[idx], followers: e.target.value };
                            setYesterdayMedia(newList);
                          }}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 text-xs font-bold focus:outline-none focus:border-brand-black"
                          placeholder="0"
                        />
                      </div>
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
                    "p-4 rounded-none border flex flex-col gap-2 relative group transition-all hover:border-brand-black",
                    cls.type === '线上' ? "bg-slate-50 border-slate-200" : "bg-white border-slate-200"
                  )}>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-none uppercase",
                        cls.type === '线上' ? "bg-brand-black text-brand-white" : "bg-brand-red text-brand-white"
                      )}>
                        {cls.type === '线上' ? t.online : t.offline}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{cls.time}</span>
                    </div>
                    <h4 className="text-sm font-bold text-brand-black">{cls.name}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3" /> {cls.location}
                      </span>
                      <span className="font-bold text-brand-black">@{cls.teacher}</span>
                    </div>
                    {cls.feedbackReminder && (
                      <div className="mt-2 text-[10px] font-bold text-brand-red flex items-center gap-1 animate-pulse">
                        <AlertCircle className="w-3 h-3" /> {t.feedbackReminder}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('todayClass', t.editRecord, cls, true)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('todayClass', cls.id)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            {/* Red List Warning */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-brand-red flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-brand-red rounded-none" />
                  {t.redList}
                </h3>
                <button 
                  onClick={() => openModal('redList', t.addRecord)}
                  className="p-1.5 bg-brand-red/10 text-brand-red rounded-none hover:bg-brand-red/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {redList.map(item => (
                  <div key={item.id} className="p-4 bg-brand-red/5 border border-brand-red/20 rounded-none flex items-center justify-between relative group hover:border-brand-red transition-colors">
                    <div>
                      <div className="text-sm font-bold text-brand-black">{item.name}</div>
                      <div className="text-[10px] font-bold text-brand-red uppercase tracking-wider">{item.reason}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 text-brand-red group-hover:opacity-0 transition-opacity">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="absolute right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal('redList', t.editRecord, item, true)} className="p-1.5 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete('redList', item.id)} className="p-1.5 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Trash2 className="w-3.5 h-3.5" /></button>
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
              <p className="text-xs text-slate-500 font-bold italic">
                {t.todoListSubtitle}
              </p>
              <button 
                onClick={() => openModal('todoItem', t.addRecord)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white rounded-none text-xs font-bold hover:bg-slate-800 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> {t.addTask}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {TODO_ASSIGNEES.map(assignee => {
                const personTasks = todoList.filter(t => t.assignee === assignee);
                return (
                  <div key={assignee} className="flex flex-col gap-3 p-5 bg-white rounded-none border border-slate-200 shadow-sm hover:border-brand-black transition-colors">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-black text-brand-white rounded-none flex items-center justify-center font-bold text-xs">
                          {assignee.split(' ')[0][0]}
                        </div>
                        <h4 className="text-sm font-bold text-brand-black">
                          {assignee}
                        </h4>
                      </div>
                      <button 
                        onClick={() => openModal('todoItem', `${t.add} ${assignee}`, { assignee })}
                        className="p-1.5 hover:bg-slate-50 rounded-none text-brand-red transition-colors"
                        title={t.addTask}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-h-[120px]">
                      {personTasks.length > 0 ? (
                        personTasks.map(item => (
                          <div key={item.id} className="bg-slate-50 p-3.5 rounded-none border border-slate-100 group relative hover:border-brand-red transition-colors">
                            <div className="flex flex-col gap-2.5">
                              <p className={cn(
                                "text-xs font-bold leading-relaxed",
                                item.isCompleted ? "text-slate-400 line-through" : "text-brand-black"
                              )}>
                                {item.task}
                              </p>
                              
                              {item.remarks && (
                                <div className="text-[10px] text-slate-500 italic bg-white p-2 rounded-none border border-slate-100 flex gap-2">
                                  <span className="text-brand-red font-bold">#</span>
                                  {item.remarks}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-1">
                                <button 
                                  onClick={() => toggleTodoStatus(item.id)}
                                  className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[9px] font-bold transition-all",
                                    item.isCompleted 
                                      ? "bg-brand-green text-brand-white" 
                                      : "bg-white text-slate-400 hover:text-brand-black border border-slate-200"
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
                                    className="p-1.5 hover:text-brand-red bg-white border border-slate-200 rounded-none shadow-sm"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete('todoItem', item.id)} 
                                    className="p-1.5 hover:text-brand-red bg-white border border-slate-200 rounded-none shadow-sm"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-none py-6">
                          <CheckCircle2 className="w-6 h-6 text-slate-200 mb-2" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.noTasks}</span>
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
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-none group relative hover:border-brand-black transition-colors">
                    <div className="text-sm font-bold text-brand-black mb-2">{item.student}</div>
                    <div className="text-[10px] text-brand-red font-bold uppercase tracking-widest mb-2">[{item.status}]</div>
                    <div className="text-[10px] text-slate-400 font-bold italic">{t.deadline}: {item.deadline}</div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('agencyTracking', t.editRecord, item, true)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('agencyTracking', item.id)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.studentRegistration} onAdd={() => openModal('studentRegistration', t.addRecord)}>
              <div className="space-y-3">
                {studentRegistrations.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-none group relative hover:border-brand-black transition-colors">
                    <div className="text-sm font-bold text-brand-black mb-2">{item.student}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.type}</span>
                      <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">{item.status}</span>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('studentRegistration', t.editRecord, item, true)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('studentRegistration', item.id)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.classFormation} onAdd={() => openModal('classFormation', t.addRecord)}>
              <div className="space-y-3">
                {classFormations.map(item => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-none group relative hover:border-brand-black transition-colors">
                    <div className="text-sm font-bold text-brand-black mb-2">{item.title}</div>
                    <div className="text-[10px] font-bold text-brand-red uppercase tracking-widest">{item.status}</div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('classFormation', t.editRecord, item, true)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('classFormation', item.id)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.trialClasses} onAdd={() => openModal('trialClass', t.addRecord)}>
              <div className="space-y-3">
                {trialClasses.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-none group relative hover:border-brand-black transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-brand-black">{item.student}</span>
                      <span className="text-[10px] font-bold text-brand-red">{item.time}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold italic mb-3">{t.channel}: {item.channel}</div>
                    <div className="flex gap-2">
                      {item.isArranged && <span className="text-[9px] font-bold bg-brand-black text-brand-white px-2 py-0.5 rounded-none uppercase tracking-wider">{t.isArranged}</span>}
                      {item.isFollowUp && <span className="text-[9px] font-bold bg-brand-red text-brand-white px-2 py-0.5 rounded-none uppercase tracking-wider">{t.isFollowUp}</span>}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('trialClass', t.editRecord, item, true)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('trialClass', item.id)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.studentExams} onAdd={() => openModal('studentExam', t.addRecord)}>
              <div className="space-y-3">
                {studentExams.map(item => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-none group relative hover:border-brand-black transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-brand-black">{item.student}</span>
                      <span className="text-[10px] font-bold text-brand-red">{item.date}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-500 italic mb-2">{item.examName}</div>
                    <div className="text-[10px] font-bold text-brand-black uppercase tracking-widest">{t.score}: {item.score}</div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('studentExam', t.editRecord, item, true)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete('studentExam', item.id)} className="p-1 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>
          </div>
        </SectionBlock>

        {/* Section 4: Today Media Production */}
        <SectionBlock title={t.todayMediaProduction} icon={<TrendingUp className="w-6 h-6" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaOperations.map((media, idx) => (
              <div key={media.id} className="p-5 bg-white border border-slate-200 rounded-none flex flex-col gap-4 hover:border-brand-black transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-black text-brand-white flex items-center justify-center rounded-none group-hover:bg-brand-red transition-colors">
                    {media.platform === '公众号' ? <MessageSquare className="w-4 h-4" /> : 
                     media.platform === '视频号' ? <Youtube className="w-4 h-4" /> : 
                     <Instagram className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">{media.platform}</div>
                    <div className="text-sm font-bold text-brand-black font-serif">{media.accountName}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t.publishedContent}</label>
                  <textarea 
                    value={media.content || ''}
                    onChange={(e) => {
                      const newList = [...mediaOperations];
                      newList[idx] = { ...newList[idx], content: e.target.value };
                      setMediaOperations(newList);
                    }}
                    className="w-full px-4 py-3 bg-slate-50 text-brand-black border border-slate-100 rounded-none text-sm font-bold focus:outline-none focus:border-brand-black transition-all placeholder:text-slate-300 placeholder:font-normal min-h-[80px] resize-none"
                    placeholder={lang === 'zh' ? "输入今日发布内容..." : "Inserisci il contenuto di oggi..."}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>

        {/* Section 5: Sales Conversion */}
        <SectionBlock title={t.salesConversion} icon={<Users className="w-6 h-6" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SubSection title={t.newLeads} onAdd={() => openModal('newLead', t.addRecord)}>
              <div className="flex flex-wrap gap-2">
                {salesConversion.newLeads.map((lead, idx) => (
                  <span key={idx} className="text-xs font-bold bg-slate-50 text-brand-black border border-slate-200 px-4 py-2 rounded-none flex items-center gap-3 group hover:border-brand-red transition-colors">
                    {lead}
                    <button 
                      onClick={() => setSalesConversion(prev => ({ ...prev, newLeads: prev.newLeads.filter((_, i) => i !== idx) }))}
                      className="opacity-0 group-hover:opacity-100 hover:text-brand-red transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.followUp} onAdd={() => openModal('followUpCustomer', t.addRecord)}>
              <div className="space-y-3">
                {salesConversion.followUpCustomers.map((customer, idx) => (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-none relative group hover:border-brand-black transition-colors">
                    <div className="text-sm font-bold text-brand-black mb-1">{customer.name}</div>
                    <div className="text-[10px] font-bold text-brand-red uppercase tracking-widest">{customer.status}</div>
                    <button 
                      onClick={() => setSalesConversion(prev => ({ ...prev, followUpCustomers: prev.followUpCustomers.filter((_, i) => i !== idx) }))}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:text-brand-red transition-opacity p-1 bg-white border border-slate-200 rounded-none shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.collaboration} onAdd={() => openModal('collaboration', t.addRecord)}>
              <div className="space-y-3">
                {salesConversion.collaborations.map((collab, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-none relative group hover:border-brand-black transition-colors">
                    <p className="text-xs font-bold text-brand-black mb-3 italic leading-relaxed">{collab.task}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>{t.from}: {collab.from}</span>
                      <span>{t.to}: {collab.to}</span>
                    </div>
                    <button 
                      onClick={() => setSalesConversion(prev => ({ ...prev, collaborations: prev.collaborations.filter((_, i) => i !== idx) }))}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:text-brand-red transition-opacity p-1 bg-white border border-slate-200 rounded-none shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </SubSection>
          </div>
        </SectionBlock>

        {/* Section 6: Finance */}
        <SectionBlock title={t.financeRecords} icon={<CreditCard className="w-6 h-6" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {financeRecords.map(record => (
              <div key={record.id} className="p-5 bg-white border border-slate-200 rounded-none shadow-sm flex items-center gap-5 relative group hover:border-brand-black transition-all">
                <div className={cn(
                  "w-12 h-12 rounded-none flex items-center justify-center",
                  record.type === '应收款' ? "bg-brand-red text-brand-white" : "bg-brand-black text-brand-white"
                )}>
                  {record.type === '应收款' ? <AlertCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{record.type === '应收款' ? t.receivable : t.invoice}</div>
                  <div className="text-xl font-bold text-brand-black font-serif">¥{record.amount}</div>
                  <div className="text-[10px] text-slate-500 italic font-bold">{record.detail}</div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal('financeRecord', t.editRecord, record, true)} className="p-1.5 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete('financeRecord', record.id)} className="p-1.5 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            <button 
              onClick={() => openModal('financeRecord', t.addRecord)}
              className="p-5 border-2 border-dashed border-slate-100 rounded-none flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-brand-red hover:border-brand-red transition-all group"
            >
              <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.addRecord}</span>
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
              className="w-full h-32 p-4 bg-white text-brand-black border border-slate-200 rounded-none text-sm focus:outline-none focus:border-brand-black transition-all resize-none font-bold italic"
            />
          </SectionBlock>

          <SectionBlock title={t.bossInstructions} icon={<Bell className="w-6 h-6" />}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {bossInstructions.map((inst, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-none border border-slate-200 group">
                    <span className="flex-1 text-sm font-bold text-brand-black">{inst}</span>
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
                  className="flex-1 px-4 py-2 bg-white text-brand-black border border-slate-200 rounded-none text-sm focus:outline-none focus:border-brand-black font-bold"
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
                  className="px-4 py-2 bg-brand-black text-brand-white rounded-none text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  {t.add}
                </button>
              </div>
            </div>
          </SectionBlock>
        </div>

        {/* Section 8: Offline Visits */}
        <SectionBlock title={t.offlineVisits} icon={<UserPlus className="w-6 h-6" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offlineVisits.map(visit => (
              <div key={visit.id} className="p-5 bg-white border border-slate-200 rounded-none shadow-sm relative group hover:border-brand-black transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-brand-black">{visit.visitor}</span>
                  <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest">{visit.time}</span>
                </div>
                <p className="text-xs text-slate-500 font-bold italic">{t.purposeLabel}{visit.purpose}</p>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal('offlineVisit', t.editRecord, visit, true)} className="p-1.5 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete('offlineVisit', visit.id)} className="p-1.5 bg-white border border-slate-200 rounded-none shadow-sm hover:text-brand-red"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            <button 
              onClick={() => openModal('offlineVisit', t.addRecord)}
              className="p-5 border-2 border-dashed border-slate-100 rounded-none flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-brand-red hover:border-brand-red transition-all group"
            >
              <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.addVisit}</span>
            </button>
          </div>
        </SectionBlock>
      </main>

      {/* Modal */}
      {isModalOpen && modalConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-none shadow-2xl w-full max-w-md overflow-hidden border border-brand-black"
          >
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="text-2xl font-serif font-bold text-brand-black tracking-tight uppercase">{modalConfig.title}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-none transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-5">
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
              {modalConfig.type === 'clearAll' && (
                <div className="py-8 text-center text-brand-black font-serif font-bold text-xl italic">
                  {t.confirmClearAll}
                </div>
              )}
              {modalConfig.type === 'confirmDelete' && (
                <div className="py-8 text-center text-brand-black font-serif font-bold text-xl italic">
                  {t.confirmDelete}
                </div>
              )}
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="flex-1 px-6 py-4 border border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-colors rounded-none"
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit" 
                  className={cn(
                    "flex-1 px-6 py-4 text-brand-white font-bold uppercase tracking-widest text-[10px] transition-colors rounded-none",
                    (modalConfig.type === 'clearAll' || modalConfig.type === 'confirmDelete')
                      ? "bg-brand-red hover:bg-red-700" 
                      : "bg-brand-black hover:bg-slate-800"
                  )}
                >
                  {modalConfig.type === 'clearAll' ? t.clearAll : modalConfig.type === 'confirmDelete' ? t.confirmDelete : t.save}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Footer / Employee List */}
      <footer className="bg-brand-black text-brand-white p-8 mt-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <Users className="w-4 h-4" /> {t.teamMembers}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {EMPLOYEES.map(emp => (
              <div key={emp} className="flex flex-col items-center gap-2 p-3 bg-slate-900 rounded-none border border-slate-800">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs">
                  {emp.split(' ')[0][0]}{emp.split(' ')[1]?.[0] || ''}
                </div>
                <span className="text-[10px] font-bold text-center">{emp}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-[10px] text-slate-500 font-bold">
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
      <div className="flex items-center justify-between bg-black px-3 py-2 border-l-4 border-brand-red">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
          {title}
        </h3>
        {onAdd && (
          <button 
            onClick={onAdd}
            className="p-1 hover:bg-brand-red text-white transition-colors"
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
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</label>
      <input 
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white text-brand-black border border-slate-200 rounded-none text-sm font-bold focus:outline-none focus:border-brand-black transition-all placeholder:text-slate-300 placeholder:font-normal"
      />
    </div>
  );
}

function Select({ label, name, options, defaultValue }: { label: string; name: string; options: (string | { label: string; value: string })[]; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</label>
      <select 
        name={name}
        defaultValue={defaultValue}
        className="w-full px-4 py-3 bg-white text-brand-black border border-slate-200 rounded-none text-sm font-bold focus:outline-none focus:border-brand-black transition-all appearance-none cursor-pointer"
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
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative flex items-center justify-center">
        <input 
          type="checkbox" 
          name={name}
          defaultChecked={defaultChecked}
          className="peer w-5 h-5 rounded-none border-slate-300 bg-white text-brand-black focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
        />
        <div className="absolute inset-0 bg-brand-black scale-0 peer-checked:scale-100 transition-transform pointer-events-none flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-brand-black transition-colors">{label}</span>
    </label>
  );
}
