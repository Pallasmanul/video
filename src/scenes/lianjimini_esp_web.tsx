import { Circle, Code, lines, makeScene2D, Rect, SVG, Node, Path, Txt } from '@motion-canvas/2d';
import { all, createRef, Logger, waitFor, debug, createRefArray, loop, linear, waitUntil, range } from '@motion-canvas/core';

export default makeScene2D(function* (view) {

    view.fill('#1c1c1c')

    const bgRef = createRef<Rect>();

    // 选择屏幕比例类型
    // 可选: 'mobile-portrait' (9:16), 'mobile-landscape' (16:9), 'desktop' (16:9), 'tablet' (4:3), 'monitor' (5:4), 'ultrawide' (21:9)
    const screenType = 'desktop';

    // 屏幕比例配置
    const screenRatioConfig = {
        'mobile-portrait': { name: '手机竖屏', width: 9, height: 16 },
        'mobile-landscape': { name: '手机横屏', width: 16, height: 9 },
        'desktop': { name: '电脑屏幕', width: 16, height: 9 },
        'tablet': { name: '平板', width: 4, height: 3 },
        'monitor': { name: '传统显示器', width: 5, height: 4 },
        'ultrawide': { name: '超宽屏', width: 21, height: 9 },
    };

    // 获取当前选中的屏幕比例
    const currentRatio = screenRatioConfig[screenType];
    // 根据比例计算背景尺寸
    const baseWidth = 500;
    const baseHeight = (baseWidth * currentRatio.height) / currentRatio.width;


    view.add(
        <>
            <Rect
                x={0}
                y={0}
                ref={bgRef}
                fill={'#2a2a2a'}
                width={baseWidth}
                height={baseHeight}
                layout
                direction={'column'}
            >
                <Rect size={40} margin={20} fill={'#7c7c7c'} alignSelf={'end'}></Rect>
                <Rect width={140} height={140} marginTop={50} fill={'#7c7c7c'} alignSelf={'center'}> </Rect>
                <Rect width={400} height={80} marginTop={100} fill={'#7c7c7c'} alignSelf={'center'}></Rect>

            </Rect>
        </>
    );

    yield* waitFor(10);

})
