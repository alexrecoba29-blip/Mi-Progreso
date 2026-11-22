import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  Background,
  BG,
  CARD,
  FONT,
  RED,
  SAFE,
  SUB_BOTTOM,
  WHITE,
  useFileExists,
  useSnap,
  type Cue,
} from './ReelEstancamiento';

// ───────────── Formato ─────────────
export const B_FPS = 30;
export const B_DURATION = 690; // 23 s (ajusta al largo de voz-bienvenida.mp3)

const sec = (s: number) => Math.round(s * B_FPS);
const hl = (t: string) => <span style={{color: RED}}>{t}</span>;

// ───────────── Escenas (frames) — ajustables con la voz real ─────────────
const S1 = {from: 0, dur: sec(5)}; //   bienvenida
const S2 = {from: sec(5), dur: sec(10)}; // 3 pilares
const S3 = {from: sec(15), dur: B_DURATION - sec(15)}; // sígueme + cierre

// ───────────── Subtítulos (afinar tiempos con la voz real) ─────────────
const CUES: Cue[] = [
  {start: sec(0.2), end: sec(2.2), text: <>¡Hey! ¡Bienvenido a {hl('XT LABS')}!</>},
  {start: sec(2.4), end: sec(4.6), text: <>Soy {hl('Doc XT')}. Aquí no hay mitos ni humo.</>},
  {start: sec(5.0), end: sec(9.0), text: <>Te explico {hl('nutrición')}, {hl('entrenamiento')}…</>},
  {start: sec(9.2), end: sec(12.0), text: <>…y {hl('farmacología deportiva')}.</>},
  {start: sec(12.2), end: sec(14.8), text: <>Todo con ciencia. Todo educativo.</>},
  {start: sec(15.2), end: sec(19.0), text: <>Sígueme, activa las notificaciones y mándame tus dudas.</>},
  {start: sec(19.4), end: sec(22.5), text: <>¡Bienvenido al {hl('laboratorio')}!</>},
];

const OptionalVoice: React.FC = () => {
  const src = staticFile('voz-bienvenida.mp3');
  const exists = useFileExists(src);
  return exists ? <Audio src={src} /> : null;
};

const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = CUES.find((c) => frame >= c.start && frame < c.end);
  if (!cue) return null;
  const inP = interpolate(frame - cue.start, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const outP = interpolate(frame, [cue.end - 5, cue.end], [1, 0], {extrapolateLeft: 'clamp'});
  const o = Math.min(inP, outP);
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: SUB_BOTTOM,
        paddingLeft: SAFE.left,
        paddingRight: SAFE.right,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 62,
          lineHeight: 1.12,
          color: WHITE,
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: 1,
          backgroundColor: 'rgba(11,11,13,0.82)',
          padding: '16px 30px',
          borderRadius: 12,
          opacity: o,
          transform: `translateY(${interpolate(o, [0, 1], [14, 0])}px)`,
        }}
      >
        {cue.text}
      </div>
    </AbsoluteFill>
  );
};

// ───────────── Escena 1: bienvenida ─────────────
const Welcome: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSnap(4, 16);
  const b = useSnap(16, 16);
  const doc = useSnap(10, 22);
  const out = interpolate(frame, [S1.dur - 8, S1.dur], [1, 0], {extrapolateLeft: 'clamp'});
  const bob = Math.sin((frame / B_FPS) * Math.PI * 2) * 6;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div
        style={{
          position: 'absolute',
          top: SAFE.top + 60,
          left: SAFE.left,
          right: SAFE.right,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 96,
            color: WHITE,
            letterSpacing: 8,
            opacity: a,
            transform: `translateY(${interpolate(a, [0, 1], [40, 0])}px)`,
          }}
        >
          BIENVENIDO A
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 240,
            lineHeight: 1,
            letterSpacing: 4,
            opacity: b,
            transform: `scale(${interpolate(b, [0, 1], [0.9, 1])})`,
          }}
        >
          <span style={{color: RED}}>XT</span> <span style={{color: WHITE}}>LABS</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1010,
          left: 0,
          right: 0,
          height: 700,
          display: 'flex',
          justifyContent: 'center',
          opacity: doc,
          transform: `translateY(${interpolate(doc, [0, 1], [80, 0]) + bob}px)`,
        }}
      >
        <Img src={staticFile('personaje/doc-xt-base.png')} style={{height: 700, objectFit: 'contain'}} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────── Escena 2: tres pilares ─────────────
const Pillar: React.FC<{n: string; title: string; sub: string; delay: number}> = ({n, title, sub, delay}) => {
  const p = useSnap(delay, 16);
  return (
    <div
      style={{
        backgroundColor: CARD,
        borderLeft: `12px solid ${RED}`,
        padding: '34px 44px',
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-70, 0])}px)`,
      }}
    >
      <div style={{fontFamily: FONT, fontSize: 110, color: RED, lineHeight: 1}}>{n}</div>
      <div>
        <div style={{fontFamily: FONT, fontSize: 84, color: WHITE, lineHeight: 1.05}}>{title}</div>
        <div style={{fontFamily: FONT, fontSize: 40, color: 'rgba(255,255,255,0.7)', letterSpacing: 2}}>{sub}</div>
      </div>
    </div>
  );
};

const Pillars: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [S2.dur - 8, S2.dur], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom + 120}px ${SAFE.left}px`,
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      <div style={{fontFamily: FONT, fontSize: 44, color: RED, letterSpacing: 6, marginBottom: 36}}>
        AQUÍ APRENDES
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 34}}>
        <Pillar n="01" title="NUTRICIÓN" sub="COME CON ESTRATEGIA" delay={6} />
        <Pillar n="02" title="ENTRENAMIENTO" sub="TRAIN SMART, NO SOLO DURO" delay={60} />
        <Pillar n="03" title="FARMACOLOGÍA" sub="EDUCACIÓN Y RIESGOS" delay={115} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────── Escena 3: sígueme + cierre ─────────────
const Follow: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useSnap(2, 16);
  const btn = useSnap(24, 16);
  const foot = useSnap(60, 16);
  const pulse = 1 + 0.015 * Math.sin((frame / B_FPS) * Math.PI * 2);
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom + 100}px ${SAFE.left}px`,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50}}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 130,
            lineHeight: 1.02,
            color: WHITE,
            textAlign: 'center',
            opacity: t,
            transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`,
          }}
        >
          SÍGUEME Y <span style={{color: RED}}>ACTIVA</span>
          <br />
          LAS NOTIFICACIONES
        </div>
        <div
          style={{
            backgroundColor: RED,
            color: WHITE,
            fontFamily: FONT,
            fontSize: 74,
            letterSpacing: 2,
            padding: '34px 90px',
            borderRadius: 18,
            opacity: btn,
            transform: `translateY(${interpolate(btn, [0, 1], [40, 0])}px) scale(${pulse})`,
            boxShadow: '0 0 60px rgba(229,37,33,0.45)',
          }}
        >
          Únete a la comunidad
        </div>
        <div style={{fontFamily: FONT, fontSize: 52, color: WHITE, letterSpacing: 3, opacity: foot}}>
          ¡BIENVENIDO AL <span style={{color: RED}}>LABORATORIO</span>!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────── Composición ─────────────
export const BienvenidaComunidad: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: BG}}>
    <Background />
    <OptionalVoice />
    <Sequence from={S1.from} durationInFrames={S1.dur} premountFor={15}>
      <Welcome />
    </Sequence>
    <Sequence from={S2.from} durationInFrames={S2.dur} premountFor={15}>
      <Pillars />
    </Sequence>
    <Sequence from={S3.from} durationInFrames={S3.dur} premountFor={15}>
      <Follow />
    </Sequence>
    <Subtitles />
  </AbsoluteFill>
);
