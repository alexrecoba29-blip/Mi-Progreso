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
export const C_FPS = 30;
export const C_DURATION = 780; // se ajusta al largo de voz-creatina.mp3

const sec = (s: number) => Math.round(s * C_FPS);
const hl = (t: string) => <span style={{color: RED}}>{t}</span>;

// ───────────── Escenas (frames) — ajustables con la voz real ─────────────
const S1 = {from: 0, dur: sec(5)}; //  gancho + MITO
const S2 = {from: sec(5), dur: sec(13)}; // 3 datos
const S3 = {from: sec(18), dur: C_DURATION - sec(18)}; // qué hacer + cierre

// ───────────── Subtítulos (afinar tiempos con la voz real) ─────────────
const CUES: Cue[] = [
  {start: sec(0.1), end: sec(1.8), text: <>¡Hey, soy {hl('Doc XT')}!</>},
  {start: sec(2.0), end: sec(4.8), text: <>¿La creatina te hace ver hinchado? {hl('¡Mito!')}</>},
  {start: sec(5.0), end: sec(9.0), text: <>El agua se queda {hl('dentro del músculo')}, no debajo de la piel.</>},
  {start: sec(9.2), end: sec(13.5), text: <>Mejora tu {hl('fuerza')} y tu rendimiento.</>},
  {start: sec(13.7), end: sec(18.0), text: <>Los estudios usan {hl('3 a 5 g')} al día, todos los días.</>},
  {start: sec(18.2), end: sec(21.0), text: <>Sin fase de carga, sin ciclos.</>},
  {start: sec(21.2), end: sec(24.0), text: <>Monohidrato, con sello de laboratorio, y constancia.</>},
  {start: sec(24.2), end: sec(26.0), text: <>Si tienes dudas de salud, consulta a tu médico.</>},
];

const OptionalVoice: React.FC = () => {
  const src = staticFile('voz-creatina.mp3');
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

// ───────────── Escena 1: gancho + MITO ─────────────
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSnap(4, 16);
  const stamp = useSnap(60, 10);
  const doc = useSnap(8, 22);
  const out = interpolate(frame, [S1.dur - 8, S1.dur], [1, 0], {extrapolateLeft: 'clamp'});
  const bob = Math.sin((frame / C_FPS) * Math.PI * 2) * 6;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div
        style={{
          position: 'absolute',
          top: SAFE.top + 40,
          left: SAFE.left,
          right: SAFE.right,
          textAlign: 'center',
          fontFamily: FONT,
          opacity: a,
          transform: `translateY(${interpolate(a, [0, 1], [40, 0])}px)`,
        }}
      >
        <div style={{fontSize: 130, color: WHITE, lineHeight: 1.02}}>¿LA CREATINA</div>
        <div style={{fontSize: 130, color: RED, lineHeight: 1.02}}>TE HINCHA?</div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 760,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: stamp,
          transform: `scale(${interpolate(stamp, [0, 1], [1.5, 1])}) rotate(-6deg)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 150,
            color: WHITE,
            backgroundColor: RED,
            padding: '6px 54px',
            letterSpacing: 6,
          }}
        >
          ¡MITO!
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1040,
          left: 0,
          right: 0,
          height: 680,
          display: 'flex',
          justifyContent: 'center',
          opacity: doc,
          transform: `translateY(${interpolate(doc, [0, 1], [80, 0]) + bob}px)`,
        }}
      >
        <Img src={staticFile('personaje/doc-xt-base.png')} style={{height: 680, objectFit: 'contain'}} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────── Escena 2: tres datos ─────────────
const Fact: React.FC<{n: string; big: string; small: string; delay: number}> = ({n, big, small, delay}) => {
  const p = useSnap(delay, 16);
  return (
    <div
      style={{
        backgroundColor: CARD,
        borderTop: `10px solid ${RED}`,
        padding: '30px 44px 36px',
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px)`,
      }}
    >
      <div style={{fontFamily: FONT, fontSize: 40, color: RED, letterSpacing: 6}}>DATO {n}</div>
      <div style={{fontFamily: FONT, fontSize: 86, color: WHITE, lineHeight: 1.04}}>{big}</div>
      <div style={{fontFamily: FONT, fontSize: 40, color: 'rgba(255,255,255,0.7)', letterSpacing: 2}}>{small}</div>
    </div>
  );
};

const Facts: React.FC = () => {
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
      <div style={{display: 'flex', flexDirection: 'column', gap: 34}}>
        <Fact n="1" big="EL AGUA QUEDA DENTRO DEL MÚSCULO" small="NO DEBAJO DE LA PIEL" delay={6} />
        <Fact n="2" big="MÁS FUERZA Y RENDIMIENTO" small="MUCHA EVIDENCIA CIENTÍFICA" delay={110} />
        <Fact n="3" big="3 A 5 G AL DÍA" small="TODOS LOS DÍAS · SIN FASE DE CARGA" delay={230} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────── Escena 3: qué hacer + cierre ─────────────
const Check: React.FC<{text: string; delay: number}> = ({text, delay}) => {
  const p = useSnap(delay, 14);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-50, 0])}px)`,
      }}
    >
      <div style={{width: 40, height: 40, backgroundColor: RED}} />
      <div style={{fontFamily: FONT, fontSize: 76, color: WHITE}}>{text}</div>
    </div>
  );
};

const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const btn = useSnap(110, 16);
  const foot = useSnap(130, 16);
  const pulse = 1 + 0.015 * Math.sin((frame / C_FPS) * Math.PI * 2);
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom + 100}px ${SAFE.left}px`,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 34}}>
        <div style={{fontFamily: FONT, fontSize: 44, color: RED, letterSpacing: 6}}>QUÉ HACER</div>
        <Check text="MONOHIDRATO" delay={4} />
        <Check text="CON SELLO DE LABORATORIO" delay={34} />
        <Check text="CONSTANCIA" delay={64} />
      </div>
      <div style={{marginTop: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
        <div
          style={{
            backgroundColor: RED,
            color: WHITE,
            fontFamily: FONT,
            fontSize: 70,
            letterSpacing: 2,
            padding: '30px 80px',
            borderRadius: 18,
            opacity: btn,
            transform: `scale(${pulse})`,
            boxShadow: '0 0 60px rgba(229,37,33,0.45)',
          }}
        >
          Consultar Asesoría
        </div>
        <div style={{fontFamily: FONT, fontSize: 44, color: 'rgba(255,255,255,0.75)', letterSpacing: 3, opacity: foot}}>
          Enlace en el perfil
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────── Composición ─────────────
export const ReelCreatina: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: BG}}>
    <Background />
    <OptionalVoice />
    <Sequence from={S1.from} durationInFrames={S1.dur} premountFor={15}>
      <Hook />
    </Sequence>
    <Sequence from={S2.from} durationInFrames={S2.dur} premountFor={15}>
      <Facts />
    </Sequence>
    <Sequence from={S3.from} durationInFrames={S3.dur} premountFor={15}>
      <Close />
    </Sequence>
    <Subtitles />
  </AbsoluteFill>
);
