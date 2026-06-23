import { Layout,Code } from "@motion-canvas/2d";
import { all, easeOutCubic, TimingFunction } from "@motion-canvas/core";


export function* reveal(
  rect: Layout,
  time = 0.3,
  timingFunction: TimingFunction = easeOutCubic,
) {
  const padding = rect.padding();
  rect.padding(20).height(null);
  const height = rect.height();
  rect.padding(padding).height(0);

  yield* all(
    rect.height(height, time, timingFunction),
    rect.padding(20, time, timingFunction),
  );

  rect.height(null);
}

export function* appendToCode(
    code_text: string,
    code: typeof Code,
) {
    const previous = code.parsed();
    yield* code.code.append(`${code_text}\n`, 0.1)
}


// 实现逼真的逐字符代码输入效果
export function* typeCodeEffect(
    code: typeof Code,
    text: string,
    cursorRef?: {dot: {opacity: (value: number, duration?: number) => ThreadGenerator}},
) {
    const random = useRandom();
    
    for (const char of text) {
        // 追加一个字符
        yield* code.code.append(char, 0);
        
        // 如果有光标引用，显示光标
        if (cursorRef) {
            cursorRef.dot.opacity(1, 0.05);
        }
        
        // 随机延迟，模拟真实打字速度
        const delay = random.nextFloat(0.03, 0.12);
        yield* waitFor(delay);
        
        // 光标闪烁效果
        if (cursorRef) {
            cursorRef.dot.opacity(0, 0.05);
            yield* waitFor(0.05);
            cursorRef.dot.opacity(1, 0.05);
        }
    }
}
