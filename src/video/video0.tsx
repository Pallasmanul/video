import { Circle, Code, lines, makeScene2D, Rect, SVG, Node, Path } from '@motion-canvas/2d';
import { all, createRef, Logger, waitFor, debug, createRefArray, loop, linear, waitUntil, range, chain, sequence } from '@motion-canvas/core';
import { Mouse, Paper, createMouseRef, Window, Slider, Container, createPageRef, Page, ATxt, PlainCode, CodeCursor, createCodeCursorRef, PyCode } from '../components';
import { BoxGeometry } from 'three';
import { CodeTerminal, createCodeTerminalRef } from '../components/CodeTerminal';
import { reveal } from '../components/Utils';

const Python_Buildin_Function = "abs() ailter() all() anext() any() ascii() bin() bool() breakpoint() bytearray() bytes() callback() chr() classmethod() compile() complex() delattr() dict() dir() divmod() \
enumerate() eval() exec() filter() float() format() frozenset() getattr() globals() hasattr() hash() help() hex() id() input() int() isinstance() issubclass() iter() \
len() list() locals() map() max() memoryview() min() next() object() oct() open() ord() pow() print() property() \
range() repr() reversed() round() set() setattr() slice() sorted() staticmethod() str() sum() super() tuple() type() vars() zip()";



export default makeScene2D(function* (view) {

    view.fill('#4d4c4c')
    const groupRef = createRef<Rect>()
    const logoRef = createRef<Node>()
    const codeRef = createRef<Code>()

    view.add(
        <Container
            label="Python"
            ref={groupRef}
            fill={'#1e1e1e'}
            children={
                <PyCode
                    lineHeight={'150%'}
                    offset={-1}
                    code={""}
                    ref={codeRef}
                    opacity={0}
                />
            }
            width={500}
            height={300}
            radius={16}
            opacity={1}
        >
        </Container>
    )

    view.add(
        <>
            <Node
                scale={1.3}
                position={[-160, -130]}
                opacity={1}
                ref={logoRef}
            >
                {/* 蓝色蛇形（左侧） */}
                <Path
                    data="M 84.932681,135.18387 H 71.069563 c 0,0 -12.102056,-2.15753 -14.314928,-20.14145 -2.212879,-17.983916 0.20655,-42.895863 16.302481,-42.895863 h 46.002444 l 0.0211,-3.751057 H 88.729648 V 52.478488 c 0,0 -0.910856,-10.320819 17.462632,-12.899847 18.37348,-2.579033 30.33748,0.899531 30.33748,0.899531 0,0 10.33229,1.359349 13.56741,12.54421 2.97721,10.293222 0.54527,35.152433 0.54527,35.152433 0,0 -2.05593,12.429655 -13.13485,13.182385 -10.35507,0.70355 -32.15593,0.61697 -34.96049,0.60266 -0.19605,-6.9e-4 -0.29927,-0.001 -0.29927,-0.001 -3.585029,0 -14.561783,2.99219 -17.209759,16.16312 -0.501702,2.49545 -0.105383,17.06252 -0.105383,17.06252 z"
                    fill="#306998"
                    stroke="#000000"
                    lineWidth={0.55}
                />
                {/* 黄色蛇形（右侧） */}
                <Path
                    data="m 155.06272,71.508313 h 13.86312 c 0,0 12.10206,2.157532 14.31493,20.141455 2.21288,17.983922 -0.20655,42.895862 -16.30248,42.895862 h -46.00245 l -0.0211,3.75106 h 30.35103 v 15.91701 c 0,0 0.91085,10.32082 -17.46264,12.89984 -18.37348,2.57904 -30.33748,-0.89953 -30.33748,-0.89953 0,0 -10.332287,-1.35935 -13.567405,-12.54421 -2.977215,-10.29322 -0.545274,-35.15243 -0.545274,-35.15243 0,0 2.055937,-12.42964 13.134849,-13.18237 10.35507,-0.70356 32.15593,-0.61698 34.96049,-0.60266 0.19605,6.9e-4 0.29928,0.001 0.29928,0.001 3.58503,0 14.56178,-2.9922 17.20975,-16.163143 0.50171,-2.49544 0.10539,-17.062519 0.10539,-17.062519 z"
                    fill="#ffd43b"
                    stroke="#000000"
                    lineWidth={0.55}
                />
                {/* 左眼（白色圆点） */}
                <Path
                    data="M 102.54,54.86 m -5.61,0 a 5.61,5.61 0 1,0 11.22,0 a 5.61,5.61 0 1,0 -11.22,0"
                    fill="#ffffff"
                    stroke="#000000"
                    lineWidth={0.2}
                />
                {/* 右眼（白色圆点） */}
                <Path
                    data="M 136.98,152.76 m -5.61,0 a 5.61,5.61 0 1,0 11.22,0 a 5.61,5.61 0 1,0 -11.22,0"
                    fill="#ffffff"
                    stroke="#000000"
                    lineWidth={0.2}
                />
            </Node>
        </>
    )

    yield* sequence(
        0.6,
        logoRef().opacity(0, 0.6),
        waitFor(1),
    );
    yield* all(
        groupRef().height(600, 0.6),
        codeRef().opacity(1, 0.6),
        codeRef().code("import()", 0.5),
    )
    yield* waitFor(0.5);
    yield* codeRef().code.append("\nabs()", 0.5);
    yield* waitFor(0.5);
    yield* codeRef().code.append("\nall()", 0.5);

    yield* waitFor(1);

});