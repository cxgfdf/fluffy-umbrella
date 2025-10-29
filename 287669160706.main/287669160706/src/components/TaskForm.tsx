import React, { useState } from 'react';
import { Lock, Shield, Code, Zap, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  onSubmit: (data: { url: string; title?: string; quality?: string }) => void;
  isLoading: boolean;
  buttonText: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isLoading, buttonText }) => {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    quality: '1080p'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.url.trim()) {
      toast.error('请输入有效的URL');
      return;
    }
    
    // 简单的URL验证
    try {
      new URL(formData.url);
    } catch (e) {
      toast.error('请输入有效的URL格式');
      return;
    }
    
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-slate-300">
            电影页面URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="https://example.com/movie/123"
            required
            className="w-full"
          />
          <p className="text-xs text-slate-400">支持主流视频网站URL分析</p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-slate-300">
            自定义标题
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="输入电影标题（可选）"
            className="w-full"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="quality" className="block text-sm font-medium text-slate-300">
          视频质量
        </label>
        <select
          id="quality"
          name="quality"
          value={formData.quality}
          onChange={handleInputChange}
          className="w-full"
        >
          <option value="4K">4K (超高清)</option>
          <option value="1080p">1080p (全高清)</option>
          <option value="720p">720p (高清)</option>
          <option value="480p">480p (标清)</option>
          <option value="360p">360p (流畅)</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
          <Shield size={18} className="text-blue-400" />
          <span className="text-sm">智能反爬</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
          <Code size={18} className="text-purple-400" />
          <span className="text-sm">多格式支持</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
          <Zap size={18} className="text-amber-400" />
          <span className="text-sm">高速下载</span>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 flex items-center justify-center gap-2',
          isLoading && 'opacity-70 cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            处理中...
          </>
        ) : (
          <>
            {buttonText}
            <ChevronRight size={18} />
          </>
        )}
      </button>
    </form>
  );
};

