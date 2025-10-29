import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { 
  Film, 
  Download, 
  Settings, 
  ChevronRight, 
  Play, 
  Pause, 
  Trash2, 
  RefreshCw, 
  Link as LinkIcon, 
  AlertTriangle, 
  Check, 
  Code, 
  Shield, 
  Database, 
  Server,
  Lock,
  Layers,
  PieChart as PieChartIcon,
  BarChart2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { AnalysisResult } from '@/components/AnalysisResult';
import { AntiCrawlerConfig } from '@/components/AntiCrawlerConfig';
import { MonitoringDashboard } from '@/components/MonitoringDashboard';

// 模拟数据
const mockTasks = [
  {
    id: 1,
    url: "https://example-movie.com/film123",
    title: "复仇者联盟4：终局之战",
    status: "completed",
    quality: "1080p",
    fileSize: 2856,
    progress: 100,
    createdAt: "2025-10-28T14:30:00",
    downloadPath: "/downloads/avengers4.mp4",
    errorMessage: null
  },
  {
    id: 2,
    url: "https://example-movie.com/film456",
    title: "盗梦空间",
    status: "running",
    quality: "720p",
    fileSize: 1980,
    progress: 65,
    createdAt: "2025-10-29T09:15:00",
    downloadPath: null,
    errorMessage: null
  },
  {
    id: 3,
    url: "https://example-movie.com/film789",
    title: "星际穿越",
    status: "failed",
    quality: "1080p",
    fileSize: 0,
    progress: 0,
    createdAt: "2025-10-29T11:45:00",
    downloadPath: null,
    errorMessage: "连接超时，请检查网络或尝试其他反爬策略"
  },
  {
    id: 4,
    url: "https://example-movie.com/film101",
    title: "黑客帝国",
    status: "pending",
    quality: "4K",
    fileSize: 4560,
    progress: 0,
    createdAt: "2025-10-29T12:30:00",
    downloadPath: null,
    errorMessage: null
  }
];

// 监控数据
const monitoringData = [
  { name: '成功', value: 85, color: '#10b981' },
  { name: '失败', value: 15, color: '#ef4444' },
];

const speedData = [
  { name: '10:00', speed: 12 },
  { name: '10:30', speed: 18 },
  { name: '11:00', speed: 15 },
  { name: '11:30', speed: 22 },
  { name: '12:00', speed: 19 },
  { name: '12:30', speed: 25 },
];

// 模拟分析结果
const mockAnalysisResult = {
  url: "https://example-movie.com/film123",
  domain: "example-movie.com",
  title: "复仇者联盟4：终局之战",
  contentType: "HLS",
  foundLinks: [
    { url: "https://cdn.example.com/videos/avengers4/1080p/index.m3u8", type: "m3u8", quality: "1080p", size: "~3.2GB" },
    { url: "https://cdn.example.com/videos/avengers4/720p/index.m3u8", type: "m3u8", quality: "720p", size: "~1.8GB" },
    { url: "https://cdn.example.com/videos/avengers4/480p/index.m3u8", type: "m3u8", quality: "480p", size: "~950MB" },
  ],
  antiCrawlerMeasures: [
    { level: "初级", measures: ["User-Agent检测", "IP频率限制"], bypassable: true },
    { level: "中级", measures: ["JS加密参数"], bypassable: true },
  ],
  recommendedStrategy: "HLS流媒体下载策略",
  robotsTxt: { allowed: true, crawlDelay: 1 },
  legalStatus: "符合爬虫规则"
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState(mockTasks);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 模拟分析URL的函数
  const analyzeUrl = (url) => {
    setIsAnalyzing(true);
    toast.info(`正在分析URL: ${url}`);
    
    // 模拟网络请求延迟
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult);
      setIsAnalyzing(false);
      setActiveTab('analysis');
      toast.success('URL分析完成，发现3个可下载资源');
    }, 2000);
  };

  // 创建新任务
  const createTask = (taskData) => {
    const newTask = {
      id: tasks.length + 1,
      title: taskData.title || `未命名任务 ${tasks.length + 1}`,
      url: taskData.url,
      status: 'pending',
      quality: taskData.quality || '720p',
      fileSize: 0,
      progress: 0,
      createdAt: new Date().toISOString(),
      downloadPath: null,
      errorMessage: null
    };
    
    setTasks([newTask, ...tasks]);
    setActiveTab('tasks');
    toast.success(`任务 "${newTask.title}" 创建成功`);
  };

  // 控制任务状态
  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (task.status === 'running') {
          toast.info(`任务 "${task.title}" 已暂停`);
          return { ...task, status: 'paused' };
        } else if (task.status === 'paused' || task.status === 'pending') {
          toast.info(`任务 "${task.title}" 已开始`);
          return { ...task, status: 'running' };
        }
      }
      return task;
    }));
  };

  // 删除任务
  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.info(`任务 "${taskToDelete.title}" 已删除`);
    }
  };

  // 重试任务
  const retryTask = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        toast.info(`正在重试任务 "${task.title}"`);
        return { 
          ...task, 
          status: 'pending', 
          progress: 0,
          errorMessage: null
        };
      }
      return task;
    }));
  };

  // 获取状态对应的样式和图标
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-500', icon: <Check size={16} /> };
      case 'running':
        return { color: 'bg-blue-500', icon: <Play size={16} /> };
      case 'paused':
        return { color: 'bg-amber-500', icon: <Pause size={16} /> };
      case 'failed':
        return { color: 'bg-red-500', icon: <AlertTriangle size={16} /> };
      case 'pending':
        return { color: 'bg-purple-500', icon: <RefreshCw size={16} /> };
      default:
        return { color: 'bg-gray-500', icon: null };
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-6">
      {/* 页面标题 */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Film size={36} className="text-blue-500" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            电影爬虫工具站
          </h1>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          专业的视频资源获取解决方案，支持多种流媒体格式，智能绕过反爬机制
        </p>
      </header>

      {/* 导航标签 */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'dashboard', label: '控制面板', icon: <PieChartIcon size={18} /> },
          { id: 'analyze', label: 'URL分析', icon: <LinkIcon size={18} /> },
          { id: 'tasks', label: '任务管理', icon: <Download size={18} /> },
          { id: 'settings', label: '反爬设置', icon: <Shield size={18} /> },
          { id: 'monitoring', label: '监控中心', icon: <BarChart2 size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300',
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto">
        {/* 控制面板 */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
            {/* 统计卡片 */}
            {[
              { title: '总任务数', value: tasks.length, icon: <Database />, color: 'from-blue-600 to-blue-400' },
              { title: '成功任务', value: tasks.filter(t => t.status === 'completed').length, icon: <Check />, color: 'from-green-600 to-green-400' },
              { title: '进行中', value: tasks.filter(t => t.status === 'running').length, icon: <Play />, color: 'from-amber-600 to-amber-400' },
              { title: '失败任务', value: tasks.filter(t => t.status === 'failed').length, icon: <AlertTriangle />, color: 'from-red-600 to-red-400' }
            ].map((stat, index) => (
              <div key={index} className="card relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${stat.color}`}></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.title}</p>
                    <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* URL分析 */}
        {activeTab === 'analyze' && (
          <div className="space-y-8 fade-in">
            <div className="card">
              <h2 className="section-title">
                <LinkIcon className="text-blue-500" />
                URL分析器
              </h2>
              <TaskForm 
                onSubmit={analyzeUrl} 
                isLoading={isAnalyzing}
                buttonText="分析URL"
              />
            </div>
            
            {analysisResult && (
              <AnalysisResult result={analysisResult} onCreateTask={createTask} />
            )}
          </div>
        )}

        {/* 任务管理 */}
        {activeTab === 'tasks' && (
          <div className="space-y-8 fade-in">
            <div className="card">
              <h2 className="section-title">
                <Download className="text-blue-500" />
                创建下载任务
              </h2>
              <TaskForm 
                onSubmit={createTask} 
                isLoading={false}
                buttonText="创建任务"
              />
            </div>
            
            <div className="card">
              <h2 className="section-title">
                <Film className="text-blue-500" />
                任务列表
              </h2>
              <TaskList 
                tasks={tasks} 
                toggleTaskStatus={toggleTaskStatus}
                deleteTask={deleteTask}
                retryTask={retryTask}
                getStatusInfo={getStatusInfo}
              />
            </div>
          </div>
        )}

        {/* 反爬设置 */}
        {activeTab === 'settings' && (
          <div className="card fade-in">
            <h2 className="section-title">
              <Shield className="text-blue-500" />
              反爬设置
            </h2>
            <AntiCrawlerConfig />
          </div>
        )}

        {/* 监控中心 */}
        {activeTab === 'monitoring' && (
          <div className="space-y-8 fade-in">
            <MonitoringDashboard 
              successRateData={monitoringData}
              speedData={speedData}
              activeTasks={tasks.filter(t => t.status === 'running').length}
            />
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="mt-16 text-center text-slate-500 text-sm py-6 border-t border-slate-800">
        <p>电影爬虫工具站 © 2025 | 仅供学习和研究使用</p>
        <p className="mt-2">请遵守相关法律法规，尊重版权</p>
      </footer>
    </div>
  );
}