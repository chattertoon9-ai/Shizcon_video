import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Search,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  Share2,
  MoreVertical,
  Sliders,
} from 'lucide-react';

interface FeedSimulatorModalProps {
  thumbnailDataUrl: string;
  videoTitle: string;
  onClose?: () => void;
}

export const FeedSimulatorModal: React.FC<FeedSimulatorModalProps> = ({
  thumbnailDataUrl,
  videoTitle,
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'search'>('desktop');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  const titleToDisplay = videoTitle.trim() || 'WHAT THE AI FOUND [PART 1] (Do Not Watch Alone)';

  // Mock mystery & horror competitor videos for realistic comparative context
  const competitors = [
    {
      title: 'The Lost Audio Recording of Project 89 [PART 1]',
      channel: 'Dark Archive 3D',
      views: '420K views',
      time: '2 days ago',
      duration: '08:42',
      badge: '4K',
      bgClass: 'from-red-950 to-neutral-950',
    },
    {
      title: 'What Happened Inside Sector 7? (Unexplained AI Mystery)',
      channel: 'Cryptic Signals',
      views: '1.2M views',
      time: '1 week ago',
      duration: '11:15',
      badge: 'CC',
      bgClass: 'from-cyan-950 to-black',
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            YouTube CTR & Feed Simulator
          </h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            Test your 3D thumbnail and title inside real YouTube user feeds (Desktop, Mobile App, and Search) to verify contrast and clickability.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                viewMode === 'desktop'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop Feed
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                viewMode === 'mobile'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile App (Crucial)
            </button>
            <button
              onClick={() => setViewMode('search')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                viewMode === 'search'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Search Results
            </button>
          </div>

          <button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Toggle YouTube Dark / Light mode simulation"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>
        </div>
      </div>

      {/* Simulator Canvas Frame */}
      <div
        className={`rounded-xl border p-4 sm:p-6 transition-colors shadow-2xl ${
          themeMode === 'dark'
            ? 'bg-[#0f0f0f] border-neutral-800 text-white'
            : 'bg-white border-neutral-300 text-neutral-900'
        }`}
      >
        {/* Fake YouTube Search Bar */}
        <div
          className={`flex items-center justify-between pb-4 mb-6 border-b ${
            themeMode === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-4 bg-red-600 rounded-sm flex items-center justify-center text-[10px] text-white font-black">
              ▶
            </span>
            <span
              className={`font-bold tracking-tight text-base ${
                themeMode === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}
            >
              YouTube
            </span>
          </div>

          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border max-w-sm w-full ${
              themeMode === 'dark'
                ? 'bg-[#121212] border-neutral-700 text-neutral-400'
                : 'bg-neutral-100 border-neutral-300 text-neutral-600'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs truncate">3d cinematic short film unreal engine 5</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
              C
            </div>
          </div>
        </div>

        {/* View Mode 1: Desktop Home Grid */}
        {viewMode === 'desktop' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-semibold ${
                  themeMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Desktop Home Feed (How viewers see your 3D video alongside competitors):
              </span>
              <span className="text-xs text-rose-500 font-bold">★ Your Video Highlighted</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Creator's Video (Featured) */}
              <div
                className={`group rounded-xl overflow-hidden border-2 border-rose-500/60 p-2 transition-all ${
                  themeMode === 'dark' ? 'bg-[#181818]' : 'bg-neutral-50 shadow-md'
                }`}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                  <img
                    src={thumbnailDataUrl}
                    alt="Your 3D Thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[11px] font-mono font-bold text-white rounded">
                    04:45
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-3">
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm">
                    3D
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-semibold line-clamp-2 leading-snug ${
                        themeMode === 'dark' ? 'text-white' : 'text-neutral-900'
                      }`}
                    >
                      {titleToDisplay}
                    </h3>
                    <div
                      className={`text-xs mt-1 ${
                        themeMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                      }`}
                    >
                      Mysterious AI · 48K views · 2 hours ago
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-neutral-500" />
                </div>
              </div>

              {/* Competitor Videos */}
              {competitors.map((comp, idx) => (
                <div key={idx} className="group rounded-xl overflow-hidden p-2">
                  <div
                    className={`relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${comp.bgClass} flex items-center justify-center p-4`}
                  >
                    <span className="text-xs font-bold text-white/70 text-center">
                      [Competitor Thumbnail Frame]
                    </span>
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[11px] font-mono font-bold text-white rounded">
                      {comp.duration}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mt-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-700 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {comp.channel.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-semibold line-clamp-2 leading-snug ${
                          themeMode === 'dark' ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {comp.title}
                      </h3>
                      <div
                        className={`text-xs mt-1 ${
                          themeMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                        }`}
                      >
                        {comp.channel} · {comp.views} · {comp.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Mode 2: Mobile Feed (The Most Important for 75%+ YouTube traffic) */}
        {viewMode === 'mobile' && (
          <div className="flex flex-col items-center py-4">
            <div className="text-xs text-neutral-400 mb-4 text-center max-w-md">
              Over 75% of YouTube views happen on mobile devices. If your 3D thumbnail text is readable at this small width, your CTR will thrive!
            </div>

            {/* Simulated Phone Frame */}
            <div
              className={`w-full max-w-sm rounded-[32px] border-4 p-4 shadow-2xl ${
                themeMode === 'dark'
                  ? 'bg-black border-neutral-700 text-white'
                  : 'bg-white border-neutral-400 text-neutral-900'
              }`}
            >
              {/* Phone Speaker notch */}
              <div className="w-24 h-4 bg-neutral-800 rounded-full mx-auto mb-4" />

              {/* Video Card in Mobile Feed */}
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-md">
                  <img
                    src={thumbnailDataUrl}
                    alt="Mobile Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 text-[10px] font-mono font-bold text-white rounded">
                    04:45
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    3D
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-semibold line-clamp-2 leading-tight ${
                        themeMode === 'dark' ? 'text-white' : 'text-neutral-900'
                      }`}
                    >
                      {titleToDisplay}
                    </h3>
                    <div
                      className={`text-[11px] mt-1 ${
                        themeMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                      }`}
                    >
                      Mysterious AI · 48K views · 2 hours ago
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-neutral-500" />
                </div>
              </div>

              {/* Mobile Interaction icons */}
              <div
                className={`flex items-center justify-around mt-4 pt-3 border-t text-xs ${
                  themeMode === 'dark'
                    ? 'border-neutral-800 text-neutral-400'
                    : 'border-neutral-200 text-neutral-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" /> 2.4K
                </div>
                <div className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" /> 4K HDR
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 3: Search Results */}
        {viewMode === 'search' && (
          <div className="space-y-4">
            <span
              className={`text-xs font-semibold ${
                themeMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              Search Results View (Testing ranking visibility & contrast):
            </span>

            {/* Search Result Row */}
            <div
              className={`flex flex-col sm:flex-row gap-4 p-3 rounded-xl border-2 border-rose-500/50 ${
                themeMode === 'dark' ? 'bg-[#181818]' : 'bg-neutral-50'
              }`}
            >
              <div className="relative w-full sm:w-72 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                <img
                  src={thumbnailDataUrl}
                  alt="Search result preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 text-[10px] font-mono font-bold text-white rounded">
                  04:45
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <h3
                  className={`text-base font-semibold leading-snug ${
                    themeMode === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {titleToDisplay}
                </h3>
                <div
                  className={`text-xs ${
                    themeMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  Mysterious AI · 48K views · 2 hours ago
                </div>
                <p
                  className={`text-xs line-clamp-2 leading-relaxed ${
                    themeMode === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  Experience the next frontier of 3D photorealism in Unreal Engine 5.5. Full lighting, volumetric fog, and ACEScg color breakdown rendered in 4K 60FPS.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] px-1.5 py-0.5 bg-rose-600 text-white font-bold rounded">
                    4K
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-neutral-700 text-white font-bold rounded">
                    SPATIAL AUDIO
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
