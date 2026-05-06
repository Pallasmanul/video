import {makeProject} from '@motion-canvas/core';

import example from './scenes/example?scene';
import video0 from './video/video0?scene';

export default makeProject({
  experimentalFeatures: true,
  scenes: [video0],
});
