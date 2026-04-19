import { Circle, lines, makeScene2D, word } from '@motion-canvas/2d';
import { all, createRef, waitFor } from '@motion-canvas/core';
import { Mouse, Paper, createMouseRef, Window, Slider, Container, Editor, createPageRef, createEditorRef } from '../components';
import { BoxGeometry } from 'three';



export default makeScene2D(function* (view) {
  // Create your animations here

  const circle = createRef<Circle>();
  const mouse = createMouseRef();
  const window = createRef<Window>();
  const editorref = createEditorRef();

  view.add(
    <>
      <Container
        x={-620}
        label="PARALLAX SCROLLING"
        fill={0.3}
        y={80}
        opacity={1}
      ></Container>
      <Editor
        files={['index.js', 'index.css']}
        width={800}
        refs={editorref}
        theme={
          {
            bg: '#161616',
            bgDark: '#12121212',
            radius: 12,
          }
        }
        code="console.log('hello world');
console.log('btawer');
console.log('asdfasdf')
"


      >

      </Editor>

    </>

  );
  
  yield* editorref.toggleLeftMenu(0.3, true);
  yield* waitFor(1);
  yield* editorref.toggleLeftMenu(0.3, false);
  yield* waitFor(1);
  yield* editorref.toggleLeftMenu(0.3, true);
  yield* waitFor(1);
  yield* editorref.setCurrentFile('index.css');
  yield* waitFor(1);
  yield* editorref.setCurrentFile('index.js');
  yield* waitFor(1);
  yield* editorref.setCurrentFile('index.css');
  yield* waitFor(1);
  yield* editorref.setCurrentFile('');
  yield* waitFor(1);
  yield* editorref.toggleLeftMenu(0.3, false);
  yield* waitFor(1);
});
