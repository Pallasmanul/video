import { FunctionComponent, Layout, Node, Path, Rect, RectProps } from '@motion-canvas/2d';
import { makeRef, makeRefs, SignalValue, SimpleSignal } from '@motion-canvas/core';


export function createDebugBarRef() {
    return makeRefs<typeof CodeDebugBar>();
}

export function CodeDebugBar({
    refs,
    theme = {
        bg: '',
        bgDark: '',
        radius: 0
    },
    ...props
}: {
    refs: {
        startButton: Rect;
        stopButton: Rect;
        stepIntoButton: Rect;
        stepOutButton: Rect;
        stepOverButton: Rect;
        stopDebugButton: Rect;
    }
    theme: {
        bg: string;
        bgDark: string;
        radius: number;
    };

}) {
    return (
        <Rect
            layout
            direction={'row'}
            padding={10}
            gap={10}
            fill={theme.bg}
            radius={theme.radius}
            {...props}
        >
            {/* 开始调试按钮 */}
            <Rect
                ref={makeRef(refs, 'startButton')}
                width={40}
                height={40}
                radius={4}
                layout
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Path
                    offsetX={1.1}
                    offsetY={1.1}
                    data="M4.506 3.50305L12.501 8.00005L4.501 12.5L4.506 3.50305ZM4.502 1.99805C3.718 1.99805 3 2.62605 3 3.50005V12.5C3 13.374 3.718 14.002 4.502 14.002C4.747 14.002 4.998 13.941 5.235 13.807L13.235 9.30705C14.254 8.73405 14.254 7.26605 13.235 6.69205L5.235 2.193"
                    fill={'#659dcf'}
                    scale={2.4}
                />
            </Rect>

            {/* 暂停调试按钮 */}
            <Rect
                ref={makeRef(refs, 'stopButton')}
                width={40}
                height={40}
                radius={4}
                layout
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Path
                    offsetX={2}
                    offsetY={1.3}
                    data="M5.5 2.75V13.25C5.5 13.664 5.164 14 4.75 14C4.336 14 4 13.664 4 13.25V2.75C4 2.336 4.336 2 4.75 2C5.164 2 5.5 2.336 5.5 2.75ZM11.25 2C10.836 2 10.5 2.336 10.5 2.75V13.25C10.5 13.664 10.836 14 11.25 14C11.664 14 12 13.664 12 13.25V2.75C12 2.336 11.664 2 11.25 2Z"
                    fill={'#659dcf'}
                    scale={2.4}
                />
            </Rect>

            {/* 单步跳过按钮 */}
            <Rect
                ref={makeRef(refs, 'stepOverButton')}
                width={40}
                height={40}
                radius={4}
                layout
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Path
                    offsetX={1.5}
                    offsetY={1.1}
                    data="M9.99993 13C9.99993 14.103 9.10293 15 7.99993 15C6.89693 15 5.99993 14.103 5.99993 13C5.99993 11.897 6.89693 11 7.99993 11C9.10293 11 9.99993 11.897 9.99993 13ZM13.2499 2C12.8359 2 12.4999 2.336 12.4999 2.75V4.027C11.3829 2.759 9.75993 2 7.99993 2C5.03293 2 2.47993 4.211 2.06093 7.144C2.00193 7.554 2.28793 7.934 2.69793 7.993C2.73393 7.999 2.76993 8.001 2.80493 8.001C3.17193 8.001 3.49293 7.731 3.54693 7.357C3.86093 5.159 5.77593 3.501 8.00093 3.501C9.52993 3.501 10.9199 4.264 11.7439 5.501H9.75093C9.33693 5.501 9.00093 5.837 9.00093 6.251C9.00093 6.665 9.33693 7.001 9.75093 7.001H13.2509C13.6649 7.001 14.0009 6.665 14.0009 6.251V2.751C14.0009 2.337 13.6649 2.001 13.2509 2.001L13.2499 2Z"
                    fill={'#659dcf'}
                    scale={2.4}
                />
            </Rect>

            {/* 单步进入按钮 */}
            <Rect
                ref={makeRef(refs, 'stepIntoButton')}
                width={40}
                height={40}
                radius={4}
                layout
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Path
                    offsetX={1.7}
                    offsetY={1.1}
                    data="M10 13C10 14.103 9.10304 15 8.00004 15C6.89704 15 6.00004 14.103 6.00004 13C6.00004 11.897 6.89704 11 8.00004 11C9.10304 11 10 11.897 10 13ZM12.03 5.22C11.737 4.927 11.262 4.927 10.969 5.22L8.74904 7.44V1.75C8.74904 1.336 8.41304 1 7.99904 1C7.58504 1 7.24904 1.336 7.24904 1.75V7.439L5.02904 5.219C4.73604 4.926 4.26104 4.926 3.96804 5.219C3.67504 5.512 3.67504 5.987 3.96804 6.28L7.46804 9.78C7.61404 9.926 7.80604 10 7.99804 10C8.19004 10 8.38204 9.927 8.52804 9.78L12.028 6.28C12.321 5.987 12.321 5.512 12.028 5.219L12.03 5.22Z"
                    fill={'#659dcf'}
                    scale={2.4}
                />
            </Rect>

            {/* 单步退出按钮 */}
            <Rect
                ref={makeRef(refs, 'stepOutButton')}
                width={40}
                height={40}
                radius={4}
                layout
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Path
                    offsetX={1.7}
                    offsetY={1.1}
                    data="M9.99802 13C9.99802 14.103 9.10102 15 7.99802 15C6.89502 15 5.99802 14.103 5.99802 13C5.99802 11.897 6.89502 11 7.99802 11C9.10102 11 9.99802 11.897 9.99802 13ZM12.03 4.71999L8.53002 1.21999C8.23702 0.926994 7.76202 0.926994 7.46902 1.21999L3.96902 4.71999C3.67602 5.01299 3.67602 5.48799 3.96902 5.78099C4.26202 6.07399 4.73702 6.07399 5.03002 5.78099L7.25002 3.56099V9.24999C7.25002 9.66399 7.58602 9.99999 8.00002 9.99999C8.41402 9.99999 8.75002 9.66399 8.75002 9.24999V3.56099L10.97 5.78099C11.116 5.92699 11.308 6.00099 11.5 6.00099C11.692 6.00099 11.884 5.92799 12.03 5.78099C12.323 5.48799 12.323 5.01299 12.03 4.71999Z"
                    fill={'#659dcf'}
                    scale={2.4}
                />
            </Rect>


            {/* 停止调试按钮 */}
            <Rect
                ref={makeRef(refs, 'stopDebugButton')}
                width={40}
                height={40}
                radius={4}
                layout
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Path
                    offsetX={1.3}
                    offsetY={1.3}
                    data="M12.5 3.5V12.5H3.5V3.5H12.5ZM12.5 2H3.5C2.672 2 2 2.672 2 3.5V12.5C2 13.328 2.672 14 3.5 14H12.5C13.328 14 14 13.328 14 12.5V3.5C14 2.672 13.328 2 12.5 2Z"
                    fill={'#f48771'}
                    scale={2.4}
                />
            </Rect>
        </Rect>
    );
}