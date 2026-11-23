import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const BG = '#070B09';
const EMERALD = '#10B981';
const SILVER = '#C9D1CE';

// Image is 1080x1350; the box itself spans x 57..1023, y 265..1066 (white bg around it).
const IMG_W = 1080;
const IMG_H = 1350;
const BOX = {left: 57, right: 1023, top: 265, bottom: 1066};
const BOX_W = BOX.right - BOX.left;
const BOX_H = BOX.bottom - BOX.top;

const PARTICLES = 28;

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();

  const items = useMemo(
    () =>
      new Array(PARTICLES).fill(0).map((_, i) => ({
        x: random(`x${i}`) * width,
        y: random(`y${i}`) * height,
        size: 2 + random(`s${i}`) * 4,
        speed: 40 + random(`v${i}`) * 90, // px over the whole video
        drift: (random(`d${i}`) - 0.5) * 60,
        phase: random(`p${i}`) * Math.PI * 2,
        alpha: 0.12 + random(`a${i}`) * 0.28,
        silver: random(`c${i}`) > 0.55,
      })),
    [width, height],
  );

  const t = frame / durationInFrames;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {items.map((p, i) => {
        const y = p.y - p.speed * t;
        const x = p.x + p.drift * t + Math.sin(frame / 40 + p.phase) * 12;
        const twinkle = 0.6 + 0.4 * Math.sin(frame / 25 + p.phase);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.silver ? SILVER : EMERALD,
              opacity: p.alpha * twinkle,
              filter: `blur(${p.size > 4 ? 1.5 : 0.5}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const SomatropeShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width, height} = useVideoConfig();

  // Breathing glow
  const breathe = Math.sin((frame / fps) * ((Math.PI * 2) / 4)); // 4s cycle
  const glowOpacity = 0.5 + breathe * 0.12;
  const glowScale = 1 + breathe * 0.06;

  // Product: slow zoom 0.92 -> 1.02 over whole video + soft fade-in
  const scale = interpolate(frame, [0, durationInFrames], [0.92, 1.02], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const enter = interpolate(frame, [0, 24], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });
  const floatY = Math.sin((frame / fps) * ((Math.PI * 2) / 3.5)) * 8;

  // Display size: box fills ~86% of width, centered
  const displayScale = (width * 0.86) / BOX_W;
  const boxW = BOX_W * displayScale;
  const boxH = BOX_H * displayScale;
  const imgW = IMG_W * displayScale;
  const imgH = IMG_H * displayScale;

  // Light sweep between 2s and 4s
  const sweep = interpolate(frame, [2 * fps, 4 * fps], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sweepVisible = frame >= 2 * fps && frame <= 4 * fps;
  const sweepX = interpolate(sweep, [0, 1], [-boxW * 0.6, boxW * 1.2]);
  const sweepOpacity = interpolate(sweep, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      {/* Radial glow */}
      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          transform: `scale(${glowScale})`,
          background: `
            radial-gradient(ellipse 62% 36% at 50% 50%, ${EMERALD}88 0%, ${EMERALD}33 42%, transparent 72%),
            radial-gradient(ellipse 48% 28% at 50% 50%, ${SILVER}2e 0%, transparent 70%)
          `,
        }}
      />

      <Particles />

      {/* Product group */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: enter,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: boxW,
            height: boxH,
            transform: `translateY(${floatY}px) scale(${scale})`,
          }}
        >
          {/* Realistic shadow beneath */}
          <div
            style={{
              position: 'absolute',
              left: '6%',
              right: '6%',
              bottom: -boxH * 0.08,
              height: boxH * 0.12,
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(18px)',
              transform: `scaleX(${1 - floatY * 0.004})`,
              opacity: 0.9 - floatY * 0.02,
            }}
          />
          {/* Emerald ambient bounce behind */}
          <div
            style={{
              position: 'absolute',
              inset: -30,
              borderRadius: 28,
              boxShadow: `0 40px 120px -20px ${EMERALD}33, 0 30px 80px rgba(0,0,0,0.6)`,
            }}
          />
          {/* Box (original image, cropped to box edges, no distortion) */}
          <div
            style={{
              position: 'relative',
              width: boxW,
              height: boxH,
              overflow: 'hidden',
              borderRadius: 6 * displayScale,
            }}
          >
            <Img
              src={staticFile('somatrope.png')}
              style={{
                position: 'absolute',
                width: imgW,
                height: imgH,
                left: -BOX.left * displayScale,
                top: -BOX.top * displayScale,
                maxWidth: 'none',
              }}
            />
            {/* Light sweep */}
            {sweepVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: '-20%',
                  bottom: '-20%',
                  left: 0,
                  width: boxW * 0.28,
                  transform: `translateX(${sweepX}px) rotate(18deg)`,
                  opacity: sweepOpacity,
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.0) 10%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.0) 90%, transparent 100%)',
                  mixBlendMode: 'soft-light',
                  filter: 'blur(6px)',
                }}
              />
            )}
            {sweepVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: '-20%',
                  bottom: '-20%',
                  left: 0,
                  width: boxW * 0.1,
                  transform: `translateX(${sweepX + boxW * 0.09}px) rotate(18deg)`,
                  opacity: sweepOpacity * 0.7,
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                  filter: 'blur(4px)',
                }}
              />
            )}
          </div>
        </div>
      </AbsoluteFill>

      {/* Soft vignette keeps top/bottom clean for text */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 50%, transparent 55%, ${BG} 100%)`,
          opacity: 0.8,
        }}
      />
    </AbsoluteFill>
  );
};
