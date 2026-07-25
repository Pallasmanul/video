import { Circle, initial, Layout, LayoutProps, Line, LineProps, Rect, Shape, ShapeProps, signal } from '@motion-canvas/2d';
import { createComputed, createSignal, makeRef, makeRefs, PossibleVector2, SignalValue, SimpleSignal, Vector2Signal } from '@motion-canvas/core';

export interface CodeCursorRefs {
    bg: Layout;
    arrow: Line;
    size: SimpleSignal<number>;
    dot: Circle;
}
 
export interface CodeCursorProps extends LayoutProps {
    refs?: CodeCursorRefs;
    absolutePosition?: SignalValue<PossibleVector2>;    
}


export function createCodeCursorRef() {
    return {} as CodeCursorRefs;
}

export function CodeCursor({
    refs,
    ...props
}: CodeCursorProps) {
    refs.size = createSignal(20);

    return (
        <Layout size={refs.size()}  {...props} ref={makeRef(refs, 'bg')}>
            <Line
                closed
                layout={false}
                lineJoin={'round'}
                stroke={'#fbff00'}
                lineWidth={4}
                points={() => {
                    const size = refs.size();
                    const halfHeight = size / 2;
                    const halfWidth = size * 0.69; // 保持原比例
                    const tipWidth = size * 0.375;

                    // 计算图案边界框
                    const minX = -halfWidth;
                    const maxX = tipWidth;
                    const minY = -halfHeight;
                    const maxY = halfHeight;

                    // 计算中心偏移量
                    const centerX = (minX + maxX) / 2;
                    const centerY = (minY + maxY) / 2;

                    // 将所有点平移，使中心位于原点
                    const offsetX = -centerX;
                    const offsetY = -centerY;

                    return [
                        [-halfWidth + offsetX, -halfHeight + offsetY],
                        [-halfWidth + offsetX, halfHeight + offsetY],
                        [0 + offsetX, halfHeight + offsetY],
                        [tipWidth + offsetX, 0 + offsetY],
                        [0 + offsetX, -halfHeight + offsetY],
                        [-halfWidth * 0.73 + offsetX, -halfHeight + offsetY],
                    ];
                }}
                ref={makeRef(refs, 'arrow')}
            />
            <Circle
                size={10}
                opacity={1}
                x={-1.5}
                fill={'#ff0000'}
                ref={makeRef(refs, 'dot')}
            />
        </Layout>
    );
}