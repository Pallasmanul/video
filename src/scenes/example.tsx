import { Circle, lines, makeScene2D, SVG, word } from '@motion-canvas/2d';
import { all, createRef, range, waitFor } from '@motion-canvas/core';
import { Mouse, Paper, createMouseRef, Window, Slider, Container, createPageRef, Page, PlainCode, CodeDebugBar, FileBar } from '../components';
import { BoxGeometry } from 'three';
import { CodeDebugBar, createDebugBarRef, createFileBarRefs, FileManagerBar } from '../components';


export default makeScene2D(function* (view) {
  // Create your animations here

  const circle = createRef<Circle>();
  const mouse = createMouseRef();
  const window = createRef<Window>();
  const pageref = createPageRef();
  const debugbarref = createDebugBarRef();
  const filebarrefs = createFileBarRefs();



  view.add(
    <>
      <Container
        x={-620}
        label="PARALLAX SCROLLING"
        fill={0.3}
        y={80}
        opacity={1}
      ></Container>

    <PlainCode
      x={-300}
      fill={'#666'}
      marginTop={16}
      fontWeight={700}
      offset={-1}
      code={range(16)
        .map(i => i.toString().padStart(3, ' ') + ' ')
        .join('\n')}
    />      
      {/* <Page
        refs={pageref}
        width={800}
        theme={
          {
            bg: '#161616',
            bgDark: '#12121212',
            radius: 12,
          }
        }
        label="Hello.js"
        code="console.log('hello world');
console.log('btawer');
console.log('asdfasdf')
"        
      >
      </Page> */}
      <CodeDebugBar
        refs={debugbarref}
        theme={
          {
            bg: '#161616',
            bgDark: '#12121212',
            radius: 12,
          }
        }
      />
      <FileManagerBar
        refs={filebarrefs}
        files={['Hello.js', 'Hello2.js']}
        theme={
          {
            bg: '#161616',
            bgDark: '#12121212',
            radius: 8,
          }
        }
        fill={'#161616'}
        width={200}
        height={400}
        radius={8}
        x={-300}
       />



    </>

  );

  yield* waitFor(1);
});
