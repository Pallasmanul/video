import { Circle, Code, lines, makeScene2D, Rect, SVG, Node, Path } from '@motion-canvas/2d';
import { all, createRef, Logger, waitFor, debug, createRefArray, loop, linear, waitUntil, range } from '@motion-canvas/core';
import { Mouse, Paper, createMouseRef, Window, Slider, Container, createPageRef, Page, ATxt, PlainCode, CodeCurosr, CodeCursor, createCodeCursorRef } from '../components';
import { BoxGeometry } from 'three';

const Python_Buildin_Function = "abs() ailter() all() anext() any() ascii() bin() bool() breakpoint() bytearray() bytes() callback() chr() classmethod() compile() complex() delattr() dict() dir() divmod() \
enumerate() eval() exec() filter() float() format() frozenset() getattr() globals() hasattr() hash() help() hex() id() input() int() isinstance() issubclass() iter() \
len() list() locals() map() max() memoryview() min() next() object() oct() open() ord() pow() print() property() \
range() repr() reversed() round() set() setattr() slice() sorted() staticmethod() str() sum() super() tuple() type() vars() zip()";

export default makeScene2D(function* (view) {
  // Create your animations here
  const word_x_max_rectRef = createRef<Rect>()
  const textArrayRef = createRefArray<typeof ATxt>()
  const reactArrayRef = createRefArray<Rect>()
  const groupRef = createRef<Node>()
  const pageRef = createPageRef()

  view.fill('#1c1c1c')

  view.fill('#000000')

  view.add(
    <Container
      label="Python"
      ref={groupRef}
      fill={'#1e1e1e'}
      width={500}
      height={300}
      radius={16}
      opacity={0}
    >
    </Container>
  )

  view.add(
    <>
      <Node
        scale={1.3}
        position={[-200, -100]}
        opacity={0}
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

  yield* all(
    pageRef.rect.opacity(0).opacity(1, 1),
    pageRef.rect.height(0).height(600, 1),
  )

  yield* appendToCode("", pageRef)
  yield* appendToCode("for i in range(10): \n   print(i)", pageRef)




  const window = createRef<Window>();
  const border = createRef<Rect>();
  const panels = createRef<Rect>();
  const codeCursorRef = createCodeCursorRef();

  view.add(
    <>
      <Window
        ref={window}
        theme={{
          window: '#66615c',
          buttons: '#0f0d0c',
        }}
        x={-400}
        width={720}
        scale={0.9}
        direction={'column'}
        radius={8}
      >
        <Rect
          grow={1}
          ref={border}
          radius={[8, 8, 0, 8]}
          fill={"#100d0d"}
          clip
        >
          <Rect fill={"#050404"} ref={panels}>
            <CodeCursor refs={codeCursorRef} stroke={"#fff200"} lineWidth={4} marginLeft={12} marginTop={28 * 1.5 * 9 + 28 * 1.45} lineHeight={'150%'} fontSize={28} />
            <PlainCode
              fill={'#666'}
              marginTop={28}
              fontWeight={700}
              offset={-1}
              code={range(16)
                .map(i => i.toString().padStart(3, ' ') + ' ')
                .join('\n')}
            />
          </Rect>
        </Rect>
      </Window>
    </>
  )

  yield* codeCursorRef.bg()
    .marginTop(28 * 1.5 * 9 + 28 * 1.45)
    .marginTop(28 * 1.5 * 12 + 28 * 1.45, 1);

  yield* panels().size(200, 2 );


  view.add(
    <>
      <Rect
        x={0}
        y={0}
        ref={word_x_max_rectRef}
        layout={true}
        fill={'#2a2a2a'}
        stroke={'#ffffff'}
        lineWidth={2}
        opacity={0}
        paddingTop={7}
        paddingBottom={12}
        paddingLeft={12}
        paddingRight={12}
        radius={8}
      >
        <ATxt
          text={"printf()"}
          opacity={1}
        />
      </Rect>
    </>
  );













  // view.add(
  //   <Node ref={groupRef}>
  //     {Python_Buildin_Function.split(" ").map((word, index) => (
  //       <Rect
  //         ref={reactArrayRef}
  //         layout={true}
  //         fill={0.3}
  //         minWidth={word_x_max_rectRef().width()}
  //         minHeight={word_x_max_rectRef().height()}
  //         justifyContent="center"
  //         opacity={0}
  //         paddingTop={7}
  //         paddingBottom={12}
  //         paddingLeft={12}
  //         paddingRight={12}
  //         radius={8}
  //         offsetY={3}
  //         zIndex={-1}
  //       >
  //         <ATxt
  //           text={word}
  //           opacity={1}
  //         />
  //       </Rect>

  //     ))
  //     }
  //   </Node>
  // )


  // // 计算总宽度，实现均匀排列
  // const functions = Python_Buildin_Function.split(" ");
  // const itemsPerRow = 5; // 每行显示 5 个元素
  // const itemWidth = word_x_max_rectRef().width(); // 每个元素宽度
  // const itemHeight = word_x_max_rectRef().height(); // 每个元素高度
  // const gap = 40; // 元素间距

  // functions.forEach((word, index) => {
  //   if (reactArrayRef[index]) {
  //     // 计算行和列
  //     const row = Math.floor(index / itemsPerRow);
  //     const col = index % itemsPerRow;

  //     // 计算总宽度和总高度
  //     const totalRowWidth = itemsPerRow * (itemWidth + gap) - gap;
  //     const totalRows = Math.ceil(functions.length / itemsPerRow);
  //     const totalHeight = totalRows * (itemHeight + gap) - gap;

  //     // 计算起始位置，使整个网格居中
  //     const startX = -totalRowWidth / 2 + 100;
  //     const startY = -totalHeight / 2 + 400;

  //     // 计算当前元素的位置
  //     const x = startX + col * (itemWidth + gap);
  //     const y = startY + row * (itemHeight + gap);

  //     reactArrayRef[index].x(x);
  //     reactArrayRef[index].y(y);
  //   }
  // })




  // yield* waitFor(1);
  // const start = groupRef().y();
  // yield loop(() => groupRef().y(start).y(-6200, 16, linear));
  // yield* waitUntil('video')


  yield* waitFor(1);

});


function* appendToCode(
  code: string,
  page: typeof Page,
) {
  const previous = page.code.parsed();
  yield *page.code.code(`${previous}\n${code}`, 0.6) 
}