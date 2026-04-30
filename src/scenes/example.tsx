import { Circle, Code, lines, makeScene2D, Rect, SVG, Node } from '@motion-canvas/2d';
import { all, createRef, Logger, waitFor, debug, createRefArray, loop, linear, waitUntil } from '@motion-canvas/core';
import { Mouse, Paper, createMouseRef, Window, Slider, Container, createPageRef, Page, ATxt, PyCode } from '../components';
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

  view.add(
    <>
      <Page
        component={PyCode}
        refs={pageRef}
        label={"main.py"}
        theme={{
          bg: '#2a2a2a',
          bgDark: '#333333',
          radius: 16,
        }}
        code={"print('hello world')"}
        width={500}
        height={0}
        radius={16}
        scale={1.5}
        opacity={0}
      />
    </>
  )

  yield* all(
    pageRef.rect.opacity(0).opacity(1, 1),
    pageRef.rect.height(0).height(600, 1),
  )

  yield* appendToCode("", pageRef)
  yield* appendToCode("for i in range(10): \n   print(i)", pageRef)


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

  yield* all(
    word_x_max_rectRef().opacity(0).opacity(1, 1),
    word_x_max_rectRef().y(80).y(0, 1),
    word_x_max_rectRef().scale(1).scale(1.8, 1),
  )


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
  //         opacity={1}
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