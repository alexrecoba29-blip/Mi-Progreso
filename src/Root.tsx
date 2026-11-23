import React from 'react';
import {Composition} from 'remotion';
import {SomatropeShowcase} from './SomatropeShowcase';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SomatropeShowcase"
        component={SomatropeShowcase}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
