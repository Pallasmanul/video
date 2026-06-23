import { Code, CodeProps, FunctionComponent, Rect, RectProps, } from '@motion-canvas/2d';
import {
    createComputed,
    makeRef,
    makeRefs,
    range,
    SignalValue,
    SimpleSignal,
    createRef,
    createSignal
} from '@motion-canvas/core';
import { Page, createPageRef } from './CodePage';
import { CodeCursor, createCodeCursorRef } from './CodeCursor';
import { PlainCode } from './Code';

export function createCodeEditorRef() {
    return makeRefs<typeof CodeEditor>();
}

export function CodeEditor({
    refs,
    code,
    label,
    theme,
    component,
    lineHeight = '150%',
    ...props
}: RectProps & {
    code: SignalValue<string>;
    component?: FunctionComponent<CodeProps>;
    label?: SignalValue<string>;
    theme: {
        bg: string;
        bgDark: string;
        radius: number;
    };
    refs: {
        page: ReturnType<typeof createPageRef>;
        codeCursor: ReturnType<typeof createCodeCursorRef>;
        lineNumbers: Code;
        highlightLine: Rect;
        lineCount: SimpleSignal<number>;
        targetLine: SimpleSignal<number>;
    };
}) {
    refs.page = createPageRef();
    refs.codeCursor = createCodeCursorRef();
    refs.lineCount = createSignal(2);
    refs.targetLine = createSignal(2);


    // 创建行号数量的信号，支持动态修改
    refs.lineCount = createComputed(() => {
        const codeStr = String(code);
        return codeStr.split('\n').length;
    });

    // 获取代码第 2 行（索引为 1）开头的位置
    refs.targetLine = createComputed(() => {
        const codeStr = String(code);
        return Math.min(codeStr.split('\n').length - 1, 1);
    });

    // 根据行号数量动态生成行号代码
    const lineNumbers = createComputed(() => {
        return range(refs.lineCount())
            .map(i => (i + 1).toString().padStart(3, ' ') + ' ')
            .join('\n');
    });

    // 计算高亮矩形的位置和大小
    const highlightRectProps = createComputed(() => {
        const line = refs.targetLine();
        if (!refs.page.code) {
            return { position: { x: 0, y: 0 }, width: 0, height: 0 };
        }
        // 使用 getPointBBox 获取当前行开头的位置
        const pointBBox = refs.page.code.getPointBBox([line, 0]);
        const worldPos = refs.page.code.localToWorld().transformPoint(pointBBox.position);
        // 基于 Page 组件的 lineHeight='150%' 和字体大小计算行高
        const baseFontSize = 24;
        const lineHeight = baseFontSize * 1.5; // 150% 的行高
        return {
            position: worldPos,
            width: refs.page.rect.width() - 160,
            height: lineHeight,
        };
    });

    return (
        <>
            <Page
                refs={refs.page}
                label={label}
                theme={theme}
                component={component}
                lineHeight={lineHeight}
                code={code}
                {...props}
            />

            <CodeCursor
                refs={refs.codeCursor}
                opacity={1}
                absolutePosition={() => {
                    const line = refs.targetLine();
                    if (!refs.page.code) {
                        return { x: 0, y: 0 };
                    }
                    const pointBBox = refs.page.code.getPointBBox([line, 0]);
                    return refs.page.code.localToWorld().transformPoint(pointBBox.position);
                }}
                offset={[7, -2]}
                layout={false}
            />

            <PlainCode
                fill={'#666'}
                fontWeight={700}
                ref={makeRef(refs, 'lineNumbers')}
                absolutePosition={() => {
                    if (!refs.page.code) {
                        return { x: 0, y: 0 };
                    }
                    const pointBBox = refs.page.code.getPointBBox([0, 0]);
                    return refs.page.code.localToWorld().transformPoint(pointBBox.position);
                }}
                code={lineNumbers}
                offset={[1, -1]}
                opacity={1}
            />

            {/* 行背景高亮矩形 */}
            <Rect
                ref={makeRef(refs, 'highlightLine')}
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
}