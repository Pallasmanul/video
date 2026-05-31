import { Circle, Code, lines, makeScene2D, Rect, SVG, Node, Path, Layout, Txt } from '@motion-canvas/2d';
import { all, createRef, Logger, waitFor, debug, createRefArray, loop, linear, waitUntil, range, chain, sequence, easeInOutCubic, createSignal, createComputed, run, join, tween, createEffect, spawn, makeRefs, useRandom } from '@motion-canvas/core';
import { Mouse, Paper, createMouseRef, Window, Slider, Container, createPageRef, Page, ATxt, PlainCode, CodeCursor, createCodeCursorRef, PyCode, ProgressBar } from '../components';
import { BoxGeometry } from 'three';
import { CodeTerminal, createCodeTerminalRef } from '../components/CodeTerminal';
import { reveal } from '../components/Utils';
import { FunctionDoc, createFunctionDocRef } from '../components/FunctionDoc';
import { LibDoc, createLibDocRef } from '../components/LibDoc';

export default makeScene2D(function* (view) {

    view.fill('#0f0f0f');


    const titleRectRef = createRef<Rect>()
    const titleRef = createRef<Node>()
    const logoRef = createRef<Node>()

    view.add(
        <>
            <Rect fill={'#4b4b4b'} opacity={1} width={0} height={100} radius={16} x={0} y={0} direction={'column'} ref={titleRectRef}
                padding={40}
                gap={20}
                scale={1.3}
                layout>

                <Rect layout={false}>
                    <Node
                        scale={0.3}
                        position={[60, -30]}
                        opacity={0}
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
                </Rect>
                <Txt
                    lineHeight={60}
                    marginTop={-20}
                    fontFamily={'JetBrains Mono'}
                    fontWeight={700}
                    fontSize={38}
                    fill={'rgb(234, 234, 234)'}
                    ref={titleRef}
                    opacity={0}
                >
                    {"Pathlib"}
                </Txt>
            </Rect>
        </>
    )

    yield* all(
        titleRectRef().width(250, 0.6),
        titleRef().opacity(1, 0.6),
    )

    yield* waitUntil('click1')

    yield* all(
        titleRectRef().width(300, 0.6),
        logoRef().opacity(1, 0.6),
    )

    const libDocRef = createLibDocRef();

    view.add(
        <LibDoc
            refs={libDocRef}
            libName="pathlib"
            description="pathlib 是 Python 3.4+ 引入的标准库，提供面向对象的文件系统路径操作接口，让文件路径处理更加直观和优雅。"
            features={[
                '面向对象的路径表示，支持链式调用',
                '跨平台兼容性，自动处理路径分隔符',
                '内置多种文件操作方法（创建、删除、重命名等）',
                '支持路径拼接、解析、比较等操作',
                '与 os 模块相比，代码更简洁易读',
            ]}
            examples={[
                'from pathlib import Path',
                '# 创建路径对象',
                'p = Path("/home/user/docs")',
                '# 路径拼接',
                'file_path = p / "report.txt"',
                '# 检查路径是否存在',
                'if file_path.exists():',
                '    print("文件存在")',
                '# 获取文件大小',
                'size = file_path.stat().st_size',
            ]}
            x={0}
            y={0}
            radius={16}
            opacity={0}
        />
    );


    yield* all(
        titleRectRef().size(libDocRef.rect.size(), 0.6),
        logoRef().opacity(0, 0.6),
        titleRef().opacity(0, 0.6),
        titleRectRef().opacity(0, 0.6),
        libDocRef.rect.opacity(1, 0.6),
    );

    const pageRef = createPageRef();
    const codecursorref = createCodeCursorRef();
    const highlightLine = createRef<Rect>();
    // 创建行号数量的信号，支持动态修改
    const lineCount = createSignal(0);

    // 根据行号数量动态生成行号代码
    const lineNumbers = createComputed(() => {
        return range(lineCount())
            .map(i => (i + 1).toString().padStart(3, ' ') + ' ')
            .join('\n');
    });


    view.add(
        <>
            <Node>
                <Page
                    refs={pageRef}
                    x={-400}
                    label="main.py"
                    opacity={0}
                    theme={{
                        bg: '#1e1e1e',
                        bgDark: '#0f0d0c',
                        radius: 16,
                    }}
                    height={900}
                    width={800}
                    component={PyCode}
                    code={"# 导入 pathlib"}
                >
                </Page>
            </Node>
        </>
    )


    // 获取代码第 2 行（索引为 1）开头的位置
    const targetLine = createSignal(1)


    // 获取该行的世界坐标位置
    const linePosition = createComputed(() => {
        const line = targetLine();
        // 使用 getPointBBox 获取特定位置的边界框
        const pointBBox = () => pageRef.code.getPointBBox([line, 0]);
        return pageRef.code.localToWorld().transformPoint(pointBBox().position)
    }
    );

    // 计算高亮矩形的位置和大小
    const highlightRectProps = createComputed(() => {
        const line = targetLine();
        // 使用 getPointBBox 获取当前行开头的位置
        const pointBBox = pageRef.code.getPointBBox([line, 0]);
        const worldPos = pageRef.code.localToWorld().transformPoint(pointBBox.position);
        // 基于 Page 组件的 lineHeight='150%' 和字体大小计算行高
        const baseFontSize = 24;
        const lineHeight = baseFontSize * 1.5; // 150% 的行高
        return {
            position: worldPos,
            width: pageRef.rect.width() - 160,
            height: lineHeight,
        };
    });

    view.add(
        <>
            <CodeCursor
                refs={codecursorref}
                opacity={0}
                absolutePosition={() => {
                    const line = targetLine();
                    // 使用 getPointBBox 获取特定位置的边界框
                    const pointBBox = () => pageRef.code.getPointBBox([line, 0]);
                    return pageRef.code.localToWorld().transformPoint(pointBBox().position)
                }}
                offset={[7, -2]}
                layout={false}
            />
            <PlainCode
                x={-350}
                y={60}
                fill={'#666'}
                fontWeight={700}
                absolutePosition={() => {
                    const line = 1;
                    const pointBBox = () => pageRef.code.getPointBBox([line, 0]);
                    return pageRef.code.localToWorld().transformPoint(pointBBox().position)
                }}
                code={lineNumbers}
                offset={[1, -1]}
            />
            {/* 行背景高亮矩形 */}
            <Rect
                ref={highlightLine}
                stroke="#515151"
                lineWidth={2}
                opacity={0}
                absolutePosition={() => highlightRectProps().position}
                width={() => highlightRectProps().width}
                height={() => highlightRectProps().height}
                offset={[-1, -1]}
                layout={false}
            />
        </>
    );
    yield* codecursorref.dot.opacity(0, 0);

    // createEffect(() => {
    //     const currentLine = targetLine();
    //     // 模拟代码执行的终端输出
    //     switch (currentLine) {
    //         case 2:
    //             spawn(function* () {
    //                 yield* appendToCode("pallasmanul@~: 10", codeTerminalRef.code);
    //             });
    //             break;
    //     }
    // });
    // 创建指针跳转动画函数
    function* cursorJumpAnimation() {
        const targetRanges = [[1, 3]]; // 指针跳转的行序列

        for (const [start, end] of targetRanges) {
            // 遍历当前范围内的每一行
            for (let line = start; line <= end; line++) {
                yield* tween(0.2, (value) => {
                    const easedValue = easeInOutCubic(value);
                    const current = targetLine();
                    const next = line;
                    targetLine(Math.round(current + (next - current) * easedValue));
                });
            }
        }
        targetLine(1);
    }

    //    创建循环动画
    yield loop(function* () {
        yield* cursorJumpAnimation();
    });




    yield* waitUntil('click2')

    yield* all(
        libDocRef.rect.opacity(0, 0.6),
        libDocRef.rect.size(pageRef.rect.size(), 0.6),
        libDocRef.rect.position(pageRef.rect.position(), 0.6),
        pageRef.rect.opacity(1, 0.6),
    );

    yield* all(
        lineCount(2, 0.1),
        typeCodeEffect(pageRef.code, '\nfrom pathlib import Path'),
    );


    yield* waitFor(3);

})


function* appendToCode(
    code_text: string,
    code: typeof Code,
) {
    const previous = code.parsed();
    yield* code.code.append(`${code_text}\n`, 0.1)
}

// 实现逼真的逐字符代码输入效果
function* typeCodeEffect(
    code: typeof Code,
    text: string,
    cursorRef?: { dot: { opacity: (value: number, duration?: number) => ThreadGenerator } },
) {
    const random = useRandom();

    for (const char of text) {
        // 追加一个字符
        yield* code.code.append(char, 0);

        // 如果有光标引用，显示光标
        if (cursorRef) {
            cursorRef.dot.opacity(1, 0.05);
        }

        // 随机延迟，模拟真实打字速度
        const delay = random.nextFloat(0.03, 0.12);
        yield* waitFor(delay);

        // 光标闪烁效果
        if (cursorRef) {
            cursorRef.dot.opacity(0, 0.05);
            yield* waitFor(0.05);
            cursorRef.dot.opacity(1, 0.05);
        }
    }
}