import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {
  Background,
  BG,
  CARD,
  FONT,
  OptionalGreeting,
  RED,
  SAFE,
  SUB_BOTTOM,
  WHITE,
  useFileExists,
  useSnap,
} from './ReelEstancamiento';

// Plantilla "Mito o Ciencia" · XT LABS · 1080x1920 · 30 fps.
// Marcado en textos: *texto* = rojo.

export const M_FPS = 30;

export type MitoProps = {
  voice: string; //        archivo en public/, ej. 'voz-proteina.mp3'
  greeting: string; //     archivo en public/, ej. 'doc-saludo-proteina.mp4'
  hook: [string, string]; // titular (línea blanca, línea roja)
  tag: string; //          sello: ¡MITO!, ¡OJO!…
  tagAt: number; //        segundo en que aparece el sello
  tagSize?: number;
  s1End: number; //        s: termina el gancho
  s2End: number; //        s: terminan los datos
  total: number; //        s: duración total del video
  facts: {big: string; small: string; at: number}[]; // at en segundos
  closeHeader: string;
  items: {text: string; at: number}[];
  buttonAt: number;
  footerAt: number;
  cues: {start: number; end: number; text: string}[]; // segundos
};

const f = (s: number) => Math.round(s * M_FPS);

export const mitoDuration = (p: MitoProps) => f(p.total);

const Markup: React.FC<{text: string}> = ({text}) => (
  <>
    {text.split('*').map((part, i) =>
      i % 2 === 1 ? (
        <span key={i} style={{color: RED}}>
          {part}
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </>
);

const OptionalVoice: React.FC<{file: string}> = ({file}) => {
  const src = staticFile(file);
  const exists = useFileExists(src);
  return exists ? <Audio src={src} /> : null;
};

const Subtitles: React.FC<{cues: MitoProps['cues']}> = ({cues}) => {
  const frame = useCurrentFrame();
  const cue = cues.find((c) => frame >= f(c.start) && frame < f(c.end));
  if (!cue) return null;
  const inP = interpolate(frame - f(cue.start), [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const outP = interpolate(frame, [f(cue.end) - 5, f(cue.end)], [1, 0], {extrapolateLeft: 'clamp'});
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
        <Markup text={cue.text} />
      </div>
    </AbsoluteFill>
  );
};

// ───── Escena 1: gancho + sello + Doc XT ─────
const Hook: React.FC<MitoProps> = (p) => {
  const frame = useCurrentFrame();
  const a = useSnap(4, 16);
  const stamp = useSnap(f(p.tagAt), 10);
  const out = interpolate(frame, [f(p.s1End) - 8, f(p.s1End)], [1, 0], {extrapolateLeft: 'clamp'});
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
        <div style={{fontSize: 104, color: WHITE, lineHeight: 1.04, whiteSpace: 'nowrap'}}>{p.hook[0]}</div>
        <div style={{fontSize: 104, color: RED, lineHeight: 1.04, whiteSpace: 'nowrap'}}>{p.hook[1]}</div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 780,
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
            fontSize: p.tagSize ?? 150,
            color: WHITE,
            backgroundColor: RED,
            padding: '6px 54px',
            letterSpacing: 6,
          }}
        >
          {p.tag}
        </div>
      </div>
      <OptionalGreeting file={p.greeting} />
    </AbsoluteFill>
  );
};

// ───── Escena 2: tres datos ─────
const Fact: React.FC<{n: number; big: string; small: string; delay: number}> = ({n, big, small, delay}) => {
  const q = useSnap(delay, 16);
  return (
    <div
      style={{
        backgroundColor: CARD,
        borderTop: `10px solid ${RED}`,
        padding: '28px 44px 34px',
        opacity: q,
        transform: `translateY(${interpolate(q, [0, 1], [50, 0])}px)`,
      }}
    >
      <div style={{fontFamily: FONT, fontSize: 38, color: RED, letterSpacing: 6}}>DATO {n}</div>
      <div style={{fontFamily: FONT, fontSize: 80, color: WHITE, lineHeight: 1.04}}>{big}</div>
      <div style={{fontFamily: FONT, fontSize: 38, color: 'rgba(255,255,255,0.7)', letterSpacing: 2}}>{small}</div>
    </div>
  );
};

const Facts: React.FC<MitoProps> = (p) => {
  const frame = useCurrentFrame();
  const dur = f(p.s2End) - f(p.s1End);
  const o = Math.min(
    interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [dur - 8, dur], [1, 0], {extrapolateLeft: 'clamp'}),
  );
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom + 120}px ${SAFE.left}px`,
        opacity: o,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
        {p.facts.map((x, i) => (
          <Fact key={i} n={i + 1} big={x.big} small={x.small} delay={Math.max(0, f(x.at - p.s1End))} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ───── Escena 3: qué hacer + cierre ─────
const Item: React.FC<{text: string; delay: number}> = ({text, delay}) => {
  const q = useSnap(delay, 14);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        opacity: q,
        transform: `translateX(${interpolate(q, [0, 1], [-50, 0])}px)`,
      }}
    >
      <div style={{width: 36, height: 36, backgroundColor: RED, flexShrink: 0}} />
      <div style={{fontFamily: FONT, fontSize: 64, color: WHITE, lineHeight: 1.05}}>{text}</div>
    </div>
  );
};

const Close: React.FC<MitoProps> = (p) => {
  const frame = useCurrentFrame();
  const btn = useSnap(f(p.buttonAt - p.s2End), 16);
  const foot = useSnap(f(p.footerAt - p.s2End), 16);
  const pulse = 1 + 0.015 * Math.sin((frame / M_FPS) * Math.PI * 2);
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom + 100}px ${SAFE.left}px`,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 30}}>
        <div style={{fontFamily: FONT, fontSize: 44, color: RED, letterSpacing: 6}}>{p.closeHeader}</div>
        {p.items.map((it, i) => (
          <Item key={i} text={it.text} delay={Math.max(0, f(it.at - p.s2End))} />
        ))}
      </div>
      <div style={{marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
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

export const ReelMito: React.FC<MitoProps> = (p) => (
  <AbsoluteFill style={{backgroundColor: BG}}>
    <Background />
    <OptionalVoice file={p.voice} />
    <Sequence from={0} durationInFrames={f(p.s1End)} premountFor={15}>
      <Hook {...p} />
    </Sequence>
    <Sequence from={f(p.s1End)} durationInFrames={f(p.s2End) - f(p.s1End)} premountFor={15}>
      <Facts {...p} />
    </Sequence>
    <Sequence from={f(p.s2End)} durationInFrames={f(p.total) - f(p.s2End)} premountFor={15}>
      <Close {...p} />
    </Sequence>
    <Subtitles cues={p.cues} />
  </AbsoluteFill>
);
