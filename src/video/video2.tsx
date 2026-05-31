import { Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { all, createRef, waitFor, createRefArray, sequence, easeInBounce, easeInOutCubic } from "@motion-canvas/core";
import { ATxt, LibDoc, createLibDocRef } from "../components";

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


    yield* waitFor(2);
});
