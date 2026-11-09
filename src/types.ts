export type TabType = 'thumbnail' | 'seo' | 'algorithm' | 'simulator';

export interface TextLayer {
  id: string;
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fillColor: string;
  fillGradientEnd?: string;
  useGradient: boolean;
  strokeColor: string;
  strokeWidth: number;
  depth3D: number; // 3D extrusion depth
  depthColor: string;
  depthAngle: number; // in degrees
  glowColor: string;
  glowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  letterSpacing: number;
  isUppercase: boolean;
  opacity: number;
}

export interface StickerLayer {
  id: string;
  type: 'badge' | 'flare' | 'vignette' | 'bars';
  label: string;
  x: number;
  y: number;
  scale: number;
  bgColor: string;
  textColor: string;
}

export type LutFilter = 'none' | 'teal_orange' | 'cyber_neon' | 'bleach_bypass' | 'golden_hour' | 'dark_scifi' | 'vintage_film';

export interface SeoGeneratedData {
  titles: string[];
  bestTitle: string;
  hookScript: string;
  cliffhangerScript?: string;
  nextPartTeaser?: string;
  description: string;
  tags: string[];
  tagsString: string;
  hashtags: string[];
  thumbnailIdeas: string[];
  algorithmTips: string[];
  partNumber?: string;
}

export interface AuditResult {
  score: number;
  grade: string;
  strengths: string[];
  recommendations: string[];
}

export interface StoryHookDirectorNotes {
  soundCue: string;
  visualCue: string;
  voiceDelivery: string;
}

export interface StoryHookItem {
  id: string;
  styleName: string;
  hookType: string;
  sentences: string[]; // exactly 3-4 sentences
  fullText: string;
  wordCount: number;
  estimatedSeconds: number;
  retentionScore: number;
  retentionBreakdown: {
    curiosityGap: string;
    pacingTrigger: string;
    cliffhangerPotential: string;
  };
  directorNotes: StoryHookDirectorNotes;
}

export interface StoryHookResponse {
  partNumber: string;
  channelName: string;
  hooks: StoryHookItem[];
}

export type HashtagCategory =
  | 'all'
  | 'viral_horror'
  | 'ai_thriller'
  | 'unsolved_conspiracy'
  | '3d_cgi'
  | 'episodic_series';

export interface TrendingHashtag {
  id: string;
  tag: string; // with '#' prefix, e.g. '#MysteriousAI'
  cleanTag: string; // without '#', e.g. 'mysterious ai'
  category: HashtagCategory;
  categoryLabel: string;
  searchVolume: string; // e.g. '2.4M searches/mo'
  volumeNum: number;
  competition: 'Low' | 'Medium' | 'High' | 'Breakout (+220%)';
  algorithmSignal: string;
  isTrendingBreakout?: boolean;
}

export interface TrendingHashtagsResponse {
  tags: TrendingHashtag[];
  totalVolume: string;
  recommendedCluster: string[];
}

