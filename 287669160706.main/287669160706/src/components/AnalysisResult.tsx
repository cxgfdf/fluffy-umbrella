import React, { useState } from 'react';
import { Link as LinkIcon, AlertTriangle, Check, ChevronDown, ChevronUp, Film, Download, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface AntiCrawlerMeasure {
  level: string;
  measures: string[];
  bypassable: boolean;
}

interface FoundLink {
  url: string;
  type: string;
  quality: string;
  size: string;
}

interface AnalysisResultProps {
  result: {
    url: string;
    domain: string;
    title: string;
    contentType: string;
    foundLinks: FoundLink[];
    antiCrawlerMeasures: AntiCrawlerMeasure[];
    recommendedStrategy: string;
    robotsTxt: { allowed: boolean; crawlDelay: number };
    legalStatus: string;
  };
  onCreateTask: (taskData: { url: string; title: string; quality: string }) => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onCreateTask }) => {
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    links: true,
    antiCrawler: false,
    legal: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDownload = (link: FoundLink) => {
    onCreateTask({
      url: result.url,
      title: result.title,
      quality: link.quality
    });
    toast.success(`已创建 "${result.title}" - ${link.quality} 的下载任务`);
  };

  return (
    <div className="space-y-6">
      {/* 分析结果概览 */}
      <div className="card">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('details')}
        >
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Film className="text-blue-500" />
            分析结果概览
          </h3>
          {expandedSections.details ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.details && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="text-sm text-slate-400">目标URL</div>
                <div className="font-medium mt-1 break-all">{result.url}</div>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="text-sm text-slate-400">网站域名</div>
                <div className="font-medium mt-1">{result.domain}</div>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="text-sm text-slate-400">视频标题</div>
                <div className="font-medium mt-1">{result.title}</div>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="text-sm text-slate-400">内容类型</div>
                <div className="font-medium mt-1">{result.contentType}</div>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="text-sm text-slate-400">推荐策略</div>
                <div className="font-medium mt-1">{result.recommendedStrategy}</div>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="text-sm text-slate-400">发现资源数</div>
                <div className="font-medium mt-1 flex items-center gap-1">
                  {result.foundLinks.length}
                  <LinkIcon size={16} className="text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 发现的链接 */}
      <div className="card">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('links')}
        >
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <LinkIcon className="text-blue-500" />
            发现的视频资源
          </h3>
          {expandedSections.links ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.links && (
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">质量</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">类型</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">大小</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {result.foundLinks.map((link, index) => (
                    <tr key={index} className="border-b border-slate-800 hover:bg-slate-700/20 transition-colors">
                      <td className="py-3 px-4 font-medium">{link.quality}</td>
                      <td className="py-3 px-4">{link.type.toUpperCase()}</td>
                      <td className="py-3 px-4">{link.size}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDownload(link)}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-lg text-sm flex items-center gap-1.5 transition-colors"
                        >
                          <Download size={14} />
                          下载
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 反爬机制分析 */}
      <div className="card">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('antiCrawler')}
        >
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Lock className="text-blue-500" />
            反爬机制分析
          </h3>
          {expandedSections.antiCrawler ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.antiCrawler && (
          <div className="mt-6 space-y-4">
            {result.antiCrawlerMeasures.map((measure, index) => (
              <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{measure.level}反爬</div>
                  <div className={`flex items-center gap-1 ${measure.bypassable ? 'text-green-400' : 'text-red-400'}`}>
                    {measure.bypassable ? (
                      <>
                        <Check size={16} />
                        <span>可绕过</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={16} />
                        <span>难以绕过</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {measure.measures.map((m, i) => (
                    <span key={i} className="bg-slate-600 text-slate-200 text-xs px-2 py-1 rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 法律合规检查 */}
      <div className="card">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('legal')}
        >
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Check className="text-blue-500" />
            法律合规检查
          </h3>
          {expandedSections.legal ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.legal && (
          <div className="mt-6 space-y-4">
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-sm text-slate-400">robots.txt</div>
              <div className="font-medium mt-1 flex items-center gap-1.5">
                {result.robotsTxt.allowed ? (
                  <>
                    <Check size={16} className="text-green-400" />
                    <span>允许爬取</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={16} className="text-red-400" />
                    <span>禁止爬取</span>
                  </>
                )}
              </div>
              {result.robotsTxt.crawlDelay && (
                <div className="text-sm text-slate-400 mt-1">建议爬取间隔: {result.robotsTxt.crawlDelay}秒</div>
              )}
            </div>
            
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-sm text-slate-400">合规状态</div>
              <div className="font-medium mt-1">{result.legalStatus}</div>
            </div>
            
            <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle size={20} className="text-amber-400 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-300">法律提示</div>
                  <p className="text-sm text-amber-100/80 mt-1">
                    请确保遵守相关法律法规，尊重版权。本工具仅用于学习和研究目的，请勿用于非法用途。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};