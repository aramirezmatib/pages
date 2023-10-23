//import { useEditorMaybe } from "@grapesjs/react";
import { useEditor } from "./useEditor";
import * as React from "react";

export interface NodeRuntime<P> {
    nodeId: string | undefined;
    nodeName: string | undefined;
    updateAppDomConstProp: <K extends keyof P & string>(
        key: K,
        value: React.SetStateAction<P[K]>,
    ) => void;
    updateEditorNodeData: (key: string, value: any) => void;
}

export function useNode<P = {}>(): NodeRuntime<P> | null {
    const editor = useEditor();
    const [nodeId, setNodeId] = React.useState()
    const [nodeName, setNodeName] = React.useState()

    React.useEffect(() => {
        if(editor) {
            const component = editor?.getSelected()
            setNodeId(component?.get('id'))
            setNodeName(component?.get('name'))
        }

        console.log({editor})
    }, [editor])    

    return React.useMemo(() => {
        if (!nodeId || !editor) {
            return null;
        }
        return {
            nodeId,
            nodeName,
            updateAppDomConstProp: (prop, value) => {
                editor.trigger('propUpdated', {
                    nodeId,
                    prop,
                    value,
                });
            },
            updateEditorNodeData: (prop: string, value: any) => {
                editor.trigger('editorNodeDataUpdated', {
                    nodeId,
                    prop,
                    value,
                });
            },
        } satisfies NodeRuntime<P>;
    }, [nodeId, nodeName, editor]);
}
