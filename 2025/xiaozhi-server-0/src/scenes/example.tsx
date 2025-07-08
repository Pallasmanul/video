import { Camera, Circle, Grid, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import { createRef, waitFor, createSignal, all, ThreadGenerator, spawn, loop, cancel, finishScene, join, waitUntil } from '@motion-canvas/core';



// 定义 Typescript 关键字数组
const keywords = [
  'abstract',
  'any',
  'as',
  'asserts',
  'async',
  'await',
  'boolean',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'constructor',
  'continue',
  'declare',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'final',
  'finally',
  'for',
  'from',
  'function',
];


// 随机颜色生成函数
const getRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');


export default makeScene2D(function* (view) {
  // 创建引用
  const camera = createRef<Camera>();

  // 创建颜色信号
  const backgroundColor = createSignal('#141414');
  const gridColor = createSignal('#2A2929FF');

  // 创建网格大小和信号间距
  const gridSize = createSignal(18);
  const gridSpacingX = createSignal(100);
  const gridSpacingY = createSignal(40);

  // 计算屏幕容量
  const viewSize = view.size();
  const cols = Math.floor(viewSize.width / gridSpacingX());
  const rows = Math.floor(viewSize.height / gridSpacingY());
  const total = cols * rows;

  // 复制关键字用于填满屏幕
  const repeatedKeywords = Array.from({ length: total }, (_, i) =>
    keywords[i % keywords.length]
  );

  // 创建中心文字引用
  const centerText = createRef<Txt>();

  // 创建旋转正方形引用
  const rotationControl = createSignal(0);
  const rotatingSquare = createRef<Rect>();

  // 创建背景颜色
  view.add(
    <Rect
      size={'100%'}
      fill={backgroundColor}
    />
  );

  view.add(
    <Rect
      ref={rotatingSquare}
      size={200}
      fill={'rgba(255, 255, 255, 0.1)'}
      position={0}
      rotation={0}
    />
  );


  // 添加中心文字
  view.add(
    <Txt
      ref={centerText}
      text={''}
      fontSize={120}
      fill={'#fff'}
      opacity={0}
      zIndex={10} // 确保在最上层
    />
  )

  // 添加网格
  view.add(
    <Camera
      ref={camera}
    >
      {repeatedKeywords.map((keyword, index) => {

        // 居中计算
        const totalWidth = cols * gridSpacingX();
        const totalHeight = rows * gridSpacingY();
        const startX = -totalWidth / 2 + gridSpacingX() / 2; // 水平居中起点
        const startY = -totalHeight / 2 + gridSpacingY() / 2; // 垂直居中起点

        const x = startX + (index % cols) * gridSpacingX() - gridSpacingX() / 2; // 水平居中
        const y = startY + Math.floor(index / cols) * gridSpacingY() - gridSpacingY() / 2; // 垂直居中
        return (
          <Txt
            key={String(index)}
            text={keyword}
            x={x + 50}
            y={y + 50}
            fill="#666"
            opacity={0}
            fontSize={gridSize()}
            textAlign="center" // 文本中心对齐
            fontWeight={40}
          />
        );
      })}
    </Camera>
  );


  let rotationTask: ThreadGenerator;

  yield* waitUntil('start_rotation');
  if (rotationTask) cancel(rotationTask);
  rotationTask =  spawn(loop(() => rotatingSquare().position.x(100, 3).to(-200, 3)));
  
  yield* all(
    //gridSpacing(100, 2),
    camera().zoom(1.5, 2),
  );


  yield* waitUntil('stop_rotation');
  cancel(rotationTask);













  yield* all(
    centerText().opacity(1, 1),
    centerText().text('var', 1),
    camera().zoom(1.5, 2),
  );

  yield* all(
    centerText().text('let', 0.5).wait(0.5),
    centerText().fill('#4EC5F8', 0.5) // 颜色变化
  );


  yield* all(
    centerText().text('const', 0.8).wait(0.5),
    centerText().fill('#FFFFFF', 0.8) // 颜色变化
  );

  // 最终淡出

  yield* centerText().opacity(0, 1);

  finishScene();

});