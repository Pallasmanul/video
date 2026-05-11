import { Layout, Rect, RectProps } from '@motion-canvas/2d';
import { createRef, makeRef, makeRefs, SignalValue } from '@motion-canvas/core';
import { ATxt } from './ATxt';

export function createFunctionDocRef() {
    return makeRefs<typeof FunctionDoc>();
}

export function FunctionDoc({
    refs,
    functionName,
    description,
    parameters,
    returnValue,
    examples,
    ...props
}: RectProps & {
    refs: {
        rect: Rect;
        exampleLines: Rect[];
    };
    functionName: SignalValue<string>;
    description: SignalValue<string>;
    parameters: SignalValue<string>[];
    returnValue: SignalValue<string>;
    examples: SignalValue<string>[];
}) {
    const params = (() => {
        const p = parameters;
        return Array.isArray(p) ? p : [p];
    })();

    // 初始化 exampleLines 数组
    refs.exampleLines = examples.map(() => createRef<Rect>());

    return (
        <Rect
            fill={'#202020'}
            padding={20}
            layout
            {...props}
            ref={makeRef(refs, 'rect')}
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
                    <Rect fill={'#1a1a1a'} padding={12} radius={6} layout direction={'column'} gap={4}>
                        {examples.map((example, index) => (
                            <Rect
                                key={index}
                                ref={makeRef(refs.exampleLines, index)}
                                layout
                                radius={4}
                            >
                                <ATxt
                                    fill={'#e0e0e0'}
                                    fontSize={14}
                                    lineHeight={1.6}
                                >
                                    {example}
                                </ATxt>
                            </Rect>
                        ))}
                    </Rect>
                </Layout>
            </Layout>
        </Rect>
    );
}