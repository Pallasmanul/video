import { Layout, Rect, RectProps } from '@motion-canvas/2d';
import { createRef, makeRef, makeRefs, SignalValue } from '@motion-canvas/core';
import { ATxt } from './ATxt';

export function createLibDocRef() {
    return makeRefs<typeof LibDoc>();
}

export function LibDoc({
    refs,
    libName,
    description,
    features,
    examples,
    ...props
}: RectProps & {
    refs: {
        rect: Rect;
        exampleLines: Rect[];
    };
    libName: SignalValue<string>;
    description: SignalValue<string>;
    features: SignalValue<string>[];
    examples: SignalValue<string>[];
}) {
    const featureList = (() => {
        const f = features;
        return Array.isArray(f) ? f : [f];
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
                {/* 库名称 */}
                <ATxt
                    fill={'#ff6b6b'}
                    fontSize={36}
                    fontWeight={700}
                >
                    {libName}
                </ATxt>

                {/* 库描述 */}
                <ATxt
                    fill={'#a0a0a0'}
                    fontSize={18}
                    lineHeight={1.5}
                >
                    {description}
                </ATxt>

                {/* 主要特性 */}
                <Layout direction={'column'} gap={8}>
                    <ATxt
                        fill={'#4ecdc4'}
                        fontSize={20}
                        fontWeight={600}
                    >
                        主要特性:
                    </ATxt>
                    <Rect fill={'#1a1a1a'} padding={12} radius={6} layout direction={'column'} gap={6}>
                        {featureList.map((feature, index) => (
                            <ATxt
                                key={index}
                                fill={'#ffd93d'}
                                fontSize={16}
                                lineHeight={1.5}
                            >
                                • {feature}
                            </ATxt>
                        ))}
                    </Rect>
                </Layout>

                {/* 使用示例 */}
                <Layout direction={'column'} gap={8}>
                    <ATxt
                        fill={'#4ecdc4'}
                        fontSize={20}
                        fontWeight={600}
                    >
                        使用示例:
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