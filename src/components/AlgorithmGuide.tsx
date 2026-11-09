import React, { useState } from 'react';
import {
  Compass,
  Cpu,
  Tv,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Play,
  Volume2,
  Headphones,
} from 'lucide-react';

export const AlgorithmGuide: React.FC = () => {
  // Calculator state
  const [selectedRegion, setSelectedRegion] = useState<'india' | 'us' | 'global'>('india');
  const [selectedDay, setSelectedDay] = useState<string>('Friday');

  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    item1: true,
    item2: true,
    item3: false,
    item4: false,
    item5: false,
    item6: false,
    item7: false,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getBestTime = () => {
    if (selectedRegion === 'india') {
      if (selectedDay === 'Saturday' || selectedDay === 'Sunday') {
        return {
          window: '1:30 PM - 4:00 PM IST',
          reason: 'Weekend viewers consume long-form 3D cinematic videos in afternoon leisure hours.',
        };
      }
      return {
        window: '6:30 PM - 9:00 PM IST',
        reason: 'Peak evening transit and post-dinner entertainment spike across Indian cities.',
      };
    } else if (selectedRegion === 'us') {
      if (selectedDay === 'Saturday' || selectedDay === 'Sunday') {
        return {
          window: '9:00 AM - 12:00 PM EST (6:00 AM - 9:00 AM PST)',
          reason: 'US weekend morning browsing peaks before midday activities.',
        };
      }
      return {
        window: '2:00 PM - 5:00 PM EST (11:00 AM - 2:00 PM PST)',
        reason: 'Captures US East coast after-school/work and West coast lunch break simultaneously.',
      };
    } else {
      return {
        window: '4:00 PM - 7:00 PM UTC',
        reason: 'The golden global overlap between European evening and North American morning/afternoon.',
      };
    }
  };

  const bestTimeInfo = getBestTime();

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          3D Cinematic Video Upload & YouTube Algorithm Blueprint
        </h1>
        <p className="text-sm text-neutral-400 mt-0.5">
          Everything you need to bypass YouTube compression, unlock high-bitrate codecs (VP09/AV01), and optimize your launch velocity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Technical Codec Secret & Bitrate Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: The VP09 Codec Hack */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-rose-950/80 border border-rose-600/40 flex items-center justify-center text-rose-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  The 3D Creator Codec Secret: VP09 / AV01 vs AVC1
                </h2>
                <p className="text-xs text-neutral-400">
                  Why your cinematic dark scenes, volumetrics, and smoke look pixelated on YouTube
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-950 rounded-md border border-neutral-800 text-xs text-neutral-300 space-y-2.5 leading-relaxed">
              <p>
                When you upload a standard <strong className="text-white">1080p</strong> video to YouTube, channels with under ~100k subscribers are automatically encoded using YouTube’s legacy <span className="text-rose-400 font-mono">avc1 (H.264)</span> encoder. This allocates a low bitrate (~4–8 Mbps), which completely destroys dark blacks, fog, and film grain in 3D cinematic scenes with severe color banding.
              </p>
              <div className="p-3 bg-neutral-900 border border-emerald-500/30 rounded-md text-emerald-300 text-xs">
                <strong className="text-white flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  The 1440p / 4K Upscale Hack:
                </strong>
                Even if your Unreal Engine or Blender project is finished in 1080p, <strong className="text-white">always export or upscale to 2560×1440 (2K) or 3840×2160 (4K)</strong> before uploading. YouTube is mathematically forced to assign its top-tier <span className="text-cyan-300 font-mono">vp09</span> or <span className="text-emerald-300 font-mono">av01</span> codecs! This grants up to <strong className="text-white">24 Mbps</strong> bitrate even when a user watches in 1080p!
              </div>
              <p className="text-[11px] text-neutral-400">
                How to verify on your live video: Right-click any YouTube video → select <strong>"Stats for Nerds"</strong> → look at the <strong>Codecs</strong> row. If it says <code className="text-cyan-300">vp09</code> or <code className="text-emerald-300">av01</code>, your upload is in maximum fidelity.
              </p>
            </div>
          </div>

          {/* Section 2: Master Render & Export Presets */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-cyan-400" />
              Master 3D Export Settings (DaVinci / Premiere / Blender)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-neutral-800">
                <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Parameter</th>
                    <th className="py-2.5 px-3 font-semibold">Cinematic 24FPS (Short Film)</th>
                    <th className="py-2.5 px-3 font-semibold">Action 60FPS (Hyper-Fluid)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-200 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 px-3 text-neutral-400 font-sans">Resolution</td>
                    <td className="py-2 px-3 text-white">3840 × 2160 (4K UHD)</td>
                    <td className="py-2 px-3 text-white">3840 × 2160 (4K UHD)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-neutral-400 font-sans">Codec / Container</td>
                    <td className="py-2 px-3 text-cyan-400">ProRes 422 HQ / MP4 (H.265/HEVC)</td>
                    <td className="py-2 px-3 text-cyan-400">MP4 (H.265/HEVC) 10-Bit</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-neutral-400 font-sans">Bitrate Target</td>
                    <td className="py-2 px-3 text-emerald-400">68 - 80 Mbps VBR 2-Pass</td>
                    <td className="py-2 px-3 text-emerald-400">85 - 100 Mbps VBR 2-Pass</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-neutral-400 font-sans">Color Space</td>
                    <td className="py-2 px-3">Rec.709 Gamma 2.4 (or HDR10/PQ)</td>
                    <td className="py-2 px-3">Rec.709 Gamma 2.4</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-neutral-400 font-sans">Audio Format</td>
                    <td className="py-2 px-3">AAC 384 kbps / 48kHz Stereo</td>
                    <td className="py-2 px-3">AAC 384 kbps / 48kHz Stereo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: 3D Spatial Audio & VR Metadata */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-400" />
              3D Spatial Audio & VR 360 / Stereoscopic Metadata
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  Ambisonics 3D Audio
                </span>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  YouTube natively supports First-Order Ambisonics (B-format 4-channel ACN/SN3D). Use Reaper or Premiere Pro to render 4-channel spatial audio for realistic head-tracking audio in headphones.
                </p>
              </div>

              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-amber-400" />
                  Spatial VR Metadata Injector
                </span>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  For 3D Side-by-Side (SBS) or VR180/360 renders, inject Google’s official Spatial Media Metadata Injector python tool before uploading so YouTube displays the 3D VR headset goggles icon.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upload Timing Calculator & Launch Velocity Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 4: Best Upload Timing Calculator */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Upload Timing & Peak Velocity Calculator
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Target Geographic Region:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'india', label: 'India (IST)' },
                    { id: 'us', label: 'USA (EST/PST)' },
                    { id: 'global', label: 'Global' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRegion(r.id as any)}
                      className={`py-1.5 rounded border text-center transition-colors ${
                        selectedRegion === r.id
                          ? 'bg-emerald-950/60 border-emerald-500 text-white font-semibold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Upload Day:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDay(d)}
                      className={`py-1 rounded border text-center text-[11px] transition-colors ${
                        selectedDay === d
                          ? 'bg-emerald-950/60 border-emerald-500 text-white font-semibold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-md border border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-500 font-medium">Recommended Launch Window:</div>
                <div className="text-sm font-bold font-mono text-emerald-400">
                  {bestTimeInfo.window}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                  {bestTimeInfo.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Pre-Flight Launch Checklist */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              Pre-Flight YouTube Launch Checklist
            </h2>

            <div className="space-y-2 text-xs">
              {[
                {
                  id: 'item1',
                  title: 'Upload as Unlisted first (The 4K Processing Wait)',
                  desc: 'Never publish immediately as Public. Keep unlisted for 2-3 hours until YouTube says "HD and 4K processing complete", otherwise initial viewers will get blurry 360p and bounce!',
                },
                {
                  id: 'item2',
                  title: 'Test Thumbnail at 10% Mobile Scale',
                  desc: 'Ensure the 3D text and primary focal subject are instantly legible on a small 5-inch phone screen.',
                },
                {
                  id: 'item3',
                  title: 'Include Chapter Timestamps (00:00 start)',
                  desc: 'Must include 00:00 as the first timestamp to unlock Google Search key-moment video carousels.',
                },
                {
                  id: 'item4',
                  title: 'Pin First Comment with Engagement Hook',
                  desc: 'Ask: "Which frame was your favorite: 01:20 or 02:45?" Comments in the first 60 minutes boost velocity.',
                },
                {
                  id: 'item5',
                  title: 'Add to Series / Niche Playlist',
                  desc: 'Grouping with your other 3D videos forces YouTube to auto-recommend your own videos in the "Up Next" rail.',
                },
                {
                  id: 'item6',
                  title: 'Post Community Tab Teaser 24h Before',
                  desc: 'Share a behind-the-scenes 3D viewport wireframe screenshot to build anticipation.',
                },
              ].map((chk) => (
                <div
                  key={chk.id}
                  onClick={() => toggleCheck(chk.id)}
                  className={`p-2.5 rounded-md border cursor-pointer transition-colors ${
                    checkedItems[chk.id]
                      ? 'bg-neutral-950/80 border-emerald-500/40'
                      : 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={!!checkedItems[chk.id]}
                      onChange={() => toggleCheck(chk.id)}
                      className="mt-0.5 accent-emerald-500 w-3.5 h-3.5 rounded cursor-pointer"
                    />
                    <div>
                      <span
                        className={`font-semibold text-xs ${
                          checkedItems[chk.id] ? 'text-white' : 'text-neutral-300'
                        }`}
                      >
                        {chk.title}
                      </span>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                        {chk.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
