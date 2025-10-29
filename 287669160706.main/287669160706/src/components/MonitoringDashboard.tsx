import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { 
  Activity, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Server, 
  Shield,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonitoringDashboardProps {
  successRateData: Array<{ name: string; value: number; color: string }>;
  speedData: Array<{ name: string; speed: number }>;
  activeTasks: number;
}

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
  successRateData,
  speedData,
  activeTasks
}) => {
  // 模拟系统状态
  const systemStats = [
    { label: '系统状态', value: '正常', icon: <CheckCircle size={18} />, color: 'text-green-500' },
    { label: '活跃任务', value: activeTasks, icon: <Activity size={18} />, color: 'text-blue-500' },
    { label: '平均成功率', value: '85%', icon: <CheckCircle size={18} />, color: 'text-green-500' },
    { label: '响应时间', value: '320ms', icon: <Clock size={18} />, color: 'text-amber-500' },
    { label: '服务器负载', value: '42%', icon: <Server size={18} />, color: 'text-blue-500' },
    { label: '反爬成功率', value: '92%', icon: <Shield size={18} />, color: 'text-green-500' }
  ];

  // 模拟告警信息
  const alerts = [
    { id: 1, level: 'warning', message: '爬虫成功率低于阈值 (78%)', time: '12:15' },
    { id: 2, level: 'info', message: '系统完成例行维护', time: '10:30' },
    { id: 3, level: 'success', message: '反爬策略更新成功', time: '09:45' },
  ];

  // 获取告警级别对应的样式
  const getAlertLevelStyles = (level: string) => {
    switch (level) {
      case 'success':
        return 'bg-green-900/30 border-green-700 text-green-300';
      case 'warning':
        return 'bg-amber-900/30 border-amber-700 text-amber-300';
      case 'error':
        return 'bg-red-900/30 border-red-700 text-red-300';
      default:
        return 'bg-blue-900/30 border-blue-700 text-blue-300';
    }
  };

  // 获取告警图标
  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      case 'error':
        return <AlertCircle size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* 系统状态卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemStats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-slate-700 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-sm text-slate-400">{stat.label}</div>
                <div className="text-2xl font-bold mt-1">{stat.value}</div>
              </div>
              <div className="ml-auto text-slate-400">
                {index % 2 === 0 ? <ChevronUp size={18} className="text-green-500" /> : <ChevronDown size={18} className="text-red-500" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 图表和监控数据 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 成功率饼图 */}
        <div className="card col-span-1">
          <h3 className="text-lg font-semibold mb-4">爬虫成功率</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={successRateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {successRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-slate-400 mt-2">
            过去24小时的爬虫任务成功率
          </div>
        </div>

        {/* 下载速度图表 */}
        <div className="card col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">下载速度趋势 (MB/s)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={speedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#f1f5f9'
                  }} 
                />
                <Bar dataKey="speed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-slate-400 mt-2">
            今日下载速度实时监控
          </div>
        </div>
      </div>

      {/* 告警和日志 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最近告警 */}
        <div className="card col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-500" />
            最近告警
          </h3>
          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border ${getAlertLevelStyles(alert.level)} flex items-start gap-3`}
                >
                  <div className="mt-0.5">{getAlertIcon(alert.level)}</div>
                  <div className="flex-1">
                    <div className="font-medium">{alert.message}</div>
                    <div className="text-xs opacity-70 mt-1">{alert.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400">
                暂无告警信息
              </div>
            )}
          </div>
        </div>

        {/* 系统建议 */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap size={18} className="text-amber-500" />
            系统建议
          </h3>
          <div className="space-y-4">
            <div className="bg-blue-900/30 p-3 rounded-lg text-sm">
              <p className="font-medium text-blue-300">优化建议</p>
              <p className="mt-1 text-blue-100/80">增加代理IP池以提高高并发场景下的稳定性</p>
            </div>
            <div className="bg-green-900/30 p-3 rounded-lg text-sm">
              <p className="font-medium text-green-300">最佳实践</p>
              <p className="mt-1 text-green-100/80">对于Cloudflare保护的网站，建议使用浏览器自动化模式</p>
            </div>
            <div className="bg-purple-900/30 p-3 rounded-lg text-sm">
              <p className="font-medium text-purple-300">性能提示</p><p className="mt-1 text-purple-100/80">当前系统负载适中，可以增加3-5个并发任务</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};