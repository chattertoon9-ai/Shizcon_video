import React, { useState } from 'react';
import { TabType } from './types';
import { Navbar } from './components/Navbar';
import { ThumbnailStudio } from './components/ThumbnailStudio';
import { SeoCommandCenter } from './components/SeoCommandCenter';
import { AlgorithmGuide } from './components/AlgorithmGuide';
import { FeedSimulatorModal } from './components/FeedSimulatorModal';
import { Sparkles, Video, Compass, MonitorPlay, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('thumbnail');
  const [quickExportCount, setQuickExportCount] = useState<number>(0);

  // Cross-tool data sync: thumbnail preview and title
  const [simulatorThumbnail, setSimulatorThumbnail] = useState<string>(
    '/src/assets/images/bg_mystery_ai_terminal_1794149580443.jpg'
  );
  const [activeTitle, setActiveTitle] = useState<string>(
    'WHAT THE AI FOUND [PART 1] (Do Not Watch Alone)'
  );

  const handleApplyTitleToThumbnail = (title: string) => {
    setActiveTitle(title);
    setActiveTab('thumbnail');
  };

  const handleSendToSimulator = (thumbnailDataUrl: string, titleText: string) => {
    setSimulatorThumbnail(thumbnailDataUrl);
    setActiveTitle(titleText);
    setActiveTab('simulator');
  };

  const handleQuickExport = () => {
    setActiveTab('thumbnail');
    setQuickExportCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Bar adhering to §2 Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickExport={handleQuickExport}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'thumbnail' && (
          <ThumbnailStudio
            onSendToSimulator={handleSendToSimulator}
            quickExportTrigger={quickExportCount}
          />
        )}

        {activeTab === 'seo' && (
          <SeoCommandCenter
            onApplyTitleToThumbnail={handleApplyTitleToThumbnail}
          />
        )}

        {activeTab === 'algorithm' && <AlgorithmGuide />}

        {activeTab === 'simulator' && (
          <FeedSimulatorModal
            thumbnailDataUrl={simulatorThumbnail}
            videoTitle={activeTitle}
          />
        )}
      </main>

      {/* Editorial Footer (Strictly unboxed text, no telemetry, no pill clusters) */}
      <footer className="border-t border-neutral-900 bg-neutral-950 px-6 py-6 mt-12 text-xs text-neutral-500">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-300">Mysterious AI Studio</span>
            <span aria-hidden="true">·</span>
            <span>Episodic Hook Story & 3D Thumbnail Engine</span>
            <span aria-hidden="true">·</span>
            <span>4K VP09 & AV01 Pipeline</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <button
              onClick={() => setActiveTab('thumbnail')}
              className="hover:text-white transition-colors"
            >
              Thumbnail Software
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('seo')}
              className="hover:text-white transition-colors"
            >
              SEO Generator
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('algorithm')}
              className="hover:text-white transition-colors"
            >
              Codec Upload Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
