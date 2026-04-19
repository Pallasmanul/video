import { Code, CodeProps, FunctionComponent, Img, PossibleCodeScope, Rect, RectProps, Txt, Node, Layout, SVG, Path } from '@motion-canvas/2d';
import { createPageRef, Page } from './CodePage'
import { PlainCode, JSCode, CSCode, RSCode, YamlCode, CppCode, MarkdownCode, JsonCode, XmlCode, HtmlCode, CssCode } from './Code';
import { makeRef, PossibleColor, createRefArray, ReferenceArray, SimpleSignal, createSignal, Reference, SignalValue, makeRefs, tween, clampRemap, easeInOutCubic, easeInCubic } from '@motion-canvas/core';
import { ATxt } from './ATxt';
import File_Icon from '../icons/files.svg?raw'
import Git_Icon from '../icons/git-branch.svg?raw'
import Debug_Icon from '../icons/debug-alt-small.svg?raw'

export type LeftMenuFeature = 'files' | 'debug' | 'git'
export type CodeSyntax = 'plain' | 'js' | 'cs' | 'rs' | 'yaml' | 'cpp' | 'markdown' | 'json' | 'xml' | 'html' | 'css';

export interface FileConfig {
    scroll_number: SimpleSignal<number>;
    line_number: number;
}

export interface FileContent {
    content: string;
    config: FileConfig;
}

export interface FileContentManager {
    [file: string]: FileContent;
}

export interface CodeEditorProps extends RectProps {
    files: string[];
    file_content_manager?: FileContentManager;
    left_menu_feature?: LeftMenuFeature;
    code_syntax?: CodeSyntax;
    code: SignalValue<PossibleCodeScope>;
    component?: FunctionComponent<CodeProps>;
    label?: SignalValue<string>;
    badge?: SignalValue<string>;
    theme: {
        bg: string;
        bgDark: string;
        radius: number;
    };
    left_menu_visible?: boolean;
    left_menu_width?: number;
}


export function createEditorRef() {
    return makeRefs<typeof Editor>();
}



export function Editor(
    {
        refs,
        left_menu_feature = 'files',
        files,
        file_content_manager,
        code_syntax = 'plain',
        code,
        label,
        theme,
        badge,
        component = RSCode,
        lineHeight = '150%',
        left_menu_visible = false,
        left_menu_width = 170,
        ...props
    }: CodeEditorProps & {

        refs: {
            bg_rect: Rect;
            left_menu: [
                left_menu_icon_bar: Rect,
                left_menu: Rect,
            ],
            currentfile: SimpleSignal<string>;
            left_menu_rect: Rect,
            page_rect: Rect,
            page_inner: Rect,
            page_code: Code,
            page_wrapper: Node,
            page_badge: Txt,
            page_scroll: SimpleSignal<number>,
            files_rect: SimpleSignal<Rect>[],
            setCurrentFile?: (fileName: string, duration: number) => void,
            toggleLeftMenu?: (duration: number, visible: boolean) => void,
        }
    }
) {


    const CodeComponent = component;

    refs.page_scroll = createSignal(0);
    refs.currentfile = createSignal('');

    refs.files_rect = []; // 初始化files_rect数组

    // 为每个文件创建SimpleSignal<Rect>
    files.forEach(() => {
        refs.files_rect.push(createSignal<Rect>(null as any));
    });

    // 设置当前文件并高亮对应的rect
    refs.setCurrentFile = function* (fileName: string, duration = 0.1) {

        if (refs.currentfile() != '' && refs.currentfile() !== fileName && refs.files_rect[files.indexOf(refs.currentfile())]) {
            yield* tween(duration, (value) => {
                const clampedValue = clampRemap(value, 0, 1, 0.3, 1);
                refs.files_rect[files.indexOf(refs.currentfile())]().fill(`rgba(65, 67, 57, ${1 - clampedValue})`);
            }, easeInOutCubic);
        }

        if (fileName == '') {
            return;
        }
        // 设置currentfile信号
        refs.currentfile(fileName);

        // 找到对应文件的索引
        const fileIndex = files.indexOf(fileName);
        if (fileName != '' && fileIndex !== -1 && refs.files_rect[fileIndex]) {
            // 获取对应的Rect组件
            const fileRect = refs.files_rect[fileIndex];
            if (fileRect) {
                // 设置高亮颜色 
                yield* tween(duration, (value) => {
                    const clampedValue = clampRemap(value, 0, 1, 0.3, 1);
                    fileRect().fill(`rgba(65, 67, 57, ${clampedValue})`);
                }, easeInOutCubic);
            }
        }
    };



    // 切换左侧菜单的显示和隐藏
    refs.toggleLeftMenu = function* (duration = 0.3, visible = true) {

        const targetWidth = visible ? left_menu_width : 0;

        yield* refs.left_menu_rect.width(targetWidth, duration);


    };


    const getCodeComponent = () => {
        switch (code_syntax) {
            case 'js':
                return JSCode;
            case 'cs':
                return CSCode;
            case 'rs':
                return RSCode;
            case 'yaml':
                return YamlCode;
            case 'cpp':
                return CppCode;
            case 'markdown':
                return MarkdownCode;
            case 'json':
                return JsonCode;
            case 'xml':
                return XmlCode;
            case 'html':
                return HtmlCode;
            case 'css':
                return CssCode;
            default:
                return PlainCode;
        }
    };



    const renderLeftMenu = () => {
        switch (left_menu_feature) {
            case 'files':
                return (
                    <Rect
                        layout
                        direction={'column'}
                        height={'100%'}
                        gap={10}
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
                                    fill={'rgba(0, 0, 0, 0)'}
                                    textAlign={'center'}
                                    lineWidth={1}
                                    ref={refs.files_rect[index]}
                                >
                                    <ATxt text={file} fontSize={26} />
                                </Rect>
                            ))}
                        </Rect>
                    </Rect>
                )
            case 'debug':
                return (
                    <Rect
                        layout
                        direction={'column'}
                        height={'100%'}
                        padding={10}
                    >
                        {/* Debug Menu */}
                    </Rect>
                )
        }

    }

    return (
        <>
            <Rect
                ref={makeRef(refs, 'bg_rect')}
                layout
                direction={'row'}
                padding={10}
                height={1080 - 40}
                gap={1}
                fill={'#010101'}
                radius={8}
                justifyContent={'space-between'}
                clip
                {...props}
            >
                {/* Left Menu Icon Bar */}
                <Rect layout direction={'column'} alignItems={'center'} gap={50} padding={10} height={'100%'} width={60} fill={'#2c2c2c'} >
                    <Layout layout direction={'row'}>
                        <Path
                            offsetX={1}
                            offsetY={0}
                            data="M7.5 22.5H17.595C17.07 23.4 16.11 24 15 24H7.5C4.185 24 1.5 21.315 1.5 18V6C1.5 4.89 2.1 3.93 3 3.405V18C3 20.475 5.025 22.5 7.5 22.5ZM21 8.121V18C21 19.6545 19.6545 21 18 21H7.5C5.8455 21 4.5 19.6545 4.5 18V3C4.5 1.3455 5.8455 0 7.5 0H12.879C13.4715 0 14.0505 0.24 14.4705 0.6585L20.3415 6.5295C20.766 6.954 21 7.5195 21 8.121ZM13.5 6.75C13.5 7.164 13.8375 7.5 14.25 7.5H19.1895L13.5 1.8105V6.75ZM19.5 18V9H14.25C13.0095 9 12 7.9905 12 6.75V1.5H7.5C6.672 1.5 6 2.1735 6 3V18C6 18.8265 6.672 19.5 7.5 19.5H18C18.828 19.5 19.5 18.8265 19.5 18Z"
                            scale={1.5}
                            fill={'#ffffff'}
                        />
                    </Layout>
                    <Layout>
                        <Path
                            offsetX={1}
                            data="M13.236 9.307L8.80701 11.798C8.63601 11.48 8.36701 11.223 8.02601 11.094L8.03601 11.084L12.745 8.435C13.085 8.244 13.085 7.755 12.745 7.563L4.74501 3.064C4.41201 2.876 4.00001 3.117 4.00001 3.5V7C3.64601 7 3.31601 7.081 3.00001 7.19399V3.5C3.00001 2.353 4.23501 1.63 5.23501 2.193L13.235 6.693C14.254 7.266 14.254 8.73399 13.235 9.30799L13.236 9.307ZM7.00001 10.707V12H7.50001C7.77601 12 8.00001 12.224 8.00001 12.5C8.00001 12.776 7.77601 13 7.50001 13H7.00001C7.00001 13.384 6.92701 13.75 6.79501 14.088L7.85401 15.147C8.04901 15.342 8.04901 15.659 7.85401 15.854C7.75601 15.952 7.62801 16 7.50001 16C7.37201 16 7.24401 15.951 7.14601 15.854L6.26101 14.969C5.71101 15.6 4.90101 16.001 4.00001 16.001C3.09901 16.001 2.28901 15.601 1.73901 14.969L0.854006 15.854C0.756006 15.952 0.628006 16 0.500006 16C0.372006 16 0.244006 15.951 0.146006 15.854C-0.0489941 15.659 -0.0489941 15.342 0.146006 15.147L1.20501 14.088C1.07301 13.75 1.00001 13.384 1.00001 13H0.500006C0.224006 13 5.85616e-06 12.776 5.85616e-06 12.5C5.85616e-06 12.224 0.224006 12 0.500006 12H1.00001V10.707L0.146006 9.85299C-0.0489941 9.65799 -0.0489941 9.341 0.146006 9.146C0.341006 8.95099 0.658006 8.95099 0.853006 9.146L1.70701 10H2.00001C2.00001 8.897 2.89701 8 4.00001 8C5.10301 8 6.00001 8.897 6.00001 10H6.29301L7.14701 9.146C7.34201 8.95099 7.65901 8.95099 7.85401 9.146C8.04901 9.341 8.04901 9.65799 7.85401 9.85299L7.00001 10.707ZM3.00001 10H5.00001C5.00001 9.448 4.55201 9 4.00001 9C3.44801 9 3.00001 9.448 3.00001 10ZM6.00001 11H2.00001V13C2.00001 14.103 2.89701 15 4.00001 15C5.10301 15 6.00001 14.103 6.00001 13V11Z"
                            scale={2.2}
                            fill={'#848484'}
                        />
                    </Layout>
                    <Layout>
                        <Path
                            offsetX={1}
                            offsetY={-1}
                            data="M14 5.5C14 4.121 12.879 3 11.5 3C10.121 3 9 4.121 9 5.5C9 6.682 9.826 7.669 10.93 7.928C10.744 8.546 10.177 9 9.5 9H6.5C5.935 9 5.419 9.195 5 9.512V4.949C6.14 4.717 7 3.707 7 2.5C7 1.121 5.879 0 4.5 0C3.121 0 2 1.121 2 2.5C2 3.708 2.86 4.717 4 4.949V11.05C2.86 11.282 2 12.292 2 13.499C2 14.878 3.121 15.999 4.5 15.999C5.879 15.999 7 14.878 7 13.499C7 12.317 6.174 11.33 5.07 11.071C5.256 10.453 5.823 9.999 6.5 9.999H9.5C10.723 9.999 11.74 9.115 11.954 7.953C13.116 7.738 14 6.723 14 5.5ZM3 2.5C3 1.673 3.673 1 4.5 1C5.327 1 6 1.673 6 2.5C6 3.327 5.327 4 4.5 4C3.673 4 3 3.327 3 2.5ZM6 13.5C6 14.327 5.327 15 4.5 15C3.673 15 3 14.327 3 13.5C3 12.673 3.673 12 4.5 12C5.327 12 6 12.673 6 13.5ZM11.5 7C10.673 7 10 6.327 10 5.5C10 4.673 10.673 4 11.5 4C12.327 4 13 4.673 13 5.5C13 6.327 12.327 7 11.5 7Z"
                            scale={2.1}
                            fill={'#848484'}
                        />
                    </Layout>

                </Rect>

                {/* Left Menu */}
                <Rect width={0} ref={makeRef(refs, 'left_menu_rect')} layout direction={'column'} height={'100%'} fill={'#1e1f1c'} gap={10}>
                    {renderLeftMenu()}
                </Rect>

                {/* Right Content */}
                <Rect layout direction={'column'} height={'100%'} grow={1} fill={'#4f4f4f'} radius={12}>
                    <Rect
                        fill={theme.bg}
                        radius={theme.radius}
                        layout
                        padding={40}
                        grow={1}
                        direction={'column'}
                        clip
                        ref={makeRef(refs, 'page_rect')}
                    >
                        <Node ref={makeRef(refs, 'page_wrapper')}>
                            <Layout justifyContent={'space-between'}>
                                <ATxt text={label} />
                                {badge && <ATxt text={badge} ref={makeRef(refs, 'page_badge')} />}
                            </Layout>
                            <Rect fill={theme.bgDark} height={8} shrink={0} margin={[40, -40]} />
                            <Rect grow={1} clip ref={makeRef(refs, 'page_inner')}>
                                <Layout layout={false} position={() => refs.page_inner.size().scale(-0.5)}>
                                    <CodeComponent
                                        ref={makeRef(refs, 'page_code')}
                                        offset={-1}
                                        y={refs.page_scroll}
                                        lineHeight={lineHeight}
                                        code={code}
                                    />
                                </Layout>
                            </Rect>
                        </Node>
                    </Rect>
                </Rect>

            </Rect>
        </>
    )
}
