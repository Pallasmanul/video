import { Layout } from "@motion-canvas/2d";
import { all, easeOutCubic, TimingFunction } from "@motion-canvas/core";


function* reveal(
  rect: Layout,
  time = 0.3,
  timingFunction: TimingFunction = easeOutCubic,
) {
  const padding = rect.padding();
  rect.padding(20).height(null);
  const height = rect.height();
  rect.padding(padding).height(0);

  yield* all(
    rect.height(height, time, timingFunction),
    rect.padding(20, time, timingFunction),
  );

  rect.height(null);
}
