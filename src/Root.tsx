import {Composition} from 'remotion';
import {ReelEstancamiento, FPS, DURATION, WIDTH, HEIGHT} from './ReelEstancamiento';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ReelEstancamiento"
      component={ReelEstancamiento}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
