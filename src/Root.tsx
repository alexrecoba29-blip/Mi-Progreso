import {Composition} from 'remotion';
import {ReelEstancamiento, FPS, DURATION, WIDTH, HEIGHT} from './ReelEstancamiento';
import {BienvenidaComunidad, B_FPS, B_DURATION} from './BienvenidaComunidad';
import {ReelCreatina, C_FPS, C_DURATION} from './ReelCreatina';
import {ReelMito, M_FPS, mitoDuration} from './ReelMito';
import {MITOS} from './mitos';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ReelEstancamiento"
        component={ReelEstancamiento}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="BienvenidaComunidad"
        component={BienvenidaComunidad}
        durationInFrames={B_DURATION}
        fps={B_FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ReelCreatina"
        component={ReelCreatina}
        durationInFrames={C_DURATION}
        fps={C_FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {Object.entries(MITOS).map(([id, cfg]) => (
        <Composition
          key={id}
          id={id}
          component={ReelMito}
          durationInFrames={mitoDuration(cfg)}
          fps={M_FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={cfg}
        />
      ))}
    </>
  );
};
