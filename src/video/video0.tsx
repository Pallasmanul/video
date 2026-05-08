import { Circle, Code, lines, makeScene2D, Rect, SVG, Node, Path, Layout } from '@motion-canvas/2d';
import { all, createRef, Logger, waitFor, debug, createRefArray, loop, linear, waitUntil, range, chain, sequence, easeInOutCubic, createSignal, createComputed, run, join, tween, createEffect, spawn } from '@motion-canvas/core';
import { Mouse, Paper, createMouseRef, Window, Slider, Container, createPageRef, Page, ATxt, PlainCode, CodeCursor, createCodeCursorRef, PyCode } from '../components';
import { BoxGeometry } from 'three';
import { CodeTerminal, createCodeTerminalRef } from '../components/CodeTerminal';
import { reveal } from '../components/Utils';

const Python_Buildin_Function = "abs() ailter() all() anext() any() ascii() bin() bool() breakpoint() bytearray() bytes() callback() chr() classmethod() compile() complex() delattr() dict() dir() divmod() \
enumerate() eval() exec() filter() float() format() frozenset() getattr() globals() hasattr() hash() help() hex() id() input() int() isinstance() issubclass() iter() \
len() list() locals() map() max() memoryview() min() next() object() oct() open() ord() pow() print() property() \
range() repr() reversed() round() set() setattr() slice() sorted() staticmethod() str() sum() super() tuple() type() vars() zip()";

const Numeric_Math_Buildin_Function = "abs() round() pow() divmod() sum() min() max()"
const Type_Conversion_Buildin_Function = "int() float() complex() str() bool() list() tuple() set() dict() frozenset() bytes() bytearray()"
const Iteration_Functional_Buildin_Function = "len() range() enumerate() zip() map() filter() sorted() reversed() iter() next()"
const Object_Introspection_Build_Function = "type() id() isinstance() issubclass() dir() vars() callable() getattr() setattr() hasattr() delattr()"
const Input_Output_Build_Function = "print() input() open() help()"
const Execution_Compilation_Build_Function = "eval() exec() compile() __import__()"
const Special_Utilities_Build_Function = "ascii() bin() hex() oct() format() hash() globals() locals() property() staticmethod() classmethod() super()"
const Debug_Build_Function = "memoryview() breakpoint()"


export default makeScene2D(function* (view) {

    view.fill('#2f2f2f')
    const groupRef = createRef<Rect>()
    const logoRef = createRef<Node>()
    const codeRef = createRef<Code>()

    view.add(
        <Container
            label="Python"
            ref={groupRef}
            fill={'#1e1e1e'}
            clip
            children={
                <PyCode
                    lineHeight={'150%'}
                    offset={-1}
                    code={""}
                    ref={codeRef}
                    opacity={1}
                />
            }
            width={350}
            height={380}
            radius={16}
            opacity={1}
        >
        </Container>
    )

    view.add(
        <>
            <Node
                scale={1.3}
                position={[-160, -100]}
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
        0.3,
        logoRef().opacity(0, 0.6),
        groupRef().height(1000, 0.6),
    );

    const functions = Python_Buildin_Function.split(" ").slice(0, 20);
    yield* codeRef().code("import()", 0.1);
    for (const func of functions) {
        yield* codeRef().code.append("\n" + func, 0.1);
    }

    yield* all(
        groupRef().height(1000, 0.6),
        //groupRef().x(-view.width() / 4 - 120, 0.6, easeInOutCubic),
    )

    yield* groupRef().opacity(0, 0.6);

    groupRef().remove();
    logoRef().remove();


    // const pageRef = createPageRef()

    // view.add(
    //     <Page
    //         refs={pageRef}
    //         label="数学内置函数"
    //         opacity={0}
    //         theme={{
    //             bg: '#1e1e1e',
    //             bgDark: '#0f0d0c',
    //             radius: 16,
    //         }}
    //         height={500}
    //         width={350}
    //         component={PyCode}
    //         code={""}
    //     >
    //     </Page>
    // )

    // yield* waitFor(0.4);
    // yield* pageRef.rect.opacity(1, 0.6);
    // yield* pageRef.code.code(Numeric_Math_Buildin_Function.split(" ")[0], 0.1);
    // for (const func of Numeric_Math_Buildin_Function.split(" ").slice(1)) {
    //     yield* pageRef.code.code.append("\n" + func, 0.1);
    // }

    const pageRefs = [
        createRef<Rect>(),
        createRef<Rect>(),
        createRef<Rect>(),
        createRef<Rect>(),
        createRef<Rect>(),
        createRef<Rect>(),
        createRef<Rect>(),
        createRef<Rect>(),
    ];
    const codeRefs = [
        createRef<Code>(),
        createRef<Code>(),
        createRef<Code>(),
        createRef<Code>(),
        createRef<Code>(),
        createRef<Code>(),
        createRef<Code>(),
        createRef<Code>(),
    ];

    // 布局参数, 起点 + 间隔
    const startX = -600;
    const startY = -240;
    const gapX = 400;
    const gapY = 459;
    const itemsPerRow = 4;


    // 定义页面数据
    const pagesData = [
        { label: "数学内置函数", data: Numeric_Math_Buildin_Function },
        { label: "类型转换函数", data: Type_Conversion_Buildin_Function },
        { label: "迭代功能函数", data: Iteration_Functional_Buildin_Function },
        { label: "对象自省函数", data: Object_Introspection_Build_Function },
        { label: "输入输出函数", data: Input_Output_Build_Function },
        { label: "执行编译函数", data: Execution_Compilation_Build_Function },
        { label: "特殊工具函数", data: Special_Utilities_Build_Function },
        { label: "调试函数", data: Debug_Build_Function },
    ].map((item, index) => ({
        ...item,
        pos: {
            x: startX + (index % itemsPerRow) * gapX,
            y: startY + Math.floor(index / itemsPerRow) * gapY,
        },
    }));


    // 添加所有 Page 组件
    for (let i = 0; i < pagesData.length; i++) {
        const { label, pos } = pagesData[i];
        view.add(
            <Container
                label={label}
                ref={pageRefs[i]}
                fill={'#1e1e1e'}
                clip
                children={
                    <PyCode
                        lineHeight={'150%'}
                        offset={-1}
                        code={""}
                        ref={codeRefs[i]}
                        opacity={1}
                    />
                }
                width={350}
                height={380}
                radius={16}
                x={pos.x}
                y={pos.y}
                opacity={0}
            >
            </Container>
        );
    }

    //依次显示每个页面
    for (let i = 0; i < pagesData.length; i++) {
        const codeRef = codeRefs[i];
        const rectRef = pageRefs[i];
        const data = pagesData[i].data;
        for (const func of data.split(" ")) {
            codeRef().code.append("\n" + func);
        }
        yield* rectRef().opacity(1, 0.2);
    }

    yield* waitUntil('click');

    // 只显示第一个组件，让其 y 轴扩大，其他组件消失
    yield* all(
        // 第一个组件（数学内置函数）y轴放大
        pageRefs[0]().height(680, 0.8, easeInOutCubic), // 高度也相应增加
        pageRefs[0]().x(-view.width() / 4 - 80, 0.8, easeInOutCubic),
        pageRefs[0]().y(0, 0.8, easeInOutCubic),
        // 其他组件透明度变为0
        pageRefs[1]().opacity(0, 0.6),
        pageRefs[2]().opacity(0, 0.6),
        pageRefs[3]().opacity(0, 0.6),
        pageRefs[4]().opacity(0, 0.6),
        pageRefs[5]().opacity(0, 0.6),
        pageRefs[6]().opacity(0, 0.6),
        pageRefs[7]().opacity(0, 0.6),
    );

    for (let i = 1; i < pageRefs.length; i++) {
        pageRefs[i]().height(680);
        pageRefs[i]().x(-view.width() / 4 - 80);
        pageRefs[i]().y(0);
    }

    yield* waitFor(0.8);
    yield* codeRefs[0]().selection(lines(1), 0.6);

    // for (let i = 1; i < pageRefs.length; i++) {
    //     yield* pageRefs[i].rect.opacity(1, 0.6);
    //     yield* waitFor(1);
    // }

    view.add(
        createFunctionDoc(
            'abs(x)',
            '返回数字的绝对值',
            'x (int/float): 需要计算绝对值的数字',
            'int/float: x 的绝对值',
            [
                'abs(-10)  # 输出: 10',
                'abs(3.14)  # 输出: 3.14',
                'abs(-2.5)  # 输出: 2.5',
            ]
        )
            .x(view.width() / 4 - 150)
    )
    
    yield* waitUntil('ease');

    const pageRef = createPageRef();
    const codecursorref = createCodeCursorRef();
    const highlightLine = createRef<Rect>();
    view.add(
        <>
            <Page
                refs={pageRef}
                label="main.py"
                opacity={1}
                theme={{
                    bg: '#1e1e1e',
                    bgDark: '#0f0d0c',
                    radius: 16,
                }}
                height={900}
                width={800}
                x={view.width() / 4 - 100}
                y={0}
                component={PyCode}
                code={"int x=-10 \nprintf(abs(x)) \n \nbreakpoint() \n  "}
            >
            </Page>


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


    yield* waitUntil('click2');

    view.add(
        <>
            <CodeCursor
                refs={codecursorref}
                absolutePosition={() => {
                    const line = targetLine();
                    // 使用 getPointBBox 获取特定位置的边界框
                    const pointBBox = () => pageRef.code.getPointBBox([line, 0]);
                    return pageRef.code.localToWorld().transformPoint(pointBBox().position)
                }}
                offset={[7, -2]}
                layout={false}
            />
            {/* 行背景高亮矩形 */}
            <Rect
                ref={highlightLine}
                stroke="#515151"
                lineWidth={2}
                opacity={1}
                absolutePosition={() => highlightRectProps().position}
                width={() => highlightRectProps().width}
                height={() => highlightRectProps().height}
                offset={[-1, -1]}
                layout={false}
            />
        </>
    );
    codecursorref.dot.opacity(0);


    const codeTerminalRef = createCodeTerminalRef();

    view.add(
        <>
            <CodeTerminal refs={codeTerminalRef} fill={'#1e1e1e'} opacity={0} width={pageRef.rect.width()} height={300} x={view.width() / 4 - 100} y={380} />
        </>
    )

    yield* all(
        codeTerminalRef.rect.opacity(1, 0.6),
        pageRef.rect.y(-150, 0.6),
        pageRef.rect.height(680, 0.6),
    )

    createEffect(() => {
        const currentLine = targetLine();
        // 模拟代码执行的终端输出
        switch (currentLine) {
            case 2:
                spawn(function* () {
                    yield* appendToCode("pallasmanul@~: 10", codeTerminalRef.code);
                });
                break;
        }
    });

    // 创建指针跳转动画函数
    function* cursorJumpAnimation() {
        const targetRanges = [[1, 5]]; // 指针跳转的行序列

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


    yield* waitUntil('click3');



    // codeTerminalRef.code.code("pallasmanul@~: 10")
    // yield* appendToCode("pallasmanul@~: 10", codeTerminalRef.code);


    yield* waitFor(5);
    // yield* pageRef.scroll(100, 1);
    yield* codeTerminalRef.scroll(-100, 1);
    //yield* codeTerminalRef.inner.y(1000, 1);
    yield* waitFor(5);
});

function* appendToCode(
    code_text: string,
    code: typeof Code,
) {
    const previous = code.parsed();
    yield* code.code.append(`${code_text}\n`, 0.1)
}


// 函数文档组件封装函数
function createFunctionDoc(
    functionName: string,
    description: string,
    parameters: string | string[],
    returnValue: string,
    examples: string[],
) {
    const params = Array.isArray(parameters) ? parameters : [parameters];

    return (
        <Paper
            fill={'#202020'}
            padding={20}
            layout
        >
            <Layout direction={'column'} padding={24} gap={16}>
                {/* 函数名称 */}
                <ATxt
                    fill={'#ff6b6b'}
                    fontSize={36}
                    fontWeight={700}
                >
                    {functionName}
                </ATxt>

                {/* 函数描述 */}
                <ATxt
                    fill={'#a0a0a0'}
                    fontSize={18}
                    lineHeight={1.5}
                >
                    {description}
                </ATxt>

                {/* 参数说明 */}
                <Layout direction={'column'} gap={8}>
                    <ATxt
                        fill={'#4ecdc4'}
                        fontSize={20}
                        fontWeight={600}
                    >
                        参数:
                    </ATxt>
                    {params.map((param, index) => (
                        <ATxt
                            key={index}
                            fill={'#ffd93d'}
                            fontSize={16}
                            lineHeight={1.5}
                        >
                            {param}
                        </ATxt>
                    ))}
                </Layout>

                {/* 返回值说明 */}
                <Layout direction={'column'} gap={8}>
                    <ATxt
                        fill={'#4ecdc4'}
                        fontSize={20}
                        fontWeight={600}
                    >
                        返回值:
                    </ATxt>
                    <ATxt
                        fill={'#6bcb77'}
                        fontSize={16}
                        lineHeight={1.5}
                    >
                        {returnValue}
                    </ATxt>
                </Layout>

                {/* 使用示例 */}
                <Layout direction={'column'} gap={8}>
                    <ATxt
                        fill={'#4ecdc4'}
                        fontSize={20}
                        fontWeight={600}
                    >
                        示例:
                    </ATxt>
                    <Rect fill={'#1a1a1a'} padding={12} radius={6} layout direction={'column'}>
                        {examples.map((example, index) => (
                            <ATxt
                                key={index}
                                fill={'#e0e0e0'}
                                fontSize={14}
                                lineHeight={1.6}
                            >
                                {example}
                            </ATxt>
                        ))}
                    </Rect>
                </Layout>
            </Layout>
        </Paper>
    );
}