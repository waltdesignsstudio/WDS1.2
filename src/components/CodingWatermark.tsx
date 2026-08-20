import React from 'react';

export const CodingWatermark: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Subtle matrix gradient & dots */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.12),transparent)]"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>

      {/* Floating Syntax Code Snippets (Translucent Watermark) */}
      <div className="absolute top-12 left-4 md:left-16 max-w-lg opacity-[0.07] md:opacity-[0.11] font-mono text-xs md:text-sm text-cyan-300 leading-relaxed transform -rotate-2">
        <pre>{`// Walt Engineering Suite v3.2
import { buildZeroLagArchitecture } from '@walt/core';
import { optimizeATSCompatibility } from '@walt/resume';

export const initAgencyStack = async (clientConfig) => {
  const pipeline = await buildZeroLagArchitecture({
    renderSpeed: 'sub-50ms',
    cachingStrategy: 'edge-multi-region',
    lcpThreshold: 0.8,
    seoGroundwork: true
  });

  return pipeline.deploy({
    targetRegion: ['NCR_DELHI', 'WEST_BENGAL', 'PAN_INDIA'],
    clientSatisfaction: 0.999
  });
};`}</pre>
      </div>

      <div className="absolute top-28 right-4 md:right-16 max-w-md opacity-[0.06] md:opacity-[0.10] font-mono text-xs text-amber-300 leading-relaxed transform rotate-1 hidden sm:block">
        <pre>{`// Algorithmic CTR & Video Pipeline
interface ThumbnailSpecs {
  contrastRatio: number;
  focalHeatmapScore: number;
  clickThroughDelta: '+45%';
}

const renderCinematicAssets = (timeline: VideoTrack) => {
  timeline.applyColorGrade('Cinematic_Kodak_V2');
  timeline.insertDynamicSubtitles({ font: 'Syne', punchiness: 10 });
  return timeline.export4K({ bitrate: 'VBR_2Pass' });
};`}</pre>
      </div>

      <div className="absolute bottom-16 left-1/4 max-w-xl opacity-[0.05] md:opacity-[0.09] font-mono text-xs text-emerald-300 leading-relaxed transform -rotate-1 hidden lg:block">
        <pre>{`// Realtime GMB & Business Schema Optimization
const deployLocalDomination = async () => {
  const schema = generateGeoSchema({
    headquarters: 'West Bengal, India',
    nodes: ['Delhi', 'Noida', 'Faridabad'],
    msmeVerified: true
  });
  await GoogleMapsAPI.syncRankingMetrics(schema);
};`}</pre>
      </div>

      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full"></div>
      <div className="absolute top-2/3 right-10 w-[400px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
    </div>
  );
};
