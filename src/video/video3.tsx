
import { makeScene2D, Rect, Txt, Node, Code, Layout, Path, Img, Circle } from "@motion-canvas/2d";
import { ATxt, Paper, Page, createPageRef, PyCode, CodeTerminal, createCodeTerminalRef, createCodeCursorRef, CodeCursor, PlainCode } from "../components";
import { all, createComputed, createRef, createRefArray, createSignal, easeInOutCubic, range, sequence, tween, waitFor } from "@motion-canvas/core";
import phone from '../images/电话.png';
import arrow from '../images/上箭头.png';
import cut from '../images/剪切.png';
import record from '../images/录音.png';
import paste from '../images/附件.png';


export default makeScene2D(function* (view) {
    view.fill('#070707');

    const paperRef = createRef<Rect>();
    const titleRef = createRefArray<Txt>();

    view.add(
        <>
            <Paper opacity={1} width={400} height={300} fill={'#ffffff'} radius={16} ref={paperRef} layout direction={'column'} textAlign={'center'} alignItems={'center'} justifyContent={'center'} scale={1.2}>
                <ATxt text={"AI 编程"} fill={'#000000'} ref={titleRef} fontSize={48} />
                <ATxt text={"Python 基础语法概念"} fill={'#000000'} ref={titleRef} paddingTop={20} />
            </Paper>
        </>
    );

    paperRef().height(0);
    for (const ref of titleRef) {
        ref.opacity(0);
    }

    yield* sequence(
        0.3,
        paperRef().height(300, 0.6),
        all(...titleRef.map((ref) => ref.opacity(1, 0.6))),
    );

    yield* waitFor(1);

    paperRef().height(0);
    for (const ref of titleRef) {
        ref.opacity(0);
    }


    /** ********************************************************** */
    /**                        Code Component                      */
    /** ********************************************************** */
    /**
     *  pageRef  ,  codecursorref  ,  lineNumbersRef ,  highlightLine
     *  targetLine
     *  lineCount
     *  cursorJumpAnimation   params: [1,3] like [start,end]
     */

    // Page Ref

    const pageRef = createPageRef();
    view.add(
        <>
            <Node>
                <Page
                    refs={pageRef}
                    x={0}
                    label="main.py"
                    opacity={0}
                    stroke="#b50000"
                    strokeFirst
                    theme={{
                        bg: '#1e1e1e',
                        bgDark: '#0f0d0c',
                        radius: 16,
                    }}
                    height={900}
                    width={850}
                    component={PyCode}
                    code={"# 导入 pathlib"}
                >
                </Page>
            </Node>
        </>
    )

    const codeTerminalRef = createCodeTerminalRef();

    // Code Terminal Ref

    view.add(
        <>
            <CodeTerminal refs={codeTerminalRef} fill={'#1e1e1e'} opacity={0} width={() => pageRef.rect.width()} height={200} x={() => pageRef.rect.x()} y={360} />
        </>
    )


    // Code Plugins
    const targetLine = createSignal(1); // 默认第2行

    const linePosition = createComputed(() => {
        const line = targetLine();
        const pointBBox = () => pageRef.code.getPointBBox([line, 0]);
        return pageRef.code.localToWorld().transformPoint(pointBBox().position);
    });

    const highlightRectProps = createComputed(() => {
        const line = targetLine();
        const pointBBox = pageRef.code.getPointBBox([line, 0]);
        const worldPos = pageRef.code.localToWorld().transformPoint(pointBBox.position);

        const baseFontSize = 24;
        const lineHeight = baseFontSize * 1.5; // 150%行高

        return {
            position: worldPos,
            width: pageRef.rect.width() - 160,
            height: lineHeight,
        };
    });



    // Auto jump  range is [1,3]
    function* cursorJumpAnimation(range: number[]) {
        const targetRanges = [range]; // 跳转范围：第2行到第4行

        for (const [start, end] of targetRanges) {
            for (let line = start; line <= end; line++) {
                yield* tween(0.2, (value) => {
                    const easedValue = easeInOutCubic(value);
                    const current = targetLine();
                    const next = line;
                    targetLine(Math.round(current + (next - current) * easedValue));
                });
            }
        }
        targetLine(1); // 回到初始位置
    }

    const codecursorref = createCodeCursorRef();
    const lineNumbersRef = createRef<Code>();
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
                ref={lineNumbersRef}
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


    /** ********************************************************** */
    /**                        END                                 */
    /** ********************************************************** */

    yield* pageRef.rect.opacity(0, 0.6);
    yield* lineCount(0, 0.2);


    view.add(
        <Rect fill={'#dbdbdb'} opacity={0} width={400} height={400} radius={16} layout direction={'column'} justifyContent={'center'} alignItems={'center'} gap={60} scale={1.5}>
            <ATxt text={"有啥能帮你的吗?"} fontStyle={'Bold'} fontSize={34} fill={'#000'} />
            <Rect stroke={'#5b5b5b'} lineWidth={2} width={'80%'} height={'40%'} radius={8} minWidth={200} layout direction={'column'}>
                <Layout direction={'column'} alignItems={'start'} height={'90%'} paddingLeft={10}>
                    <ATxt text={"你好"} fontStyle={'Bold'} fontSize={16} fill={'#000'} />
                    <ATxt text={"只使用基础语法"} fontStyle={'Bold'} fontSize={16} fill={'#000'} />
                </Layout>
                <Layout direction={'row'} alignItems={'end'} height={40}>
                    <Layout width={'100%'} height={'10%'} gap={20} alignItems={'end'} padding={10} justifyContent={'start'}>
                        <Img src={paste} width={22} height={22} />a
                    </Layout>
                    <Layout direction={'row'} width={'100%'} height={'10%'} gap={10} alignItems={'end'} padding={10} justifyContent={'end'}>
                        <Img src={cut} width={22} height={22} />
                        <Img src={phone} width={22} height={22} />
                        <Img src={record} width={22} height={22} />\
                        <Rect width={2} height={22} fill={"#585858"} />
                        <Circle size={26} fill={"#5e5e5e56"} layout justifyContent={'center'} alignItems={'center'}>
                            <Img src={arrow} width={18} height={18} />
                        </Circle>
                    </Layout>
                </Layout>
            </Rect>
        </Rect>
    )

    yield* pageRef.rect.opacity(1, 0.6);
    yield* pageRef.code.code.append('\nprint("hello world")', 0.6);

    yield* waitFor(5);


});