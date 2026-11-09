import React from 'react';
import { TabType } from '../types';
import { Sparkles, Video, Compass, MonitorPlay } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onQuickExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onQuickExport,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-neutral-800 bg-neutral-950/95 sticky top-0 z-50 backdrop-blur-md">
      {/* Zone 1: Brand title wordmark, single element, no nested pills */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('thumbnail');
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-rose-400 transition-colors flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 rotate-45 inline-block shadow-sm shadow-rose-500/50" />
          Mysterious AI Studio
        </a>
      </div>

      {/* Zone 2: 4-5 single-line clean navigation links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
        <button
          onClick={() => setActiveTab('thumbnail')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'thumbnail'
              ? 'text-white border-rose-500 font-semibold'
              : 'border-transparent text-neutral-400'
          }`}
        >
          <Sparkles className="w-4 h-4 text-rose-400" />
          3D Thumbnail Maker
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'seo'
              ? 'text-white border-rose-500 font-semibold'
              : 'border-transparent text-neutral-400'
          }`}
        >
          <Video className="w-4 h-4 text-cyan-400" />
          Story Hooks & SEO
        </button>

        <button
          onClick={() => setActiveTab('algorithm')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'algorithm'
              ? 'text-white border-rose-500 font-semibold'
              : 'border-transparent text-neutral-400'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-400" />
          Upload & Algorithm Guide
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'simulator'
              ? 'text-white border-rose-500 font-semibold'
              : 'border-transparent text-neutral-400'
          }`}
        >
          <MonitorPlay className="w-4 h-4 text-emerald-400" />
          CTR Feed Simulator
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onQuickExport}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-md hover:bg-rose-500 active:scale-95 transition-all shadow-sm shadow-rose-950 whitespace-nowrap shrink-0"
        >
          Export 4K Thumbnail
        </button>
      </div>
    </header>
  );
};
