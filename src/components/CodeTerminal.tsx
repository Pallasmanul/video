import { Code, Layout, Rect, RectProps } from "@motion-canvas/2d";
import {
    createSignal,
    makeRef,
    makeRefs,
    SignalValue,
    SimpleSignal,
} from '@motion-canvas/core';
import { TerminalCode } from "./Code";


interface CodeTerminalRefs {
    rect: Rect;
    inner: Rect;
    code: Code;
    scroll: SimpleSignal<number>;
}

export function createCodeTerminalRef() {
    return makeRefs<typeof CodeTerminal>();
}

export interface CodeTerminalProps extends RectProps {
    label?: SignalValue<string>;
    refs?: CodeTerminalRefs;
}

export function CodeTerminal({
    refs = {} as CodeTerminalRefs,
    ref,
    ...rest
}: CodeTerminalProps) {
    refs.scroll = createSignal(0);

    return (
        <Rect
            ref={ref ?? makeRef(refs, 'rect')}
            layout
            clip
            grow={1}
            radius={8}
            padding={40}
            direction={'column'}
            {...rest}
        >
            <Rect grow={1} clip ref={makeRef(refs, 'inner')}>
            <Layout layout={false} position={() => refs.rect.size().scale(-0.5)}>
                <TerminalCode
                    ref={makeRef(refs, 'code')}
                    offset={-1}
                    x={50}
                    fill={'rgba(255, 255, 255, 0.6)'}
                    y={refs.scroll}
                    lineHeight={'150%'}
                />
            </Layout>
            </Rect>
        </Rect>
    )
}