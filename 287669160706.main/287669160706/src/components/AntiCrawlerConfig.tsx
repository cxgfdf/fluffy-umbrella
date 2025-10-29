import React, { useState } from 'react';
import { Shield, Code, Globe, RotateCw, RefreshCw, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const AntiCrawlerConfig: React.FC = () => {
  // 模拟配置状态
  const [config, setConfig] = useState({
    userAgentRotation: true,
    randomDelay: true,
    proxyEnabled: false,
    bypassCloudflare: true,
    customHeaders: `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Referer: https://www.google.com/`,
    crawlDelay: 2000, // 毫秒
    maxRetries: 3,
    retryDelay: 5000, // 毫秒
  });

  // 保存配置
  const handleSave = () => {
    toast.success('反爬配置已保存');
    // 在实际应用中，这里会将配置保存到服务器或本地存储
  };

  // 重置配置
  const handleReset = () => {
    setConfig({
      userAgentRotation: true,
      randomDelay: true,
      proxyEnabled: false,
      bypassCloudflare: true,
      customHeaders: `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Referer: https://www.google.com/`,
      crawlDelay: 2000,
      maxRetries: 3,
      retryDelay: 5000,
    });
    toast.info('配置已重置为默认值');
  };

  // 切换开关状态
  const toggleSwitch = (field: keyof typeof config) => {
    setConfig(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // 更新数值输入
  const updateNumber = (field: keyof typeof config, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setConfig(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  // 开关组件
  const Switch = ({ id, checked, onChange, label }: { 
    id: string; 
    checked: boolean; 
    onChange: () => void; 
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {id === 'userAgentRotation' && <RotateCw size={18} className="text-blue-400" />}
        {id === 'randomDelay' && <RefreshCw size={18} className="text-purple-400" />}
        {id === 'proxyEnabled' && <Globe size={18} className="text-green-400" />}
        {id === 'bypassCloudflare' && <Shield size={18} className="text-amber-400" />}
        <label htmlFor={id} className="font-medium">{label}</label>
      </div>
      <div 
        className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
          checked ? 'bg-blue-600' : 'bg-slate-600'
        }`}
        onClick={onChange}
      >
        <input 
          type="checkbox" 
          id={id} 
          checked={checked} 
          onChange={onChange} 
          className="sr-only" 
        />
        <div 
          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
            checked ? 'transform translate-x-6' : ''
          }`}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 基础反爬设置 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">基础反爬设置</h3>
          
          <div className="space-y-4 p-4 bg-slate-700/20 rounded-lg">
            <Switch 
              id="userAgentRotation" 
              checked={config.userAgentRotation} 
              onChange={() => toggleSwitch('userAgentRotation')}
              label="随机User-Agent"
            />
            <Switch 
              id="randomDelay" 
              checked={config.randomDelay} 
              onChange={() => toggleSwitch('randomDelay')}
              label="随机访问延迟"
            />
            <Switch 
              id="proxyEnabled" 
              checked={config.proxyEnabled} 
              onChange={() => toggleSwitch('proxyEnabled')}
              label="启用代理IP"
            />
            <Switch 
              id="bypassCloudflare" 
              checked={config.bypassCloudflare} 
              onChange={() => toggleSwitch('bypassCloudflare')}
              label="绕过Cloudflare"
            />
          </div>
        </div>
        
        {/* 高级设置 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">高级设置</h3>
          
          <div className="space-y-4 p-4 bg-slate-700/20 rounded-lg">
            <div className="space-y-2">
              <label htmlFor="crawlDelay" className="block text-sm font-medium text-slate-300">
                爬取间隔 (毫秒)
              </label>
              <input
                type="number"
                id="crawlDelay"
                value={config.crawlDelay}
                onChange={(e) => updateNumber('crawlDelay', e.target.value)}
                min="500"
                max="10000"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="maxRetries" className="block text-sm font-medium text-slate-300">
                最大重试次数
              </label>
              <input
                type="number"
                id="maxRetries"
                value={config.maxRetries}
                onChange={(e) => updateNumber('maxRetries', e.target.value)}
                min="1"
                max="10"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="retryDelay" className="block text-sm font-medium text-slate-300">
                重试间隔 (毫秒)
              </label>
              <input
                type="number"
                id="retryDelay"
                value={config.retryDelay}
                onChange={(e) => updateNumber('retryDelay', e.target.value)}
                min="1000"
                max="30000"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 自定义请求头 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Code size={18} className="text-blue-400" />
          <h3 className="text-lg font-semibold">自定义请求头</h3>
        </div>
        
        <div className="p-4 bg-slate-700/20 rounded-lg">
          <textarea
            value={config.customHeaders}
            onChange={(e) => setConfig(prev => ({ ...prev, customHeaders: e.target.value }))}
            rows={6}
            className="w-full font-mono text-sm resize-y"
            placeholder="User-Agent: ...&#10;Accept: ...&#10;Referer: ..."
          ></textarea>
          <p className="text-xs text-slate-400 mt-2">每行一个请求头，格式为"名称: 值"</p>
        </div>
      </div>
      
      {/* 配置提示 */}
      <div className="bg-blue-900/20 border border-blue-700/30 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Shield size={20} className="text-blue-400 mt-0.5" />
          <div>
            <div className="font-medium text-blue-300">配置建议</div>
            <ul className="text-sm text-blue-100/80 mt-2 space-y-1 list-disc list-inside">
              <li>对于初级反爬网站，仅启用"随机User-Agent"和"随机访问延迟"即可</li>
              <li>对于中级反爬网站，建议启用所有基础反爬设置</li>
              <li>对于高级反爬网站，可能需要配置代理IP和自定义请求头</li>
              <li>增加爬取间隔可以降低被封IP的风险，但会减慢爬取速度</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Check size={18} />
          保存配置
        </button>
        
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
        >
          重置
        </button>
      </div>
    </div>
  );
};