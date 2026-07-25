import { makeScene2D, Latex, Rect } from '@motion-canvas/2d';
import { waitFor, createRef } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
    const tex = createRef<Latex>();

    view.fill('#1e1e1e');

    view.add(
        <>
            view.add(<Latex ref={tex} tex="{{y=}}{{a}}{{x^2}}" fill="white" fontSize={48} scale={2} />);
        </>
    )
    yield* waitFor(2);
    yield* tex().tex('{{y=}}{{a}}{{x^2}} + {{bx}}', 1);
    yield* waitFor(2);
    yield* tex().tex('{{y=}}{{a}}{{x^2}} + {{bx}} + {{c}}', 1);
})