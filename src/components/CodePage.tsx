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


export interface PageRefs {
  rect: Rect;
  inner: Rect;
  code: Code;
  wrapper: Node;
  badge: Txt;
  scroll: SimpleSignal<number>;
}

export interface PageProps extends RectProps {
  code: SignalValue<PossibleCodeScope>;
  component?: FunctionComponent<CodeProps>;
  label?: SignalValue<string>;
  badge?: SignalValue<string>;
  theme: {
    bg: string;
    bgDark: string;
    radius: number;
  };
  refs?: PageRefs;
}

export function createPageRef() {
  //return makeRefs<typeof Page>();
  return {} as PageRefs;
}

export function Page({
  refs = {} as PageRefs,
  code,
  label,
  theme,
  badge,
  component = RSCode,
  lineHeight = '150%',
  ...props
}: PageProps) {
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
        <Rect grow={1} clip ref={makeRef(refs, 'inner')} marginLeft={60}>
          <Layout layout={false} position={() => refs.inner.size().scale(-0.5)}>
            <CodeComponent
              ref={makeRef(refs, 'code')}
              offset={-1}
              y={refs.scroll}
              lineHeight={lineHeight}
              code={code}
            />
          </Layout>
        </Rect>
      </Node>
    </Rect>
  );
}
