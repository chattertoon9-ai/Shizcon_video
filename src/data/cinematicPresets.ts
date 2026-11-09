export interface PresetBackground {
  id: string;
  name: string;
  url: string;
  category: 'Mystery AI' | 'Sci-Fi' | 'Space' | 'Fantasy' | 'Automotive';
  description: string;
}

export const CINEMATIC_BACKGROUNDS: PresetBackground[] = [
  {
    id: 'mystery-ai-terminal',
    name: 'Corrupted AI Terminal Bunker',
    url: '/src/assets/images/bg_mystery_ai_terminal_1794149580443.jpg',
    category: 'Mystery AI',
    description: 'Hooded investigator before ancient glowing red AI supercomputer in foggy bunker',
  },
  {
    id: 'mystery-forest-monolith',
    name: 'Midnight Monolith Entity',
    url: '/src/assets/images/bg_mystery_forest_monolith_1794149581224.jpg',
    category: 'Mystery AI',
    description: 'Floating rune monolith emitting cyan tractor beams over dark foggy pine forest',
  },
  {
    id: 'mystery-corridor-ai',
    name: 'Derelict Corridor AI Skull',
    url: '/src/assets/images/bg_mystery_corridor_ai_1794149580933.jpg',
    category: 'Mystery AI',
    description: 'Ominous glowing robotic AI face in decaying spaceship corridor with amber lights',
  },
  {
    id: 'cyberpunk-city',
    name: 'Neo-Tokyo Cyberpunk',
    url: '/src/assets/images/bg_cyberpunk_city_1794148796278.jpg',
    category: 'Sci-Fi',
    description: 'Holographic towers, wet neon asphalt, volumetric fog render',
  },
  {
    id: 'space-nebula',
    name: 'Cosmic Singularity Portal',
    url: '/src/assets/images/bg_space_nebula_1794148796208.jpg',
    category: 'Space',
    description: 'Black hole accretion disk with blue-gold lighting and asteroids',
  },
  {
    id: 'fantasy-temple',
    name: 'Colossal Dark Citadel',
    url: '/src/assets/images/bg_fantasy_temple_1794148796315.jpg',
    category: 'Fantasy',
    description: 'Ancient mountain temple ruins with god rays and burning embers',
  },
  {
    id: 'car-neon-tunnel',
    name: 'Subterranean Hypercar',
    url: '/src/assets/images/bg_car_neon_tunnel_1794148797119.jpg',
    category: 'Automotive',
    description: 'High-speed light trail tunnel with motion blur reflections',
  },
];

export interface TextMaterialPreset {
  id: string;
  name: string;
  fillColor: string;
  fillGradientEnd: string;
  useGradient: boolean;
  strokeColor: string;
  strokeWidth: number;
  depth3D: number;
  depthColor: string;
  glowColor: string;
  glowBlur: number;
  fontFamily: string;
}

export const TEXT_MATERIAL_PRESETS: TextMaterialPreset[] = [
  {
    id: 'crimson-metal',
    name: '3D Mystery Crimson (Horror)',
    fillColor: '#FEE2E2',
    fillGradientEnd: '#DC2626',
    useGradient: true,
    strokeColor: '#450A0A',
    strokeWidth: 5,
    depth3D: 18,
    depthColor: '#1F0505',
    glowColor: '#EF4444',
    glowBlur: 32,
    fontFamily: 'Barlow Condensed',
  },
  {
    id: 'cyber-neon',
    name: '3D AI Terminal Cyan',
    fillColor: '#E0F2FE',
    fillGradientEnd: '#06B6D4',
    useGradient: true,
    strokeColor: '#083344',
    strokeWidth: 5,
    depth3D: 16,
    depthColor: '#0F172A',
    glowColor: '#22D3EE',
    glowBlur: 32,
    fontFamily: 'Barlow Condensed',
  },
  {
    id: 'molten-gold',
    name: '3D Imperial Amber',
    fillColor: '#FFF4B8',
    fillGradientEnd: '#D97706',
    useGradient: true,
    strokeColor: '#78350F',
    strokeWidth: 4,
    depth3D: 14,
    depthColor: '#451A03',
    glowColor: '#F59E0B',
    glowBlur: 24,
    fontFamily: 'Cinzel',
  },
  {
    id: 'toxic-emerald',
    name: '3D Eerie Bunker Green',
    fillColor: '#DCFCE7',
    fillGradientEnd: '#16A34A',
    useGradient: true,
    strokeColor: '#052E16',
    strokeWidth: 4,
    depth3D: 15,
    depthColor: '#021B0D',
    glowColor: '#22C55E',
    glowBlur: 28,
    fontFamily: 'Barlow Condensed',
  },
  {
    id: 'chrome-silver',
    name: '3D Ghost Chrome',
    fillColor: '#FFFFFF',
    fillGradientEnd: '#94A3B8',
    useGradient: true,
    strokeColor: '#334155',
    strokeWidth: 3,
    depth3D: 12,
    depthColor: '#0F172A',
    glowColor: '#E2E8F0',
    glowBlur: 18,
    fontFamily: 'Outfit',
  },
];

export const BADGE_PRESETS = [
  { label: 'PART 1', bg: '#DC2626', text: '#FFFFFF' },
  { label: 'PART 2', bg: '#B91C1C', text: '#FFFFFF' },
  { label: 'PART 3: FINALE', bg: '#7F1D1D', text: '#FCA5A5' },
  { label: 'DO NOT WATCH ALONE', bg: '#000000', text: '#EF4444' },
  { label: 'MYSTERIOUS AI', bg: '#0F172A', text: '#38BDF8' },
  { label: 'CLIFFHANGER ENDING', bg: '#D97706', text: '#FFFFFF' },
  { label: '4K ULTRA HD', bg: '#DC2626', text: '#FFFFFF' },
  { label: 'SPATIAL 3D AUDIO', bg: '#7C3AED', text: '#FFFFFF' },
  { label: 'UNSOLVED CASE', bg: '#047857', text: '#FFFFFF' },
];

export const HEADLINE_PRESETS = [
  'WHAT THE AI FOUND [PART 1]',
  "DO NOT ENTER ROOM 404 [PART 2]",
  'THE FINAL TRANSMISSION [PART 3]',
  'IT AWOKE AT 3:00 AM [PART 1]',
  'THEY LIED ABOUT THE BUNKER [PART 2]',
  'THE LOST ARCHIVE [PART 1]',
  'IT COPIED MY VOICE [PART 3: THE END]',
];
