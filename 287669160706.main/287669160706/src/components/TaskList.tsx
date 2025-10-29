import React from 'react';
import { Play, Pause, Trash2, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Empty } from './Empty';
import { cn } from '@/lib/utils';

interface Task {
  id: number;
  url: string;
  title: string;
  status: 'completed' | 'running' | 'paused' | 'failed' | 'pending';
  quality: string;
  fileSize: number;
  progress: number;
  createdAt: string;
  downloadPath: string | null;
  errorMessage: string | null;
}

interface TaskListProps {
  tasks: Task[];
  toggleTaskStatus: (id: number) => void;
  deleteTask: (id: number) => void;
  retryTask: (id: number) => void;
  getStatusInfo: (status: string) => { color: string; icon: React.ReactNode };
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  toggleTaskStatus, 
  deleteTask, 
  retryTask,
  getStatusInfo
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <FileText size={48} className="mb-4 opacity-20" />
        <h3 className="text-xl font-medium">暂无任务</h3>
        <p className="text-sm mt-2">点击"创建下载任务"开始你的第一个爬虫任务</p>
      </div>
    );
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">标题</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">状态</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">质量</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">大小</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">进度</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">创建时间</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">操作</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            
            return (
              <tr key={task.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-slate-400 truncate max-w-xs">{task.url}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.color}`}></span>
                    <span className="capitalize">{task.status === 'pending' ? '等待中' : 
                                                      task.status === 'running' ? '下载中' :
                                                      task.status === 'completed' ? '已完成' :
                                                      task.status === 'paused' ? '已暂停' : '已失败'}</span>
                  </div>
                  {task.errorMessage && (
                    <button 
                      onClick={() => toast.error(task.errorMessage, { duration: 10000 })}
                      className="text-xs text-blue-400 mt-1 flex items-center gap-1 hover:underline"
                    >
                      <AlertCircle size={12} /> 查看错误
                    </button>
                  )}
                </td>
                <td className="py-4 px-4">{task.quality}</td>
                <td className="py-4 px-4">{formatFileSize(task.fileSize * 1024 * 1024)}</td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{task.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-value ${statusInfo.color}`} 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm">{formatDate(task.createdAt)}</td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    {(task.status === 'running' || task.status === 'paused' || task.status === 'pending') && (
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                        title={task.status === 'running' ? '暂停' : '开始'}
                      >
                        {task.status === 'running' ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    )}
                    
                    {(task.status === 'failed') && (
                      <button
                        onClick={() => retryTask(task.id)}
                        className="p-1.5 rounded bg-blue-700 hover:bg-blue-600 text-white"
                        title="重试"
                      >
                        <RefreshCw size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded bg-red-900 hover:bg-red-800 text-red-300"
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};