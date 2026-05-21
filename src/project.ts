import {makeProject} from '@motion-canvas/core';

import example from './scenes/example?scene';
import lianjimini_esp_web from './scenes/lianjimini_esp_web?scene';
import video0 from './video/video0?scene';
import video1 from './video/video1?scene';

export default makeProject({
  experimentalFeatures: true,
  scenes: [video0, video1, lianjimini_esp_web],
});
