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
  OptionalGreeting,
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
export const C_DURATION = 830; // 27.7 s (voz 26.4 s + cierre)

const sec = (s: number) => Math.round(s * C_FPS);
const hl = (t: string) => <span style={{color: RED}}>{t}</span>;

// ───────────── Escenas (frames) — ajustables con la voz real ─────────────
const S1 = {from: 0, dur: sec(4.9)}; //  0–4.9 s gancho + MITO
const S2 = {from: sec(4.9), dur: sec(15.85) - sec(4.9)}; // 4.9–15.85 s datos
const S3 = {from: sec(15.85), dur: C_DURATION - sec(15.85)}; // 15.85 s–fin cierre

// ───────────── Subtítulos (afinar tiempos con la voz real) ─────────────
const CUES: Cue[] = [
  {start: sec(0.12), end: sec(1.5), text: <>¡Hey, soy {hl('Doc XT')}!</>},
  {start: sec(1.92), end: sec(4.55), text: <>¿La creatina te hace ver hinchado? {hl('¡Mito!')}</>},
  {start: sec(5.0), end: sec(6.8), text: <>El agua se queda {hl('dentro del músculo')},</>},
  {start: sec(6.94), end: sec(8.05), text: <>no debajo de la piel.</>},
  {start: sec(8.26), end: sec(9.95), text: <>Mejora tu {hl('fuerza')} y tu rendimiento,</>},
  {start: sec(10.04), end: sec(11.7), text: <>y es de lo más estudiado que hay.</>},
  {start: sec(11.92), end: sec(15.8), text: <>Los estudios usan {hl('3 a 5 g')} al día, todos los días.</>},
  {start: sec(15.94), end: sec(17.85), text: <>{hl('Sin fase de carga')}, sin ciclos.</>},
  {start: sec(18.0), end: sec(20.95), text: <>{hl('Monohidrato')}, con sello de laboratorio y constancia.</>},
  {start: sec(21.3), end: sec(23.5), text: <>Si tienes dudas de salud, consulta a tu {hl('médico')}.</>},
  {start: sec(23.72), end: sec(26.2), text: <>Asesoría {hl('XT LABS')}. Enlace en el perfil.</>},
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
  const stamp = useSnap(118, 10);
  const out = interpolate(frame, [S1.dur - 8, S1.dur], [1, 0], {extrapolateLeft: 'clamp'});
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
      <OptionalGreeting />
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
        <Fact n="1" big="EL AGUA QUEDA DENTRO DEL MÚSCULO" small="NO DEBAJO DE LA PIEL" delay={3} />
        <Fact n="2" big="MÁS FUERZA Y RENDIMIENTO" small="MUCHA EVIDENCIA CIENTÍFICA" delay={101} />
        <Fact n="3" big="3 A 5 G AL DÍA" small="TODOS LOS DÍAS" delay={213} />
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
  const btn = useSnap(236, 16);
  const foot = useSnap(280, 16);
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
        <div style={{fontFamily: FONT, fontSize: 44, color: RED, letterSpacing: 6}}>SIN FASE DE CARGA · SIN CICLOS</div>
        <Check text="MONOHIDRATO" delay={63} />
        <Check text="CON SELLO DE LABORATORIO" delay={87} />
        <Check text="CONSTANCIA" delay={127} />
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
