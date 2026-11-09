import React, { useState, useEffect } from 'react';
import {
  SeoGeneratedData,
  AuditResult,
  StoryHookItem,
  StoryHookResponse,
} from '../types';
import { TrendingHashtagsExplorer } from './TrendingHashtagsExplorer';
import {
  Sparkles,
  Copy,
  Check,
  Flame,
  Clock,
  Hash,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Radio,
  Mic,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ShieldAlert,
  BookOpen,
  Terminal,
  Layers,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface SeoCommandCenterProps {
  onApplyTitleToThumbnail: (title: string) => void;
}

export const SeoCommandCenter: React.FC<SeoCommandCenterProps> = ({
  onApplyTitleToThumbnail,
}) => {
  // Main view toggle: 'hook_generator', 'hashtag_explorer', or 'seo_suite'
  const [activeMode, setActiveMode] = useState<'hook_generator' | 'hashtag_explorer' | 'seo_suite'>('hook_generator');

  // Common channel and episode settings
  const [channelName, setChannelName] = useState<string>('Mysterious AI');
  const [partNumber, setPartNumber] = useState<string>('Part 1');
  const [concept, setConcept] = useState<string>(
    'An abandoned deep bunker AI terminal awakens at 3:00 AM and starts transmitting emergency coordinates'
  );
  const [genre, setGenre] = useState<string>('Mysterious AI Hook Story');
  const [toolSoftware, setToolSoftware] = useState<string>('Unreal Engine 5.5 / Blender 3D / AI Voices');
  const [language, setLanguage] = useState<string>('Hinglish');
  const [targetAudience, setTargetAudience] = useState<string>('Mystery, Creepypasta & Thriller Fans');

  // Story Hook Generator specific state
  const [hookStyle, setHookStyle] = useState<string>('Audio Intercept & Found Footage');
  const [hookPace, setHookPace] = useState<string>('Chilling Low Whisper (120 WPM)');
  const [isGeneratingHooks, setIsGeneratingHooks] = useState<boolean>(false);
  const [hookError, setHookError] = useState<string | null>(null);
  const [storyHooks, setStoryHooks] = useState<StoryHookItem[] | null>(null);

  // Rehearsal / Teleprompter state
  const [activeRehearsalId, setActiveRehearsalId] = useState<string | null>(null);
  const [rehearsalProgress, setRehearsalProgress] = useState<number>(0);
  const [isRehearsalRunning, setIsRehearsalRunning] = useState<boolean>(false);

  // Full SEO suite state
  const [isLoadingSeo, setIsLoadingSeo] = useState<boolean>(false);
  const [seoError, setSeoError] = useState<string | null>(null);
  const [seoResult, setSeoResult] = useState<SeoGeneratedData | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  // Copy indicator state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy helper
  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(identifier);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Preset mystery story hooks for quick inspiration
  const mysteryPremisePresets = [
    'An abandoned Himalayan bunker AI terminal awakens at 3:00 AM and reveals deep earth coordinates',
    'A sub-oceanic research station AI begins imitating the missing lead scientist’s voice on radio',
    'A classified military satellite detects an unmapped 3D monolith pulsing a human heartbeat frequency',
    'Investigators discover an encrypted 1989 audio cassette inside an automated server cluster',
  ];

  // 1. Generate 3-4 Sentence Story Hooks
  const handleGenerateStoryHooks = async () => {
    if (!concept.trim()) {
      setHookError('Please enter a mystery story concept or premise.');
      return;
    }

    setIsGeneratingHooks(true);
    setHookError(null);
    stopRehearsal();

    try {
      const res = await fetch('/api/seo/generate-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept,
          partNumber,
          hookStyle,
          language,
          channelName,
          pace: hookPace,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to generate story hooks.');
      }

      setStoryHooks(json.data.hooks || []);
    } catch (err: any) {
      setHookError(err.message || 'Story hook generation failed. Please try again.');
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  // Rehearsal timer effect
  useEffect(() => {
    let interval: any = null;
    if (isRehearsalRunning && activeRehearsalId && storyHooks) {
      const targetHook = storyHooks.find((h) => h.id === activeRehearsalId);
      const totalSeconds = targetHook ? targetHook.estimatedSeconds : 18;
      const stepMs = 100;
      const totalSteps = (totalSeconds * 1000) / stepMs;

      interval = setInterval(() => {
        setRehearsalProgress((prev) => {
          if (prev >= 100) {
            setIsRehearsalRunning(false);
            return 100;
          }
          return prev + 100 / totalSteps;
        });
      }, stepMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRehearsalRunning, activeRehearsalId, storyHooks]);

  const startRehearsal = (hookId: string) => {
    if (activeRehearsalId === hookId && isRehearsalRunning) {
      setIsRehearsalRunning(false);
    } else {
      setActiveRehearsalId(hookId);
      setRehearsalProgress(0);
      setIsRehearsalRunning(true);
    }
  };

  const stopRehearsal = () => {
    setIsRehearsalRunning(false);
    setActiveRehearsalId(null);
    setRehearsalProgress(0);
  };

  // 2. Generate Full SEO Suite
  const handleGenerateSeo = async () => {
    if (!concept.trim()) {
      setSeoError('Please enter a story concept or hook premise.');
      return;
    }

    setIsLoadingSeo(true);
    setSeoError(null);

    try {
      const res = await fetch('/api/seo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelName,
          partNumber,
          concept,
          genre,
          toolSoftware,
          language,
          targetAudience,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to generate metadata.');
      }

      setSeoResult(json.data);

      // Audit the best title and description
      const auditRes = await fetch('/api/seo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: json.data.bestTitle,
          description: json.data.description,
          tags: json.data.tags,
        }),
      });
      const auditData = await auditRes.json();
      setAuditResult(auditData);
    } catch (err: any) {
      setSeoError(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsLoadingSeo(false);
    }
  };

  // 3. Apply hashtags and search tags from Trending Hashtag Explorer into active SEO state
  const handleApplyTagsToMetadata = (hashtagsString: string, tagsArray: string[]) => {
    setSeoResult((prev) => {
      if (!prev) {
        return {
          titles: [
            `${concept} [${partNumber}] - Do Not Watch Alone (Mysterious AI)`,
            `Raat 3 Baje AI Anomaly: ${concept} [${partNumber}]`,
            `The Lost Bunker Coordinates: ${concept} [${partNumber}]`,
            `What Happened at Terminal 89? [${partNumber}] (True Mystery)`,
            `THE IMPOSSIBLE REVELATION [${partNumber}] | Mysterious AI`,
          ],
          bestTitle: `${concept} [${partNumber}] - Do Not Watch Alone (Mysterious AI)`,
          hookScript: `If you believe AI is just predictable code, what our team discovered locked inside the bunker terminal was never meant to be heard...`,
          cliffhangerScript: `And right as the terminal decrypted the final coordinate, the chamber doors sealed from the outside. The story continues in the next part...`,
          nextPartTeaser: `In the next episode, the encrypted audio signal reveals a human voice calling for help from beneath the concrete floor.`,
          description: `⚠️ WARNING: Wear headphones for 3D Binaural Spatial Audio. Do not listen in a dark room alone.\n\nWelcome to ${partNumber} of "${concept}" — an episodic mystery thriller exclusively on Mysterious AI.\n\n🔥 TRENDING SEARCH TAGS & HASHTAGS:\n${hashtagsString}\n\n#MysteriousAI #${partNumber.replace(/[^a-zA-Z0-9]/g, '')}`,
          tags: Array.from(new Set(['mysterious ai', 'mystery story in hindi', 'creepypasta hindi', ...tagsArray])),
          tagsString: Array.from(new Set(['mysterious ai', 'mystery story in hindi', 'creepypasta hindi', ...tagsArray])).join(', '),
          hashtags: hashtagsString.split(' ').filter(Boolean),
          thumbnailIdeas: [
            `Extreme contrast: Shadowy hooded figure with glowing red AI terminal eyes and a bold [${partNumber}] badge.`,
            `Glowing cyan monolith hovering in dark foggy pine forest with the text "DO NOT ENTER".`,
          ],
          algorithmTips: [
            'Using trending mystery tags boosts suggested video clustering next to large viral channels.',
            'Keep video unlisted for 2-3 hours to allow YouTube 4K VP09/AV01 processing to finish.',
          ],
          partNumber,
        };
      }

      const mergedTags = Array.from(new Set([...prev.tags, ...tagsArray]));
      const appendedDesc = prev.description.includes(hashtagsString)
        ? prev.description
        : `${prev.description}\n\n🔥 TRENDING HASHTAGS:\n${hashtagsString}`;

      return {
        ...prev,
        description: appendedDesc,
        tags: mergedTags,
        tagsString: mergedTags.join(', '),
        hashtags: Array.from(new Set([...prev.hashtags, ...hashtagsString.split(' ').filter(Boolean)])),
      };
    });
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-6 py-6">
      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-rose-500" />
            Mysterious AI — SEO & Episodic Story Command Center
          </h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            AI-driven 3-4 sentence hook scripts engineered for high YouTube retention, episodic cliffhangers, and algorithmic SEO.
          </p>
        </div>

        {/* Feature Mode Switcher (Clean segmented buttons, zero pills) */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveMode('hook_generator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeMode === 'hook_generator'
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-200" />
            Story Hook Generator
          </button>

          <button
            onClick={() => setActiveMode('hashtag_explorer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeMode === 'hashtag_explorer'
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Hash className="w-3.5 h-3.5 text-rose-300" />
            Trending Hashtag Explorer
          </button>

          <button
            onClick={() => setActiveMode('seo_suite')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeMode === 'seo_suite'
                ? 'bg-neutral-800 text-white shadow-sm font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            Titles & Description Suite
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODE 1: AI 3-4 SENTENCE STORY HOOK GENERATOR (EPISODIC MYSTERY)
         ========================================================================= */}
      {activeMode === 'hook_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Hook Settings Form (4 cols) */}
          <div className="lg:col-span-4 bg-neutral-900/90 border border-neutral-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-rose-500" />
                Hook Generator Configuration
              </h2>
              <span className="text-[11px] text-neutral-500 font-mono">0-15s Retention</span>
            </div>

            {/* Channel Branding Lock */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Channel Name:
              </label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-white font-semibold focus:outline-none focus:border-rose-500"
                placeholder="e.g. Mysterious AI"
              />
            </div>

            {/* Episodic Story Part */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">
                  Episode Part Number:
                </label>
                <span className="text-[11px] text-rose-400 font-mono">{partNumber}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Final Part', 'Cliffhanger'].map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setPartNumber(pt)}
                    className={`py-1.5 rounded text-center text-[11px] font-bold border transition-colors ${
                      partNumber === pt
                        ? 'bg-rose-950/70 border-rose-500 text-rose-300 shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {pt}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                Part 1 focuses on cold open & premise; Part 2+ references previous cliffhangers.
              </p>
            </div>

            {/* Mystery Story Premise */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Mystery Story Premise:
              </label>
              <textarea
                rows={3}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-white focus:outline-none focus:border-rose-500 placeholder-neutral-500 leading-relaxed font-sans"
                placeholder="e.g. An abandoned subterranean AI terminal begins auto-transmitting classified coordinates..."
              />

              {/* Quick Inspiration Premise Chips */}
              <div className="mt-2 space-y-1">
                <span className="text-[10px] text-neutral-500 block">Click a mystery premise to load:</span>
                <div className="space-y-1">
                  {mysteryPremisePresets.slice(0, 3).map((premise, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setConcept(premise)}
                      className="text-[11px] text-left text-neutral-400 hover:text-rose-300 line-clamp-1 block w-full hover:bg-neutral-950/50 p-1 rounded transition-colors"
                    >
                      • {premise}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hook Style / Archetype */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Mystery Hook Blueprint:
              </label>
              <select
                value={hookStyle}
                onChange={(e) => setHookStyle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Audio Intercept & Found Footage">The Blackbox Audio Intercept (Recovered File)</option>
                <option value="Creepy Anomaly & Disappearance">The Unsolved Disappearance & Monolith Anomaly</option>
                <option value="The Forbidden Warning">The Forbidden Warning (Psychological AI Taboo)</option>
                <option value="Neural AI Mimicry & Glitch">Neural AI Mimicry (Copying Human Voices)</option>
                <option value="Deep Web Coordinates & Broadcast">Deep Web Coordinates & Sub-Bunker Signal</option>
              </select>
            </div>

            {/* Narration Pace & Audio Delivery */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Voiceover Narration Pacing:
              </label>
              <select
                value={hookPace}
                onChange={(e) => setHookPace(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Chilling Low Whisper (120 WPM)">Chilling Low Whisper (~120 WPM - Maximum Suspense)</option>
                <option value="Tense Investigative Urgency (135 WPM)">Tense Investigative Urgency (~135 WPM - Fast Hook)</option>
                <option value="Solemn Creepypasta Narration (125 WPM)">Solemn Creepypasta Narration (~125 WPM - Atmospheric)</option>
              </select>
            </div>

            {/* Language / Tone */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Output Language / Tone:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Hinglish', 'Hindi', 'English'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-1.5 text-center rounded border transition-colors ${
                      language === lang
                        ? 'bg-rose-950/60 border-rose-500 text-white font-semibold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                Hinglish blends Hindi suspense power-words with English cinematic terms.
              </p>
            </div>

            {hookError && (
              <div className="p-2.5 bg-rose-950/50 border border-rose-500/50 rounded text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{hookError}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleGenerateStoryHooks}
              disabled={isGeneratingHooks}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold rounded-md shadow transition-all flex items-center justify-center gap-2"
            >
              {isGeneratingHooks ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Formulating 3-4 Sentence Openers...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-rose-200" />
                  Generate 3-4 Sentence Story Hooks
                </>
              )}
            </button>
          </div>

          {/* Right Column: Generated 3-4 Sentence Story Hooks (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Empty State */}
            {!storyHooks && !isGeneratingHooks && (
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-10 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-400">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white">
                  3-4 Sentence Mystery Episodic Hook Generator
                </h3>
                <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
                  YouTube audience retention drops by 35% in the first 15 seconds unless your opener executes a pattern-interrupt. Click Generate to formulate 3 distinct, high-tension 3-4 sentence scripts calibrated for {partNumber}.
                </p>
                <button
                  onClick={handleGenerateStoryHooks}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 mt-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Sample Mystery Hooks for {partNumber}
                </button>
              </div>
            )}

            {/* Loading State */}
            {isGeneratingHooks && (
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                <div className="text-sm font-semibold text-white">
                  Engineering 3-4 Sentence Mystery Openers for {channelName}...
                </div>
                <div className="text-xs text-neutral-400">
                  Synthesizing Sentence 1 pattern-interrupt, Sentence 2 anomaly evidence, Sentence 3 twist escalation, and Sentence 4 episodic challenge
                </div>
              </div>
            )}

            {/* Populated Hook Cards */}
            {storyHooks && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>3 High-Retention Mystery Hook Variations</span>
                      <span className="text-[11px] text-neutral-400 font-mono font-normal">
                        · {partNumber} · {channelName}
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Each hook strictly conforms to the proven 3-4 sentence YouTube episodic formula.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateStoryHooks}
                    disabled={isGeneratingHooks}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Regenerate Variations
                  </button>
                </div>

                {/* Hook Cards Loop */}
                {storyHooks.map((hook, idx) => {
                  const isThisRehearsing = activeRehearsalId === hook.id && isRehearsalRunning;

                  return (
                    <div
                      key={hook.id}
                      className="bg-neutral-900/90 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-700 transition-colors"
                    >
                      {/* Hook Header */}
                      <div className="p-4 border-b border-neutral-800/80 bg-neutral-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded bg-rose-950 border border-rose-800/60 text-rose-400 font-bold font-mono text-xs flex items-center justify-center">
                            0{idx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{hook.styleName}</h4>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              {hook.hookType}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-neutral-300 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-mono tabular-nums">~{hook.estimatedSeconds}s</span>
                            <span className="text-neutral-500 font-mono">({hook.wordCount} words)</span>
                          </div>

                          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40 font-mono font-bold text-[11px]">
                            <Flame className="w-3 h-3 text-emerald-400" />
                            <span>{hook.retentionScore}% AVD</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        {/* Sentence-by-Sentence Breakdown */}
                        <div className="space-y-2">
                          {hook.sentences.map((sent, sIdx) => {
                            const sentenceLabels = [
                              '01 · Scroll-Stopper Pattern Interrupt (0-3s)',
                              '02 · The Chilling Anomaly / Evidence',
                              '03 · The Impossible Escalation / Twist',
                              '04 · The Episodic Lock-in Challenge',
                            ];

                            return (
                              <div
                                key={sIdx}
                                className="p-2.5 bg-neutral-950/70 rounded border border-neutral-800/70 flex flex-col sm:flex-row sm:items-start gap-2.5"
                              >
                                <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono shrink-0 pt-0.5 sm:w-56">
                                  {sentenceLabels[sIdx] || `Sentence 0${sIdx + 1}`}
                                </span>
                                <p className="text-xs text-neutral-200 leading-relaxed font-sans flex-1">
                                  {sent}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Combined Script Preview */}
                        <div className="p-3 bg-neutral-950 rounded border border-neutral-800">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                              Complete Teleprompter Script:
                            </span>
                            <button
                              onClick={() => copyToClipboard(hook.fullText, `hook-full-${hook.id}`)}
                              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                              {copiedId === `hook-full-${hook.id}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              Copy Script
                            </button>
                          </div>
                          <p className="text-xs text-neutral-200 leading-relaxed font-mono select-all">
                            "{hook.fullText}"
                          </p>
                        </div>

                        {/* Production Director Notes (Audio & Visual Cues) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
                          <div className="p-2.5 bg-neutral-950/50 rounded border border-neutral-800/60">
                            <span className="font-semibold text-rose-400 flex items-center gap-1 mb-1">
                              <Volume2 className="w-3 h-3" /> Audio Cue:
                            </span>
                            <p className="text-neutral-400 leading-snug">
                              {hook.directorNotes.soundCue}
                            </p>
                          </div>

                          <div className="p-2.5 bg-neutral-950/50 rounded border border-neutral-800/60">
                            <span className="font-semibold text-cyan-400 flex items-center gap-1 mb-1">
                              <Terminal className="w-3 h-3" /> Visual 3D Cue:
                            </span>
                            <p className="text-neutral-400 leading-snug">
                              {hook.directorNotes.visualCue}
                            </p>
                          </div>

                          <div className="p-2.5 bg-neutral-950/50 rounded border border-neutral-800/60">
                            <span className="font-semibold text-amber-400 flex items-center gap-1 mb-1">
                              <Mic className="w-3 h-3" /> Voice Delivery:
                            </span>
                            <p className="text-neutral-400 leading-snug">
                              {hook.directorNotes.voiceDelivery}
                            </p>
                          </div>
                        </div>

                        {/* Rehearsal Practice Bar */}
                        <div className="pt-2 border-t border-neutral-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startRehearsal(hook.id)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                                isThisRehearsing
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                              }`}
                            >
                              {isThisRehearsing ? (
                                <>
                                  <Pause className="w-3.5 h-3.5" /> Pause Pacing Timer
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 text-emerald-400" /> Practice Voiceover Pacing ({hook.estimatedSeconds}s)
                                </>
                              )}
                            </button>

                            {activeRehearsalId === hook.id && (
                              <button
                                onClick={stopRehearsal}
                                className="p-1.5 text-neutral-500 hover:text-white"
                                title="Reset timer"
                              >
                                <RotateCcw className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                // Extract punchy 2-4 words from sentence 1 for 3D thumbnail
                                const clean = hook.sentences[0]
                                  .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
                                  .toUpperCase();
                                onApplyTitleToThumbnail(clean.slice(0, 42));
                              }}
                              className="px-2.5 py-1.5 text-[11px] bg-rose-600/90 hover:bg-rose-500 text-white font-medium rounded transition-colors flex items-center gap-1"
                            >
                              Apply Hook to 3D Thumbnail
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Rehearsal Progress Bar */}
                        {activeRehearsalId === hook.id && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                              <span>Voiceover Cadence Target: 125 WPM</span>
                              <span>{Math.round(rehearsalProgress)}% completed</span>
                            </div>
                            <div className="w-full bg-neutral-950 h-2 rounded overflow-hidden border border-neutral-800">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-100"
                                style={{ width: `${rehearsalProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 2: TRENDING HASHTAG EXPLORER
         ========================================================================= */}
      {activeMode === 'hashtag_explorer' && (
        <TrendingHashtagsExplorer
          currentConcept={concept}
          partNumber={partNumber}
          onApplyTagsToMetadata={handleApplyTagsToMetadata}
        />
      )}

      {/* =========================================================================
          MODE 3: FULL TITLES, TAGS & DESCRIPTION SUITE
         ========================================================================= */}
      {activeMode === 'seo_suite' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Form (4 cols) */}
          <div className="lg:col-span-4 bg-neutral-900/90 border border-neutral-800 rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
              Video Metadata Configuration
            </h2>

            {/* Channel Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                YouTube Channel Name:
              </label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-white font-semibold focus:outline-none focus:border-rose-500"
                placeholder="e.g. Mysterious AI"
              />
            </div>

            {/* Episodic Story Part Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Story Episode / Part:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Final Part', 'Cliffhanger'].map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setPartNumber(pt)}
                    className={`py-1 rounded text-center text-[11px] font-bold border transition-colors ${
                      partNumber === pt
                        ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>

            {/* Concept Input */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Mysterious Story Concept ({partNumber}):
              </label>
              <textarea
                rows={3}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-white focus:outline-none focus:border-cyan-500 placeholder-neutral-500"
                placeholder="e.g. A rogue AI awakens in a deep underground bunker and starts broadcasting coordinates..."
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Cinematic Genre / Category:
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Mysterious AI Hook Story">Mysterious AI Hook Story</option>
                <option value="Sci-Fi Cyberpunk">Sci-Fi Cyberpunk</option>
                <option value="Epic Dark Fantasy">Epic Dark Fantasy</option>
                <option value="Space & Singularity">Space & Singularity Portal</option>
                <option value="Action & Automotive CGI">Action & Automotive CGI</option>
                <option value="Horror & Thriller 3D">Horror & Psychological 3D</option>
                <option value="Mythology & Ancient Lore">Mythology & Ancient Lore</option>
                <option value="Unreal Engine 5 VFX Breakdown">UE5 / Blender VFX Breakdown</option>
              </select>
            </div>

            {/* Creation Tool */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                3D Engine & Software Used:
              </label>
              <select
                value={toolSoftware}
                onChange={(e) => setToolSoftware(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Unreal Engine 5.5 / Lumen / Nanite">Unreal Engine 5.5 (Lumen / Nanite)</option>
                <option value="Blender 4.3 (Cycles 4K HDR)">Blender 4.3 (Cycles 4K HDR)</option>
                <option value="Cinema 4D + Redshift">Cinema 4D + Redshift</option>
                <option value="Autodesk Maya + Arnold VFX">Autodesk Maya + Arnold VFX</option>
                <option value="DaVinci Resolve Studio (Color Grading)">DaVinci Resolve Studio</option>
              </select>
            </div>

            {/* Language & Tone */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Audience Language / Tone:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Hinglish', 'Hindi', 'English'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-1.5 text-center rounded border transition-colors ${
                      language === lang
                        ? 'bg-cyan-950/60 border-cyan-500 text-white font-semibold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {seoError && (
              <div className="p-2.5 bg-rose-950/50 border border-rose-500/50 rounded text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{seoError}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleGenerateSeo}
              disabled={isLoadingSeo}
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-md shadow transition-all flex items-center justify-center gap-2"
            >
              {isLoadingSeo ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Generating SEO Matrix...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  Generate Titles, Tags & Description
                </>
              )}
            </button>
          </div>

          {/* Right Column: Generated SEO Matrix (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {!seoResult && !isLoadingSeo ? (
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-10 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Ready to Optimize Your Episodic Metadata
                </h3>
                <p className="text-xs text-neutral-400 max-w-md">
                  Configure your story on the left and click Generate to produce 5 viral titles, 30 search tags, an episodic cliffhanger script, and binge-watching description.
                </p>
              </div>
            ) : null}

            {isLoadingSeo ? (
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                <div className="text-sm font-semibold text-white">
                  Optimizing for YouTube's 2026 Recommendation Engine...
                </div>
                <div className="text-xs text-neutral-400">
                  Crafting high-CTR title variations, binge-watching playlist descriptions, and ranked tags
                </div>
              </div>
            ) : null}

            {seoResult && (
              <>
                {/* Algorithm Audit Score Banner */}
                {auditResult && (
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center text-emerald-400 font-bold font-mono text-lg tabular-nums">
                        {auditResult.score}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>Algorithm Readability:</span>
                          <span className="text-emerald-400">{auditResult.grade}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {auditResult.strengths[0] || 'Optimized for mobile CTR and semantic YouTube search.'}
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{partNumber} Tags & Chapter Timestamps Detected</span>
                    </div>
                  </div>
                )}

                {/* 1. 5 High-CTR Viral Titles */}
                <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-500" />
                      Top 5 Viral High-CTR Titles ({partNumber})
                    </h3>
                    <span className="text-[11px] text-neutral-500">
                      Click "Apply to 3D Thumbnail" to transfer to canvas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {seoResult.titles.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-neutral-950 rounded-md border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <span className="text-neutral-500 font-mono text-[11px]">#{idx + 1}</span>
                            <span>{t}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                            <span>{t.length} chars</span>
                            <span>·</span>
                            <span className={t.length <= 68 ? 'text-emerald-400' : 'text-amber-400'}>
                              {t.length <= 68 ? 'Mobile Safe' : 'May truncate on phone'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => copyToClipboard(t, `title-${idx}`)}
                            className="px-2.5 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors flex items-center gap-1"
                          >
                            {copiedId === `title-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            Copy
                          </button>
                          <button
                            onClick={() => onApplyTitleToThumbnail(t)}
                            className="px-2.5 py-1 text-[11px] bg-rose-600/90 hover:bg-rose-500 text-white font-medium rounded transition-colors flex items-center gap-1"
                          >
                            Apply to 3D Thumbnail
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Cliffhanger Outro Script */}
                {seoResult.cliffhangerScript && (
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-rose-500" />
                        Episode Cliffhanger Ending Script (Forces Next Part Binging)
                      </h3>
                      <button
                        onClick={() => copyToClipboard(seoResult.cliffhangerScript || '', 'cliffhanger')}
                        className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedId === 'cliffhanger' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        Copy Outro
                      </button>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-md border border-neutral-800/80 text-xs text-neutral-200 leading-relaxed font-mono">
                      {seoResult.cliffhangerScript}
                    </div>
                    {seoResult.nextPartTeaser && (
                      <div className="text-[11px] text-amber-300/90 font-medium">
                        Next Episode Preview: {seoResult.nextPartTeaser}
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Link to Trending Hashtag Explorer */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-rose-500 shrink-0" />
                    <p className="text-xs text-neutral-300">
                      Explore 28+ curated high-volume mystery hashtags & AI breakout signals for <strong>{partNumber}</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveMode('hashtag_explorer')}
                    className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
                  >
                    Open Trending Hashtags Explorer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3. 30 High-Volume Search Tags */}
                <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <Hash className="w-4 h-4" />
                        30 High-Volume Search Tags
                      </h3>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        ({seoResult.tags.length} tags)
                      </span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(seoResult.tagsString, 'tags')}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded transition-colors flex items-center gap-1.5"
                    >
                      {copiedId === 'tags' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      Copy All 30 Tags for YouTube Studio
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-3 bg-neutral-950 rounded-md border border-neutral-800 max-h-40 overflow-y-auto">
                    {seoResult.tags.map((tg, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded font-mono"
                      >
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Full SEO Description & Chapters */}
                <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                      Binge-Watch Description with Part Links & Timestamps
                    </h3>

                    <button
                      onClick={() => copyToClipboard(seoResult.description, 'desc')}
                      className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded transition-colors flex items-center gap-1"
                    >
                      {copiedId === 'desc' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      Copy Full Description
                    </button>
                  </div>

                  <textarea
                    readOnly
                    rows={8}
                    value={seoResult.description}
                    className="w-full p-3 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-neutral-300 font-mono leading-relaxed focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
