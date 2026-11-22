import {Composition} from 'remotion';
import {ReelEstancamiento, FPS, DURATION, WIDTH, HEIGHT} from './ReelEstancamiento';
import {BienvenidaComunidad, B_FPS, B_DURATION} from './BienvenidaComunidad';

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
    </>
  );
};
