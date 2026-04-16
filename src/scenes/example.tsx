import { Circle, makeScene2D } from '@motion-canvas/2d';
import { createRef, waitFor } from '@motion-canvas/core';
import { Mouse, Paper, createMouseRef, Window, Slider, Container } from '../components';



export default makeScene2D(function* (view) {
  // Create your animations here

  const circle = createRef<Circle>();
  const mouse = createMouseRef();
  const window = createRef<Window>();

  view.add(
    <>
      <Container
        x={-620}
        label="PARALLAX SCROLLING"
        fill={0.3}
        y={80}
        opacity={1}
      ></Container>
    </>

  );

  yield* waitFor(3);
});
