import {Rect, RectProps, Txt} from '@motion-canvas/2d/lib/components';
import { PossibleColor } from '@motion-canvas/core';
import {makeRef, makeRefs} from '@motion-canvas/core/lib/utils';

interface ContainerRefs {
  rect: Rect;
  label: Txt;
}

export interface ContainerProps extends RectProps {
  label?: string;
  refs?: ContainerRefs;
  surface?: PossibleColor;
}

export function Container({
  label = '',
  refs = {} as ContainerRefs,
  children,
  surface = "#cc812b",
  ref,
  ...rest
}: ContainerProps) {
  return (
    <Rect
      ref={ref ?? makeRef(refs, 'rect')}
      fill={surface}
      direction={'column'}
      radius={8}
      padding={40}
      gap={20}
      layout
      {...rest}
    >
      <Txt
        ref={makeRef(refs, 'label')}
        lineHeight={60}
        marginTop={-20}
        fontFamily={'JetBrains Mono'}
        fontWeight={700}
        fontSize={28}
        fill={'rgba(255, 255, 255, 0.54)'}
      >
        {label}
      </Txt>
      {children}
    </Rect>
  );
}

export const makeContainer = makeRefs<typeof Container>;
