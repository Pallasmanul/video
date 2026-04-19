import { Code, CodeProps, FunctionComponent, Img, PossibleCodeScope, Rect, RectProps, Txt, Node, Layout } from '@motion-canvas/2d';
import { createPageRef, Page } from './CodePage'
import { PlainCode, JSCode, CSCode, RSCode, YamlCode, CppCode, MarkdownCode, JsonCode, XmlCode, HtmlCode, CssCode } from './Code';
import { makeRef, PossibleColor, createRefArray, ReferenceArray, SimpleSignal, createSignal, Reference, SignalValue, makeRefs, tween, clampRemap, easeInOutCubic, easeInCubic } from '@motion-canvas/core';
import { ATxt } from './ATxt';

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
                <Rect layout direction={'column'} height={'100%'} width={60} fill={'#2c2c2c'} >
                    {/* <Img src="file.svg" width={40} height={40} />
                    <Img src="debug.svg" width={40} height={40} />
                    <Img src="git.svg" width={40} height={40} /> */}
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
