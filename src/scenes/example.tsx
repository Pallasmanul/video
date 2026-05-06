import { Circle, Code, lines, makeScene2D, Rect, SVG, Node, Path } from '@motion-canvas/2d';
import { all, createRef, Logger, waitFor, debug, createRefArray, loop, linear, waitUntil, range } from '@motion-canvas/core';
import { Mouse, Paper, createMouseRef, Window, Slider, Container, createPageRef, Page, ATxt, PlainCode, CodeCurosr, CodeCursor, createCodeCursorRef } from '../components';
import { BoxGeometry } from 'three';
import { CodeTerminal, createCodeTerminalRef } from '../components/CodeTerminal';

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
            <CodeCursor refs={codeCursorRef} stroke={"#fff200"} lineWidth={4} marginLeft={12} marginTop={28 * 1.5 * 15 + 28 * 1.3} lineHeight={'150%'} fontSize={28} />
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

  yield* panels().size(200, 2);
  yield* codeCursorRef.bg.y(12, 0.6);


  const codeTerminalRef = createCodeTerminalRef();
  view.add(
    <>
      <CodeTerminal refs={codeTerminalRef} fill={'#626262'} opacity={1} width={1200} height={300} />
    </>
  )
  codeTerminalRef.code.code("pallasmanul@pallasmanul:    HelloWorld!  ")
  yield* appendToCode("pallasmanul@pallasmanul: printf('Hello World!')", codeTerminalRef.code);

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
  code_text: string,
  code: typeof Code,
) {
  const previous = code.parsed();
  yield* code.code.append(`\n${code_text}`, 0.6)
}