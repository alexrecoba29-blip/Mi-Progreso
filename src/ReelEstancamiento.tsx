import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from 'remotion';
import {loadFont, fontFamily} from '@remotion/google-fonts/Anton';

loadFont();

// ───────────── Formato ─────────────
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 900; // 30 s

// ───────────── Marca ─────────────
const BG = '#0B0B0D';
const WHITE = '#FFFFFF';
const RED = '#E52521';
const CARD = '#16161B';
const FONT = `${fontFamily}, 'Bebas Neue', Impact, 'Arial Narrow', sans-serif`;

// ───────────── Zonas seguras de Instagram Reels ─────────────
// Arriba ~250 px (nombre de cuenta), abajo ~380 px (caption + botones), derecha ~120 px (like/comentar).
const SAFE = {top: 250, bottom: 380, left: 70, right: 120};
const SUB_BOTTOM = SAFE.bottom + 20; // distancia del subtítulo al borde inferior

// ───────────── Escenas (frames) ─────────────
const S1 = {from: 0, dur: 90}; //   0–3 s
const S2 = {from: 90, dur: 360}; //  3–15 s
const S3 = {from: 450, dur: 300}; // 15–25 s
const S4 = {from: 750, dur: 150}; // 25–30 s

// ───────────── Subtítulos (edítalos para que coincidan con tu voz) ─────────────
type Cue = {start: number; end: number; text: React.ReactNode};
const sec = (s: number) => Math.round(s * FPS);
const hl = (t: string) => <span style={{color: RED}}>{t}</span>;
const CUES: Cue[] = [
  {start: sec(0.3), end: sec(2.9), text: <>Entrenas fuerte… {hl('pero te ves igual.')}</>},
  {start: sec(3.4), end: sec(7.4), text: <>El estímulo en el gym está al {hl('95%')}.</>},
  {start: sec(7.6), end: sec(11.4), text: <>Pero tu recuperación apenas llega al {hl('35%')}.</>},
  {start: sec(11.6), end: sec(14.8), text: <>Y sin {hl('estrategia por fase')}, no hay resultado.</>},
  {start: sec(15.4), end: sec(19.8), text: <>{hl('Fuerza y desarrollo')}: una fase para construir.</>},
  {start: sec(20.2), end: sec(24.8), text: <>{hl('Definición y estética')}: otra para afinar.</>},
  {start: sec(25.4), end: sec(29.6), text: <>Consulta tu asesoría con {hl('XT LABS')}.</>},
];

// ───────────── Animaciones secas (sin rebote) ─────────────
const useSnap = (delay = 0, durationInFrames = 18) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, stiffness: 180, mass: 0.6},
    durationInFrames,
  });
};

// ───────────── Audio opcional (no falla si falta voz.mp3) ─────────────
const useFileExists = (src: string) => {
  const {delayRender, continueRender} = useDelayRender();
  const [handle] = useState(() => delayRender('Comprobando audio opcional'));
  const [exists, setExists] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(src, {method: 'HEAD'})
      .then((r) => {
        const type = r.headers.get('content-type') ?? '';
        if (!cancelled) setExists(r.ok && /audio|mpeg|octet-stream/i.test(type));
      })
      .catch(() => undefined)
      .finally(() => continueRender(handle));
    return () => {
      cancelled = true;
    };
  }, [src, handle, continueRender]);

  return exists;
};

const OptionalVoice: React.FC = () => {
  const src = staticFile('voz.mp3');
  const exists = useFileExists(src);
  return exists ? <Audio src={src} /> : null;
};

// ───────────── Fondo: negro mate + cuadrícula tech ─────────────
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.25) % 90;
  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          backgroundPosition: `0px ${drift}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(229,37,33,0.10) 0%, rgba(11,11,13,0) 55%), radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 60%)',
        }}
      />
    </AbsoluteFill>
  );
};

// ───────────── Escena 1: titular ─────────────
const Line: React.FC<{text: string; color: string; delay: number; size?: number}> = ({
  text,
  color,
  delay,
  size = 112,
}) => {
  const p = useSnap(delay, 16);
  return (
    <div style={{overflow: 'hidden', lineHeight: 1}}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: size,
          color,
          textTransform: 'uppercase',
          letterSpacing: 2,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          transform: `translateY(${interpolate(p, [0, 1], [110, 0])}%)`,
          opacity: p,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const barW = interpolate(useSnap(10, 20), [0, 1], [0, 260]);
  const out = interpolate(frame, [S1.dur - 8, S1.dur], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
        opacity: out,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center'}}>
        <div style={{height: 10, width: barW, backgroundColor: RED, marginBottom: 20}} />
        <Line text="Entrenas fuerte," color={WHITE} delay={6} />
        <Line text="Pero te ves igual" color={RED} delay={20} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────── Escena 2: barras + científico ─────────────
const Meter: React.FC<{label: string; value: number; color: string; delay: number}> = ({
  label,
  value,
  color,
  delay,
}) => {
  const enter = useSnap(delay, 14);
  const fill = useSnap(delay + 8, 60);
  const shown = Math.round(value * fill);
  return (
    <div style={{opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <span style={{fontFamily: FONT, fontSize: 54, color: WHITE, letterSpacing: 1.5}}>{label}</span>
        <span style={{fontFamily: FONT, fontSize: 78, color, fontVariantNumeric: 'tabular-nums'}}>
          {shown}%
        </span>
      </div>
      <div style={{height: 26, backgroundColor: 'rgba(255,255,255,0.10)', marginTop: 8}}>
        <div style={{height: '100%', width: `${value * fill}%`, backgroundColor: color}} />
      </div>
    </div>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const imgIn = useSnap(18, 24);
  const zoom = interpolate(frame, [0, S2.dur], [1, 1.08]);
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [S2.dur - 8, S2.dur], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut)}}>
      {/* Mitad inferior: científico con zoom suave */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: HEIGHT / 2 + 40,
          overflow: 'hidden',
          opacity: imgIn,
        }}
      >
        <Img
          src={staticFile('cientifico.png')}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 160,
            height: 820,
            transform: `translateX(-50%) scale(${zoom})`,
            transformOrigin: '50% 10%',
            objectFit: 'contain',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to bottom, ${BG} 0%, rgba(11,11,13,0) 22%, rgba(11,11,13,0) 70%, rgba(11,11,13,0.8) 100%)`,
          }}
        />
      </div>

      {/* Mitad superior: barras */}
      <div
        style={{
          position: 'absolute',
          top: SAFE.top,
          left: SAFE.left,
          right: SAFE.right,
          display: 'flex',
          flexDirection: 'column',
          gap: 44,
        }}
      >
        <div style={{fontFamily: FONT, fontSize: 44, color: RED, letterSpacing: 6}}>
          POR QUÉ NO AVANZAS
        </div>
        <Meter label="ESTÍMULO EN GYM" value={95} color={WHITE} delay={6} />
        <Meter label="RECUPERACIÓN" value={35} color={RED} delay={30} />
        <Meter label="ESTRATEGIA POR FASE" value={30} color={RED} delay={54} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────── Escena 3: tarjetas ─────────────
const PhaseCard: React.FC<{tag: string; title: string[]; litAt: number}> = ({tag, title, litAt}) => {
  const frame = useCurrentFrame();
  const enter = useSnap(litAt - 14, 16);
  const lit = interpolate(frame, [litAt, litAt + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        backgroundColor: CARD,
        borderTop: `10px solid ${RED}`,
        padding: '48px 48px 56px',
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(enter, [0, 1], [50, 0])}px)`,
        boxShadow: `0 0 ${70 * lit}px rgba(229,37,33,${0.55 * lit}), inset 0 0 0 2px rgba(229,37,33,${0.9 * lit})`,
        filter: `brightness(${0.55 + 0.45 * lit})`,
      }}
    >
      <div style={{fontFamily: FONT, fontSize: 40, color: RED, letterSpacing: 6, marginBottom: 14}}>
        {tag}
      </div>
      {title.map((t) => (
        <div key={t} style={{fontFamily: FONT, fontSize: 112, lineHeight: 1.02, color: WHITE}}>
          {t}
        </div>
      ))}
    </div>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [S3.dur - 8, S3.dur], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom + 140}px ${SAFE.left}px`,
        opacity: fadeOut,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: 48}}>
        <PhaseCard tag="FASE 1" title={['FUERZA Y', 'DESARROLLO']} litAt={20} />
        <PhaseCard tag="FASE 2" title={['DEFINICIÓN Y', 'ESTÉTICA']} litAt={130} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────── Escena 4: cierre ─────────────
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useSnap(4, 16);
  const btn = useSnap(26, 16);
  const foot = useSnap(44, 16);
  const pulse = 1 + 0.015 * Math.sin((frame / FPS) * Math.PI * 2);
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom + 100}px ${SAFE.left}px`,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 56}}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 250,
            lineHeight: 1,
            letterSpacing: 4,
            opacity: logo,
            transform: `scale(${interpolate(logo, [0, 1], [0.9, 1])})`,
          }}
        >
          <span style={{color: RED}}>XT</span> <span style={{color: WHITE}}>LABS</span>
        </div>
        <div
          style={{
            backgroundColor: RED,
            color: WHITE,
            fontFamily: FONT,
            fontSize: 70,
            letterSpacing: 2,
            padding: '34px 80px',
            borderRadius: 18,
            opacity: btn,
            transform: `translateY(${interpolate(btn, [0, 1], [40, 0])}px) scale(${pulse})`,
            boxShadow: '0 0 60px rgba(229,37,33,0.45)',
          }}
        >
          Consultar Asesoría
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 44,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: 3,
            opacity: foot,
          }}
        >
          Enlace en el perfil
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────── Subtítulos en zona segura ─────────────
const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = CUES.find((c) => frame >= c.start && frame < c.end);
  if (!cue) return null;
  const local = frame - cue.start;
  const inP = interpolate(local, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
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

// ───────────── Composición ─────────────
export const ReelEstancamiento: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      <Background />
      <OptionalVoice />
      <Sequence from={S1.from} durationInFrames={S1.dur} premountFor={15}>
        <Scene1 />
      </Sequence>
      <Sequence from={S2.from} durationInFrames={S2.dur} premountFor={15}>
        <Scene2 />
      </Sequence>
      <Sequence from={S3.from} durationInFrames={S3.dur} premountFor={15}>
        <Scene3 />
      </Sequence>
      <Sequence from={S4.from} durationInFrames={S4.dur} premountFor={15}>
        <Scene4 />
      </Sequence>
      <Subtitles />
    </AbsoluteFill>
  );
};
