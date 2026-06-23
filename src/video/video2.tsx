import { Code, Rect, Txt, makeScene2D, Node } from "@motion-canvas/2d";
import { all, createRef, waitFor, createRefArray, sequence, easeInBounce, easeInOutCubic, createSignal, createComputed, range, spawn, tween, loopUntil, loop, chain } from "@motion-canvas/core";
import { ATxt, CodeCursor, LibDoc, Page, PlainCode, PyCode, appendToCode, createCodeCursorRef, createLibDocRef, createPageRef } from "../components";
import { CodeEditor, createCodeEditorRef } from "../components/CodeEditor";
import { CodeTerminal, createCodeTerminalRef } from "../components/CodeTerminal";

const System_ = "Linux Windows macOS";
const Generic_Operating_System_Service_Lib = "os io time logging platform errno ctypes";

// 将字符串拆分成数组
const libNames = System_.split(' ');

export default makeScene2D(function* (view) {

    const titleRectRef = createRef<Rect>();
    const titleRef = createRef<Txt>();

    // 创建 lib rect refs
    const sysNameRectRefs = createRefArray<Rect>();
    const sysNameRefs = createRefArray<Txt>();


    view.fill('#070707');


    view.add(
        <>
            <Rect fill={'#2c2c2c'} opacity={0} radius={16} x={0} y={0} direction={'column'} ref={titleRectRef}
                padding={40}
                gap={20}
                scale={0}
                layout>
                <ATxt text={"Generic Operating System Service"} />
            </Rect>
            <Rect fill={'#fff'} opacity={0} width={2000} height={20} y={200} ref={titleRef} />
        </>
    );
    view.add(['Linux', 'Windows', 'macOS'].map((sys_name, index) => (
        <Rect
            opacity={0}
            radius={8}
            x={-400 + index * 400}
            y={220}
            padding={20}
            layout
            gap={40}
            ref={sysNameRectRefs}
        >
            <ATxt
                ref={sysNameRefs}
                text={sys_name}
                fontSize={48}
            />
        </Rect>
    )));


    yield* all(
        titleRectRef().opacity(1, 0.6),
        titleRectRef().scale(1.3, 0.6),
    );

    yield* waitFor(1);

    yield* all(
        titleRectRef().y(-100, 0.6),
        titleRef().opacity(1, 0.6),
        titleRef().y(100, 0.6),
        ...sysNameRectRefs.map((ref) => ref.opacity(1, 0.5)),
        ...sysNameRefs.map((ref) => ref.opacity(1, 0.5)),
    );

    yield* waitFor(1);

    titleRef().remove();
    titleRectRef().remove();
    sysNameRectRefs.map(ref => ref.remove());


    const libNamesRectRefs = createRefArray<Rect>();
    const libNamesRefs = createRefArray<Txt>();

    // 将元素排列成两行：第一行4个，第二行3个
    view.add(['os', 'io', 'time', 'logging', 'platform', 'errno', 'ctypes'].map((lib_name, index) => {
        // 判断当前元素在哪一行
        const itemsPerRow = 4;
        const row = Math.floor(index / itemsPerRow);
        const col = index % itemsPerRow;

        // 计算每行的起始位置（居中对齐）
        const row0StartX = -450; // 第一行4个元素的起始位置
        const row1StartX = -300; // 第二行3个元素的起始位置
        const startX = row === 0 ? row0StartX : row1StartX;
        const y = row === 0 ? -100 : 100; // 两行的垂直位置

        return (
            <Rect
                opacity={0}
                radius={8}
                x={startX + col * 280}
                y={y}
                padding={20}
                layout
                gap={40}
                ref={libNamesRectRefs}
                lineWidth={10}
            >
                <ATxt
                    ref={libNamesRefs}
                    text={lib_name}
                    fontSize={48}
                    marginBottom={10}
                />
            </Rect>
        );
    }))

    yield* sequence(
        0.2,
        ...libNamesRectRefs.map((ref) => ref.opacity(1, 0.6)),
        ...libNamesRefs.map((ref) => ref.opacity(1, 0.6)),
    );

    yield* waitFor(1);

    // 封装隐藏除指定索引外其他元素的函数
    const hideExcept = function* (refs: ReturnType<typeof createRefArray<Rect>>, keepIndex: number) {
        yield* refs.map((ref, index) => index === keepIndex ? ref : ref.opacity(0, 0.6));
    };

    yield* hideExcept(libNamesRectRefs, 0);
    yield* all(
        hideExcept(libNamesRectRefs, 0),
        libNamesRectRefs[0].scale(4, 0.6, easeInOutCubic),
        libNamesRectRefs[0].position([0, 0], 0.6, easeInOutCubic),
    )
    const os_lib = libNamesRectRefs[0].clone();
    view.add(os_lib);

    libNamesRectRefs.map(ref => ref.remove());


    yield* waitFor(1);
    const libDocRef = createLibDocRef();
    view.add(
        <LibDoc
            refs={libDocRef}
            libName="os"
            description="os 库是与操作系统相关的库..."
            features={["路径操作", "进程管理", "环境参数设置", "文件系统访问"]}
            examples={["import os", "..."]}
            opacity={1}
            x={1200}
            scale={1.3}
        />
    );

    yield* sequence(
        0.3,
        os_lib.x(-300, 0.6, easeInOutCubic),
        libDocRef.rect.x(400, 0.6, easeInOutCubic),
    );

    yield* waitFor(1);

    const pageRef = createPageRef();
    const codecursorref = createCodeCursorRef();
    const lineNumbersRef = createRef<Code>();
    const highlightLine = createRef<Rect>();
    const extra_code_ref = createRef<Node>();

    // 创建行号数量的信号，支持动态修改
    const lineCount = createSignal(12);

    // 根据行号数量动态生成行号代码
    const lineNumbers = createComputed(() => {
        return range(lineCount())
            .map(i => (i + 1).toString().padStart(3, ' ') + ' ')
            .join('\n');
    });
    // 获取代码第 2 行（索引为 1）开头的位置
    const targetLine = createSignal(1)

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
            <Page
                refs={pageRef}
                x={-400}
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
                code={"import os\n"}
            >
            </Page>
        </>
    )
    view.add(
        <>
            <Node ref={extra_code_ref} opacity={0}>
                <CodeCursor
                    refs={codecursorref}
                    opacity={1}
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
                    opacity={1}
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
            </Node>
        </>
    );


    yield* sequence(
        0.2,
        os_lib.opacity(0, 0.6),
        all(
            pageRef.rect.opacity(1, 0.5),
            libDocRef.rect.position(pageRef.rect.position(), 0.5),
            libDocRef.rect.size(pageRef.rect.size() - [0.2, 0.2], 0.5),
            libDocRef.rect.opacity(0, 0.6),
        ),
    )
    yield* extra_code_ref().opacity(1, 0.5);

    yield* appendToCode("print(\"operation type:\", os.name)", pageRef.code);


    const codeTerminalRef = createCodeTerminalRef();

    view.add(
        <>
            <CodeTerminal refs={codeTerminalRef} fill={'#2c2c2c'} opacity={0} width={pageRef.rect.width()} height={300} x={pageRef.rect.x()} y={300} />
        </>
    )
    yield* codeTerminalRef.rect.opacity(1, 0.6);
    yield* appendToCode("pallasmanul@~: 10", codeTerminalRef.code);

    const targetRanges = createSignal([[1, 4]]);
    // 创建指针跳转动画函数
    function* cursorJumpAnimation() {
            
        for (const [start, end] of targetRanges()) {
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

    yield waitFor(1);

    yield* chain(
        cursorJumpAnimation(),
        appendToCode("pallasmanul@~: operation type: nt", codeTerminalRef.code),
        appendToCode("print('current work dir:', os.getcwd())\n", pageRef.code),
        cursorJumpAnimation(),
        appendToCode("pallasmanul@~: operation type: nt", codeTerminalRef.code),
        appendToCode("pallasmanul@~: work dir: 'C:\\Users'", codeTerminalRef.code),
    );

    yield* waitFor(1);


});

