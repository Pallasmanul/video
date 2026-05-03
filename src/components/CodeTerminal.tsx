import { Layout, Rect, RectProps } from "@motion-canvas/2d";
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
    code: Rect;
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
    return (
        <Rect
            ref={ref ?? makeRef(refs, 'rect')}
            direction={'column'}
            layout
            textAlign={'center'}
            justifyContent={'start'}
            paddingTop={10}
            radius={8}
            {...rest}
        >
            <TerminalCode
                ref={makeRef(refs, 'code')}
                margin={20}
                fill={'rgba(255, 255, 255, 0.6)'}
            />
        </Rect>
    )
}