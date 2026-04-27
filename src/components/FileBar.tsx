import { FunctionComponent, Rect, RectProps, Layout } from '@motion-canvas/2d';
import { makeRef, SimpleSignal, createSignal, SignalValue, createRefArray, makeRefs } from '@motion-canvas/core';
import { ATxt } from './ATxt';
 
export interface FileBarProps extends RectProps {
    files: string[];
    onFileSelect?: (fileName: string) => void;
    theme: {
        bg: string;
        bgDark: string;
        radius: number;
    };
    refs: {
        currentFile: SimpleSignal<string>;
        filesRect: SimpleSignal<Rect>[];
    };
}

export function createFileBarRefs() {
    return makeRefs<typeof FileManagerBar>();
}
 
export function FileManagerBar({
    refs,
    files,
    onFileSelect,
    theme,
    ...props
}: FileBarProps) {

    refs.filesRect = []; // 初始化filesRect数组
    // 为每个文件创建SimpleSignal<Rect>
    files.forEach(() => {
        refs.filesRect.push(createSignal<Rect>(null as any));
    });
    refs.currentFile = createSignal(files[0]);

    return (
        <Rect
            layout
            direction={'column'}
            height={'100%'}
            gap={10}
            {...props}
        >
            {/* 文件列表 */}
            <ATxt text="文件" fontSize={26} textAlign={'center'} />
            <Rect layout direction={'column'} height={'100%'}>
                {files.map((file, index) => (
                    <Rect
                        key={file}
                        layout
                        direction={'column'}
                        height={50}
                        width={'100%'}
                        fill={refs.currentFile() === file ? 'rgba(65, 67, 57, 1)' : 'rgba(0, 0, 0, 0)'}
                        textAlign={'center'}
                        lineWidth={1}
                        ref={refs.filesRect[index]}
                    >
                        <ATxt text={file} fontSize={26} />
                    </Rect>
                ))}
            </Rect>
        </Rect>
    );
}