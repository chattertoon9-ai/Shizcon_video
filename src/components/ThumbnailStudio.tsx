import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  TextLayer,
  StickerLayer,
  LutFilter,
} from '../types';
import {
  CINEMATIC_BACKGROUNDS,
  TEXT_MATERIAL_PRESETS,
  BADGE_PRESETS,
  HEADLINE_PRESETS,
} from '../data/cinematicPresets';
import {
  Download,
  Upload,
  Layers,
  Type,
  Sliders,
  Sparkles,
  Maximize2,
  Eye,
  Film,
  RotateCcw,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';

interface ThumbnailStudioProps {
  onSendToSimulator: (thumbnailDataUrl: string, titleText: string) => void;
  quickExportTrigger: number;
}

export const ThumbnailStudio: React.FC<ThumbnailStudioProps> = ({
  onSendToSimulator,
  quickExportTrigger,
}) => {
  // Canvas reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background state
  const [selectedBg, setSelectedBg] = useState<string>(CINEMATIC_BACKGROUNDS[0].url);
  const [customBgImage, setCustomBgImage] = useState<HTMLImageElement | null>(null);
  const [bgLoaded, setBgLoaded] = useState<boolean>(false);

  // Background color adjustments
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(110);
  const [saturation, setSaturation] = useState<number>(120);

  // Post effects
  const [letterboxBars, setLetterboxBars] = useState<boolean>(true);
  const [vignette, setVignette] = useState<boolean>(true);
  const [filmGrain, setFilmGrain] = useState<boolean>(true);
  const [anamorphicFlare, setAnamorphicFlare] = useState<boolean>(true);
  const [lutFilter, setLutFilter] = useState<LutFilter>('teal_orange');

  // Primary 3D Title Layer (Defaulted to Mysterious AI)
  const [titleLayer, setTitleLayer] = useState<TextLayer>({
    id: 'title-1',
    text: 'WHAT THE AI FOUND [PART 1]',
    fontSize: 92,
    fontFamily: 'Barlow Condensed',
    fontWeight: '900',
    fillColor: '#FEE2E2',
    fillGradientEnd: '#DC2626',
    useGradient: true,
    strokeColor: '#450A0A',
    strokeWidth: 5,
    depth3D: 18,
    depthColor: '#1F0505',
    depthAngle: 45, // down-right
    glowColor: '#EF4444',
    glowBlur: 28,
    shadowOffsetX: 6,
    shadowOffsetY: 8,
    x: 50,
    y: 52,
    letterSpacing: 2,
    isUppercase: true,
    opacity: 1,
  });

  // Secondary Subtitle Layer
  const [subtitleLayer, setSubtitleLayer] = useState<TextLayer>({
    id: 'sub-1',
    text: 'MYSTERIOUS AI · EPISODE 1 (4K HDR)',
    fontSize: 32,
    fontFamily: 'Outfit',
    fontWeight: '700',
    fillColor: '#FDE047',
    fillGradientEnd: '#EAB308',
    useGradient: false,
    strokeColor: '#000000',
    strokeWidth: 3,
    depth3D: 4,
    depthColor: '#422006',
    depthAngle: 45,
    glowColor: '#CA8A04',
    glowBlur: 14,
    shadowOffsetX: 2,
    shadowOffsetY: 3,
    x: 50,
    y: 67,
    letterSpacing: 4,
    isUppercase: true,
    opacity: 0.95,
  });

  // Badges
  const [stickers, setStickers] = useState<StickerLayer[]>([
    {
      id: 'badge-1',
      type: 'badge',
      label: '4K ULTRA HD',
      x: 8,
      y: 12,
      scale: 1,
      bgColor: '#DC2626',
      textColor: '#FFFFFF',
    },
    {
      id: 'badge-2',
      type: 'badge',
      label: '60 FPS HDR',
      x: 8,
      y: 20,
      scale: 0.9,
      bgColor: '#D97706',
      textColor: '#FFFFFF',
    },
  ]);

  // Active control panel tab
  const [activePanel, setActivePanel] = useState<'text' | 'backdrop' | 'effects' | 'badges'>('text');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // File upload handler for custom background
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setCustomBgImage(img);
        setSelectedBg('custom');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Apply Material Preset
  const applyMaterial = (materialId: string) => {
    const preset = TEXT_MATERIAL_PRESETS.find((m) => m.id === materialId);
    if (!preset) return;

    setTitleLayer((prev) => ({
      ...prev,
      fillColor: preset.fillColor,
      fillGradientEnd: preset.fillGradientEnd,
      useGradient: preset.useGradient,
      strokeColor: preset.strokeColor,
      strokeWidth: preset.strokeWidth,
      depth3D: preset.depth3D,
      depthColor: preset.depthColor,
      glowColor: preset.glowColor,
      glowBlur: preset.glowBlur,
      fontFamily: preset.fontFamily,
    }));
  };

  // Add badge
  const addBadge = (badge: { label: string; bg: string; text: string }) => {
    const newBadge: StickerLayer = {
      id: `badge-${Date.now()}`,
      type: 'badge',
      label: badge.label,
      x: 8 + (stickers.length % 3) * 18,
      y: 12 + Math.floor(stickers.length / 3) * 9,
      scale: 1,
      bgColor: badge.bg,
      textColor: badge.text,
    };
    setStickers((prev) => [...prev, newBadge]);
  };

  const removeBadge = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  // Stamp or swap Part number into title
  const applyPartToTitle = (partTag: string) => {
    let current = titleLayer.text;
    if (/\[PART\s*[^\]]+\]/i.test(current)) {
      current = current.replace(/\[PART\s*[^\]]+\]/i, `[${partTag}]`);
    } else {
      current = `${current} [${partTag}]`;
    }
    setTitleLayer((prev) => ({ ...prev, text: current.trim() }));
  };

  // Master Render Function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
    const drawBg = (img: HTMLImageElement) => {
      ctx.save();

      // Apply CSS-like adjustments on backdrop
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

      // Scale to cover 16:9
      const hRatio = width / img.width;
      const vRatio = height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (width - img.width * ratio) / 2;
      const centerShiftY = (height - img.height * ratio) / 2;

      ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
      ctx.restore();

      drawOverlaysAndText();
    };

    const drawOverlaysAndText = () => {
      // 2. LUT Color Grading Overlay
      if (lutFilter !== 'none') {
        ctx.save();
        if (lutFilter === 'teal_orange') {
          // Dark cyan shadows, warm amber highlights
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
          grad.addColorStop(1, 'rgba(245, 158, 11, 0.18)');
          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        } else if (lutFilter === 'cyber_neon') {
          const grad = ctx.createRadialGradient(width / 2, height / 2, 200, width / 2, height / 2, width);
          grad.addColorStop(0, 'rgba(236, 72, 153, 0.18)');
          grad.addColorStop(1, 'rgba(14, 165, 233, 0.22)');
          ctx.globalCompositeOperation = 'color';
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        } else if (lutFilter === 'golden_hour') {
          ctx.globalCompositeOperation = 'soft-light';
          ctx.fillStyle = 'rgba(245, 158, 11, 0.28)';
          ctx.fillRect(0, 0, width, height);
        } else if (lutFilter === 'dark_scifi') {
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
          ctx.fillRect(0, 0, width, height);
        } else if (lutFilter === 'bleach_bypass') {
          ctx.globalCompositeOperation = 'hard-light';
          ctx.fillStyle = 'rgba(100, 116, 139, 0.18)';
          ctx.fillRect(0, 0, width, height);
        }
        ctx.restore();
      }

      // 3. Anamorphic Lens Flare Overlay
      if (anamorphicFlare) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        // Horizontal cyan-blue streak
        const flareY = height * 0.48;
        const flareGrad = ctx.createLinearGradient(0, flareY, width, flareY);
        flareGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
        flareGrad.addColorStop(0.3, 'rgba(14, 165, 233, 0.2)');
        flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
        flareGrad.addColorStop(0.7, 'rgba(59, 130, 246, 0.2)');
        flareGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, flareY - 4, width, 8);

        // Core glow dot
        const radialCore = ctx.createRadialGradient(width * 0.5, flareY, 0, width * 0.5, flareY, 260);
        radialCore.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        radialCore.addColorStop(0.2, 'rgba(56, 189, 248, 0.4)');
        radialCore.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radialCore;
        ctx.fillRect(width * 0.5 - 260, flareY - 140, 520, 280);
        ctx.restore();
      }

      // 4. Heavy Vignette for YouTube thumbnail contrast
      if (vignette) {
        ctx.save();
        const vigGrad = ctx.createRadialGradient(width / 2, height / 2, width * 0.28, width / 2, height / 2, width * 0.65);
        vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vigGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.35)');
        vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 5. Film Grain Simulation
      if (filmGrain) {
        ctx.save();
        ctx.globalAlpha = 0.045;
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 28000; i++) {
          const gx = Math.random() * width;
          const gy = Math.random() * height;
          ctx.fillRect(gx, gy, 1.4, 1.4);
        }
        ctx.restore();
      }

      // 6. Draw 3D Text Layers
      draw3DText(ctx, titleLayer, width, height);
      draw3DText(ctx, subtitleLayer, width, height);

      // 7. Draw Badges & Stickers
      stickers.forEach((sticker) => {
        drawBadge(ctx, sticker, width, height);
      });

      // 8. 2.39:1 Anamorphic Scope Letterbox Black Bars (top & bottom)
      if (letterboxBars) {
        ctx.save();
        const barHeight = Math.round(height * 0.09); // Cinematic scope bars
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, barHeight);
        ctx.fillRect(0, height - barHeight, width, barHeight);

        // Thin golden/cyan cinematic framing accent line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(0, barHeight, width, 1);
        ctx.fillRect(0, height - barHeight - 1, width, 1);
        ctx.restore();
      }
    };

    // Load background image
    if (selectedBg === 'custom' && customBgImage) {
      drawBg(customBgImage);
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setBgLoaded(true);
        drawBg(img);
      };
      img.onerror = () => {
        // Fallback procedural background
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        drawOverlaysAndText();
      };
      img.src = selectedBg;
    }
  }, [
    selectedBg,
    customBgImage,
    brightness,
    contrast,
    saturation,
    letterboxBars,
    vignette,
    filmGrain,
    anamorphicFlare,
    lutFilter,
    titleLayer,
    subtitleLayer,
    stickers,
  ]);

  // 3D Text Drawing Helper with Extrusion Depth
  const draw3DText = (ctx: CanvasRenderingContext2D, layer: TextLayer, width: number, height: number) => {
    ctx.save();

    const posX = (layer.x / 100) * width;
    const posY = (layer.y / 100) * height;

    const fontStyle = `${layer.fontWeight} ${layer.fontSize * 1.5}px "${layer.fontFamily}", sans-serif`;
    ctx.font = fontStyle;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textToDraw = layer.isUppercase ? layer.text.toUpperCase() : layer.text;

    // Calculate extrusion offsets
    const rad = (layer.depthAngle * Math.PI) / 180;
    const stepX = Math.cos(rad);
    const stepY = Math.sin(rad);

    // 1. Draw 3D Extrusion Slices (from back to front)
    if (layer.depth3D > 0) {
      for (let i = layer.depth3D; i >= 1; i--) {
        const ox = posX + stepX * i;
        const oy = posY + stepY * i;

        // Darken depth slices progressively
        ctx.fillStyle = layer.depthColor;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText(textToDraw, ox, oy);

        // Optional depth stroke
        if (layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.depthColor;
          ctx.lineWidth = layer.strokeWidth;
          ctx.strokeText(textToDraw, ox, oy);
        }
      }
    }

    // 2. Outer Glow / Neon aura
    if (layer.glowBlur > 0) {
      ctx.save();
      ctx.shadowColor = layer.glowColor;
      ctx.shadowBlur = layer.glowBlur;
      ctx.strokeStyle = layer.glowColor;
      ctx.lineWidth = layer.strokeWidth + 4;
      ctx.strokeText(textToDraw, posX, posY);
      ctx.restore();
    }

    // 3. Thick Outline Stroke
    if (layer.strokeWidth > 0) {
      ctx.strokeStyle = layer.strokeColor;
      ctx.lineWidth = layer.strokeWidth * 1.8;
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 2;
      ctx.strokeText(textToDraw, posX, posY);
    }

    // 4. Front Face Gradient / Fill
    if (layer.useGradient && layer.fillGradientEnd) {
      const textMetrics = ctx.measureText(textToDraw);
      const grad = ctx.createLinearGradient(
        posX - textMetrics.width / 2,
        posY - layer.fontSize,
        posX + textMetrics.width / 2,
        posY + layer.fontSize
      );
      grad.addColorStop(0, layer.fillColor);
      grad.addColorStop(1, layer.fillGradientEnd);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = layer.fillColor;
    }

    // Front text fill
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 6;
    ctx.fillText(textToDraw, posX, posY);

    ctx.restore();
  };

  // Badge Drawing Helper
  const drawBadge = (ctx: CanvasRenderingContext2D, badge: StickerLayer, width: number, height: number) => {
    ctx.save();
    const bx = (badge.x / 100) * width;
    const by = (badge.y / 100) * height;

    ctx.font = '800 24px "Barlow Condensed", sans-serif';
    const paddingX = 16;
    const paddingY = 8;
    const metrics = ctx.measureText(badge.label);
    const boxWidth = metrics.width + paddingX * 2;
    const boxHeight = 36;

    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    // Background pill with sharp chamfered or rounded rect
    ctx.fillStyle = badge.bgColor;
    ctx.beginPath();
    ctx.roundRect(bx, by, boxWidth, boxHeight, 4);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Text
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = badge.textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(badge.label, bx + paddingX, by + boxHeight / 2 + 1);

    ctx.restore();
  };

  // Re-render when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Export File Function
  const handleExport = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setExportNotice('Rendering high-resolution 1920x1080 master...');

    setTimeout(() => {
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'jpeg' ? 0.92 : undefined;
      const dataUrl = canvas.toDataURL(mime, quality);

      const link = document.createElement('a');
      link.download = `3d-cinematic-thumbnail-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();

      setIsExporting(false);
      setExportNotice('Thumbnail downloaded! (< 2MB YouTube safe).');
      setTimeout(() => setExportNotice(null), 4000);
    }, 250);
  };

  // Handle quick export trigger from navbar
  useEffect(() => {
    if (quickExportTrigger > 0) {
      handleExport('jpeg');
    }
  }, [quickExportTrigger]);

  // Test in Feed Simulator
  const handleTestInFeed = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    onSendToSimulator(dataUrl, titleLayer.text);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-6 py-6">
      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Free 3D Cinematic Thumbnail Software
          </h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            Design Hollywood-grade 3D extruded titles, anamorphic flares, and cinematic LUT color grades tailored for high YouTube CTR.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleTestInFeed}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-200 bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Test in YouTube Feed
          </button>

          <button
            onClick={() => handleExport('png')}
            disabled={isExporting}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-md hover:bg-neutral-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            HD PNG
          </button>

          <button
            onClick={() => handleExport('jpeg')}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-md hover:bg-rose-500 shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Export 4K JPG (YouTube Safe)
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="mb-4 px-4 py-2.5 bg-neutral-900 border border-rose-500/40 rounded-md text-xs font-medium text-rose-300 flex items-center justify-between">
          <span>{exportNotice}</span>
          <span className="text-neutral-500 text-[11px]">1920 × 1080 16:9 Standard</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Canvas Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-black shadow-2xl aspect-video group">
            {/* The Master HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain block select-none cursor-default"
            />

            {/* Quick overlay controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/80 backdrop-blur-md px-2.5 py-1.5 rounded border border-neutral-800">
              <span className="text-[11px] font-mono text-neutral-400">1920x1080 (16:9)</span>
            </div>

            {/* Bottom info strip */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-neutral-400 pointer-events-none opacity-80">
              <span>LUT: {lutFilter.toUpperCase()}</span>
              <span>3D DEPTH: {titleLayer.depth3D}PX</span>
            </div>
          </div>

          {/* Quick Preset Headlines Selector */}
          <div className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-300">Quick High-CTR 3D Headlines:</span>
              <span className="text-[11px] text-neutral-500">1-click apply</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {HEADLINE_PRESETS.map((headline, idx) => (
                <button
                  key={idx}
                  onClick={() => setTitleLayer((prev) => ({ ...prev, text: headline }))}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    titleLayer.text === headline
                      ? 'bg-rose-600 text-white font-semibold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  {headline}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Editing Suite Controls (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-900/90 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center border-b border-neutral-800 bg-neutral-950/70 p-1">
            <button
              onClick={() => setActivePanel('text')}
              className={`flex-1 py-2 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${
                activePanel === 'text'
                  ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-rose-400" />
              3D Text & Materials
            </button>
            <button
              onClick={() => setActivePanel('backdrop')}
              className={`flex-1 py-2 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${
                activePanel === 'backdrop'
                  ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Backdrop & Upload
            </button>
            <button
              onClick={() => setActivePanel('effects')}
              className={`flex-1 py-2 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${
                activePanel === 'effects'
                  ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              Cinematic FX & LUT
            </button>
            <button
              onClick={() => setActivePanel('badges')}
              className={`flex-1 py-2 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${
                activePanel === 'badges'
                  ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Badges
            </button>
          </div>

          <div className="p-4 space-y-5 max-h-[580px] overflow-y-auto">
            {/* Panel 1: 3D Text & Materials */}
            {activePanel === 'text' && (
              <div className="space-y-4">
                {/* 3D Material Presets */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    3D Shading & Material Preset:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEXT_MATERIAL_PRESETS.map((mat) => (
                      <button
                        key={mat.id}
                        onClick={() => applyMaterial(mat.id)}
                        className="px-3 py-2 text-left bg-neutral-950 border border-neutral-800 hover:border-neutral-600 rounded-md transition-all flex items-center justify-between"
                      >
                        <span className="text-xs font-medium text-neutral-200">{mat.name}</span>
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, ${mat.fillColor}, ${mat.fillGradientEnd})`,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title Text Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Primary 3D Title:</label>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {titleLayer.text.length} chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={titleLayer.text}
                    onChange={(e) => setTitleLayer({ ...titleLayer, text: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-md text-white focus:outline-none focus:border-rose-500 font-medium"
                    placeholder="Enter bold 3D title..."
                  />

                  {/* Episodic Hook Story Part Stamper */}
                  <div className="mt-2">
                    <span className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Episodic Story Part Stamper (1-Click):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {['PART 1', 'PART 2', 'PART 3', 'FINAL PART', 'CLIFFHANGER'].map((part) => (
                        <button
                          key={part}
                          type="button"
                          onClick={() => applyPartToTitle(part)}
                          className="px-2 py-0.5 text-[10px] font-bold bg-neutral-950 border border-rose-900/60 hover:border-rose-500 text-rose-300 hover:text-white rounded transition-colors"
                        >
                          +{part}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3D Depth Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-300 font-medium">3D Extrusion Depth:</span>
                    <span className="text-rose-400 font-mono tabular-nums">{titleLayer.depth3D}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={titleLayer.depth3D}
                    onChange={(e) => setTitleLayer({ ...titleLayer, depth3D: Number(e.target.value) })}
                    className="w-full accent-rose-500 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Text Size & Vertical Position */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-neutral-300">Font Size:</span>
                      <span className="text-neutral-400 font-mono">{titleLayer.fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="140"
                      value={titleLayer.fontSize}
                      onChange={(e) => setTitleLayer({ ...titleLayer, fontSize: Number(e.target.value) })}
                      className="w-full accent-rose-500 h-1.5 bg-neutral-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-neutral-300">Y-Position:</span>
                      <span className="text-neutral-400 font-mono">{titleLayer.y}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="85"
                      value={titleLayer.y}
                      onChange={(e) => setTitleLayer({ ...titleLayer, y: Number(e.target.value) })}
                      className="w-full accent-rose-500 h-1.5 bg-neutral-800 rounded-lg"
                    />
                  </div>
                </div>

                {/* Font Family selector */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Typography Font:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { name: 'Barlow Condensed', label: 'Impact Block' },
                      { name: 'Cinzel', label: 'Epic Cinema' },
                      { name: 'Outfit', label: 'Futuristic' },
                    ].map((f) => (
                      <button
                        key={f.name}
                        onClick={() => setTitleLayer({ ...titleLayer, fontFamily: f.name })}
                        className={`p-2 rounded text-center border transition-colors ${
                          titleLayer.fontFamily === f.name
                            ? 'bg-rose-950/60 border-rose-500 text-white font-semibold'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary Subtitle */}
                <div className="pt-2 border-t border-neutral-800">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Subtitle / Kicker Line:
                  </label>
                  <input
                    type="text"
                    value={subtitleLayer.text}
                    onChange={(e) => setSubtitleLayer({ ...subtitleLayer, text: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. UNREAL ENGINE 5.5 · 4K HDR"
                  />
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-neutral-400">Subtitle Y-Position:</span>
                    <input
                      type="range"
                      min="40"
                      max="90"
                      value={subtitleLayer.y}
                      onChange={(e) => setSubtitleLayer({ ...subtitleLayer, y: Number(e.target.value) })}
                      className="w-32 accent-amber-500 h-1.5 bg-neutral-800 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Panel 2: Backdrop & Upload */}
            {activePanel === 'backdrop' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    Built-in 3D Cinematic Render Backdrops:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {CINEMATIC_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => setSelectedBg(bg.url)}
                        className={`group relative rounded-md overflow-hidden border transition-all aspect-video text-left ${
                          selectedBg === bg.url
                            ? 'border-rose-500 ring-2 ring-rose-500/30'
                            : 'border-neutral-800 hover:border-neutral-600'
                        }`}
                      >
                        <img
                          src={bg.url}
                          alt={bg.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                          <span className="text-[11px] font-bold text-white leading-tight">
                            {bg.name}
                          </span>
                          <span className="text-[9px] text-neutral-300">{bg.category}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Image Upload */}
                <div className="pt-2 border-t border-neutral-800">
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    Upload Your 3D Render (Blender / UE5):
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 border border-dashed border-neutral-700 hover:border-neutral-500 rounded-lg cursor-pointer bg-neutral-950/60 transition-colors">
                    <Upload className="w-5 h-5 text-neutral-400 mb-1.5" />
                    <span className="text-xs text-neutral-300 font-medium">Click to upload render image</span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">PNG, JPG, WebP up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {selectedBg === 'custom' && (
                    <div className="mt-2 text-[11px] text-rose-400 font-medium flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Custom render image is active
                    </div>
                  )}
                </div>

                {/* Color grading sliders */}
                <div className="pt-2 border-t border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Brightness</span>
                    <span className="text-neutral-300 font-mono">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-neutral-800 rounded"
                  />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Contrast</span>
                    <span className="text-neutral-300 font-mono">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="180"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-neutral-800 rounded"
                  />
                </div>
              </div>
            )}

            {/* Panel 3: Cinematic FX & LUT */}
            {activePanel === 'effects' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    Color Grading LUT Preset:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'teal_orange', name: 'Teal & Orange', desc: 'Hollywood Blockbuster' },
                      { id: 'cyber_neon', name: 'Cyber Neon', desc: 'Sci-Fi Synthwave' },
                      { id: 'golden_hour', name: 'Golden Hour', desc: 'Warm Mythic Glow' },
                      { id: 'dark_scifi', name: 'Dark Sci-Fi', desc: 'Moody Alien Deep' },
                      { id: 'bleach_bypass', name: 'Bleach Bypass', desc: 'High Contrast Grit' },
                      { id: 'none', name: 'Natural / Raw', desc: 'No Filter' },
                    ].map((lut) => (
                      <button
                        key={lut.id}
                        onClick={() => setLutFilter(lut.id as LutFilter)}
                        className={`p-2.5 text-left rounded-md border text-xs transition-colors ${
                          lutFilter === lut.id
                            ? 'bg-amber-950/40 border-amber-500 text-white font-semibold'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-white'
                        }`}
                      >
                        <div className="font-medium">{lut.name}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">{lut.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 space-y-3">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Cinematic Optical Overlays:
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-neutral-950 rounded border border-neutral-800 cursor-pointer">
                    <span className="text-xs text-neutral-200">2.39:1 Anamorphic Scope Letterbox Bars</span>
                    <input
                      type="checkbox"
                      checked={letterboxBars}
                      onChange={(e) => setLetterboxBars(e.target.checked)}
                      className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-neutral-950 rounded border border-neutral-800 cursor-pointer">
                    <span className="text-xs text-neutral-200">Anamorphic Blue Flare Streak</span>
                    <input
                      type="checkbox"
                      checked={anamorphicFlare}
                      onChange={(e) => setAnamorphicFlare(e.target.checked)}
                      className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-neutral-950 rounded border border-neutral-800 cursor-pointer">
                    <span className="text-xs text-neutral-200">High-Contrast Edge Vignette</span>
                    <input
                      type="checkbox"
                      checked={vignette}
                      onChange={(e) => setVignette(e.target.checked)}
                      className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-neutral-950 rounded border border-neutral-800 cursor-pointer">
                    <span className="text-xs text-neutral-200">Cinematic 35mm Film Grain</span>
                    <input
                      type="checkbox"
                      checked={filmGrain}
                      onChange={(e) => setFilmGrain(e.target.checked)}
                      className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Panel 4: Badges */}
            {activePanel === 'badges' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    Click to add High-CTR Proof Badges:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BADGE_PRESETS.map((badge, idx) => (
                      <button
                        key={idx}
                        onClick={() => addBadge(badge)}
                        className="px-2.5 py-1 text-xs rounded border border-white/20 hover:scale-105 active:scale-95 transition-transform font-bold text-white shadow-sm flex items-center gap-1"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        <Plus className="w-3 h-3" />
                        {badge.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800">
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    Active Badges ({stickers.length}):
                  </label>
                  {stickers.length === 0 ? (
                    <div className="text-xs text-neutral-500 py-3 text-center">
                      No badges on canvas. Click a badge above to add one.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {stickers.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between p-2 bg-neutral-950 rounded border border-neutral-800 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: st.bgColor }}
                            />
                            <span className="font-semibold text-white">{st.label}</span>
                          </div>
                          <button
                            onClick={() => removeBadge(st.id)}
                            className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
