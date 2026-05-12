import {
  Code,
  CodeProps,
  FunctionComponent,
  Layout,
  Node,
  PossibleCodeScope,
  Rect,
  RectProps,
  Txt,
} from '@motion-canvas/2d';
import {
  createComputed,
  createSignal,
  makeRef,
  makeRefs,
  range,
  SignalValue,
  SimpleSignal,
  Vector2,
} from '@motion-canvas/core';
import { ATxt } from './ATxt';
import { PlainCode, RSCode } from './Code';

export function createPageRef() {
  return makeRefs<typeof Page>();
}

export function Page({
  refs,
  code,
  label,
  theme,
  badge,
  component = RSCode,
  lineHeight = '150%',
  ...props
}: RectProps & {
  code: SignalValue<PossibleCodeScope>;
  component?: FunctionComponent<CodeProps>;
  label?: SignalValue<string>;
  badge?: SignalValue<string>;
  theme: {
    bg: string;
    bgDark: string;
    radius: number;
  };
  refs: {
    rect: Rect;
    inner: Rect;
    code: Code;
    wrapper: Node;
    badge: Txt;
    scroll: SimpleSignal<number>;
  };
}) {
  refs.scroll = createSignal(0);
  const CodeComponent = component;

  // 根据 code 行数生成行号
  const lineNumbers = createComputed(() => {
    const codeStr = String(code);
    const lines = codeStr.split('\n').length;
    return Array.from({ length: lines }, (_, i) => (i + 1).toString().padStart(3, ' ') + ' ').join('\n');
  });

  return (
    <Rect
      fill={theme.bg}
      radius={theme.radius}
      layout
      padding={40}
      height={1080 - 80}
      direction={'column'}
      clip
      {...props}
      ref={makeRef(refs, 'rect')}
    >
      <Node ref={makeRef(refs, 'wrapper')}>
        <Layout justifyContent={'space-between'}>
          <ATxt text={label} />
          {badge && <ATxt text={badge} ref={makeRef(refs, 'badge')} />}
        </Layout>
        <Rect fill={theme.bgDark} height={8} shrink={0} margin={[40, -40]} />
        <Rect grow={1} clip ref={makeRef(refs, 'inner')}>
          <Layout layout={false} position={() => {
            const innerSize = refs.inner.size();
            const codeSize = refs.code.size();
            const codeOffsetY = 0; // 内层 Layout 的固定 y 偏移

            // 水平方向始终居中
            const x = -innerSize.x / 2 + 150;

           // 垂直方向：始终靠近上边对齐（加上 codeOffsetY 偏移）
            // 代码中心位置 = 顶部位置 + codeSize.y/2
            // 顶部位置 = -innerSize.y/2 + codeOffsetY
            let y = -innerSize.y / 2 + codeOffsetY + codeSize.y / 2 - refs.scroll();
            
            return new Vector2(x, y);
          }}>
            <Layout direction={'row'} layout>
              <PlainCode
                fill={'#666'}
                fontWeight={700}
                offset={-1}
                code={lineNumbers}
              />
              <CodeComponent
                ref={makeRef(refs, 'code')}
                offset={-1}
                lineHeight={lineHeight}
                code={code}
              />
            </Layout>
          </Layout>
          {/* 
            <CodeComponent
              ref={makeRef(refs, 'code')}
              offset={-1}
              y={refs.scroll}
              lineHeight={lineHeight}
              code={code}
            />           */}
        </Rect>
      </Node>
    </Rect>
  );
}
