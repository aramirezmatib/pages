import type { Editor } from 'grapesjs';
import { createContext, useContext, useState } from 'react';

export const EditorInstanceContext = createContext<EditorInstanceState | null>(null);

export interface EditorInstanceState {
    editor?: Editor,
    setEditor: (editor: Editor) => void,
}
export const EditorInstanceProvider = ({ children }: {
    children?: React.ReactNode,
}) => {
    const [state, setState] = useState<EditorInstanceState>({
        setEditor: editor => {
            setState((state) => ({ ...state, editor }));
        }
    });

    return (
        <EditorInstanceContext.Provider value={state}>
            { children }
        </EditorInstanceContext.Provider>
    )
};

/**
 * Context used to keep the editor instance once initialized
 */
export const useEditorInstance = () => {
    const context = useContext(EditorInstanceContext);

    return context;
};

/**
 * Get the current editor instance.
 * @returns Editor
 */
export const useEditor = (): Editor | undefined => {
    //const values = useContext(EditorInstanceContext)
    //console.log(`editor = `, values?.editor )

    const values = useEditorInstance();    
    return values?.editor;
}