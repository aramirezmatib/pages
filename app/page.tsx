"use client"

import * as React from 'react';
import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
} from '@grapesjs/react';
import type { Editor, EditorConfig } from 'grapesjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MAIN_BORDER_COLOR } from './components/common';
import CustomModal from './components/CustomModal';
import CustomAssetManager from './components/CustomAssetManager';
import Topbar from './components/Topbar';
import RightSidebar from './components/RightSidebar';
import './style.css';
import baseReactComponent from './base-react-component';
import components from './components';
import Text from './components/components/display/Text';
import { EditorInstanceProvider, useEditor, useEditorInstance } from './hooks/useEditor';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const gjsOptions: EditorConfig = {
  height: '100vh',
  storageManager: false,
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  projectData: {
    assets: [
      'https://via.placeholder.com/350x250/78c5d6/fff',
      'https://via.placeholder.com/350x250/459ba8/fff',
      'https://via.placeholder.com/350x250/79c267/fff',
      'https://via.placeholder.com/350x250/c5d647/fff',
      'https://via.placeholder.com/350x250/f28c33/fff',
    ],
    pages: [
      {
        name: 'Home page',
        //component: `<h1>GrapesJS React Custom UI</h1>`,
        component: ``,
      },
    ],
  },
};

function EditorWrapper() {

  const editorInstance = useEditorInstance()

  const onEditor = (editor: Editor) => {
    console.log('Editor loaded', editorInstance);
    //editorInstance?.setEditor(editor)

    editor.addComponents(<div style={{height:100, width:100}}>
      <Text value="hola">
        Hello!
      </Text>
    </div>);
  };

  return <GjsEditor
    className="gjs-custom-editor text-white bg-slate-900"
    grapesjs="https://unpkg.com/grapesjs"
    grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
    options={gjsOptions}
    plugins={[
      {
        id: 'gjs-blocks-basic',
        src: 'https://unpkg.com/grapesjs-blocks-basic',
      },
      baseReactComponent, components
    ]}
    onEditor={onEditor}
  >
    <div className={`flex h-full border-t ${MAIN_BORDER_COLOR}`}>
      <div className="gjs-column-m flex flex-col flex-grow">
        <Topbar className="min-h-[48px]" />
        <Canvas className="flex-grow gjs-custom-editor-canvas">
        </Canvas>
      </div>
      <RightSidebar
        className={`gjs-column-r w-[300px] border-l ${MAIN_BORDER_COLOR}`}
      />
    </div>
    <ModalProvider>
      {({ open, title, content, close }) => (
        <CustomModal
          open={open}
          title={title}
          children={content}
          close={close}
        />
      )}
    </ModalProvider>
    <AssetsProvider>
      {({ assets, select, close, Container }) => (
        <Container>
          <CustomAssetManager
            assets={assets}
            select={select}
            close={close}
          />
        </Container>
      )}
    </AssetsProvider>
  </GjsEditor>
}

export default function App() {
  return (
    // @ts-ignore
    <ThemeProvider theme={theme}>
      <EditorInstanceProvider>
        <EditorWrapper></EditorWrapper>
      </EditorInstanceProvider>
    </ThemeProvider>
  );
}
