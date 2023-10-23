import React from 'react';
import { Editor } from 'grapesjs';
import { Button, Rating } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache'
import * as MuiComponents from './components/index';
import MuiAutocomplete from './components/MuiAutocomplete';
import MuiDataGrid from './components/MuiDataGrid';
import MuiTable from './components/MuiTable';
import { MenuItem } from './components/index';
import Container from './components/layout/Container'
import Text from './components/display/Text'
import { EditorInstanceContext } from '../hooks/useEditor';


export default (editor: Editor) => {
    const { Blocks, Components } = editor;
    const sheetsManager = new Map();

    // Helper for MUI components
    const addCmp = ({ type, component, props }) => {
        Components.addType(type, {
            extend: 'react-component',
            model: {
                defaults: {
                    ...props,
                    component,
                }
            },
            view: {
                /**
                 * We need this in order to render MUI styles in the canvas
                 */
                createReactEl(cmp, props) {

                    let emotionInsertionPoint = this.em.get('Canvas').getDocument().head.querySelector('[name="emotion-insertion-point"]')
                    if(!emotionInsertionPoint) {
                        emotionInsertionPoint = this.em.get('Canvas').getDocument().createElement('meta')
                        emotionInsertionPoint.setAttribute('name', 'emotion-insertion-point')
                        emotionInsertionPoint.setAttribute('content', '')
                        this.em.get('Canvas').getDocument().head.appendChild(emotionInsertionPoint)
                    }

                    /*const cmpMain = React.createElement(
                        EditorInstanceContext.Consumer, 
                        null,
                        (context) => {
                            console.log({context})
                            return React.createElement(
                                cmp,
                                Object.assign({}, context, props),
                                this.createReactChildWrap()
                            )
                        }
                    );*/

                    const cmpMain = React.createElement(
                        cmp,
                        props,
                        this.createReactChildWrap()
                    )

                    // the emotion sheets should be inserted right after the meta tag
                    return React.createElement(
                        CacheProvider,
                        {
                            value: createCache({
                                key: 'c',
                                container: emotionInsertionPoint
                            })
                        },
                        cmpMain
                    )
                }
            },
            isComponent: (el) => {
                console.log(el.tagName, type.toUpperCase())
                return el.tagName === type.toUpperCase()
            }
        });

        Blocks.add(type, {
            label: type,
            category: 'MUI',
            content: { type }
        });
    };

    addCmp({
        type: 'COMPMUIBUTTON',
        component: Button,
        props: {
            attributes: {
                color: 'primary',
                variant: 'contained'
            },
            components: <span>Click me</span>,//'Click me',
            traits: [
                {
                    type: 'select',
                    label: 'Variant',
                    name: 'variant',
                    options: [
                        { value: 'contained', name: 'Contained' },
                        { value: 'outlined', name: 'Outlined' }
                    ]
                },

                {
                    type: 'checkbox',
                    label: 'Disabled',
                    name: 'disabled'
                },
                {
                    type: 'select',
                    label: 'Color',
                    name: 'color',
                    options: [
                        { value: 'primary', name: 'Primary' },
                        { value: 'secondary', name: 'Secondary' }
                    ]
                },
                {
                    type: 'text',
                    label: 'Text',
                    name: 'components'
                },
            ],
            resizable: true,
        }
    });

    addCmp({
        type: 'CompMuiAutocomplete',
        component: MuiAutocomplete,
        props: {
            attributes: {
                id: 'text'
            },
            traits: [
                {
                    type: 'text',
                    label: 'Data',
                    name: 'data'
                },
                {
                    type: 'text',
                    label: 'Text',
                    name: 'placeholder'
                },
            ],
            resizable: true,
        },
    })

    addCmp({
        type: 'CompMuiRating',
        component: Rating,
        props: {
            attributes: {
                
            }
        }
    })

    const MuiDataGridHeader = () => {
        return <div></div>
    }

    addCmp({
        type: 'MuiDataGrid',
        component: MuiDataGrid,
        props: {
            components: `<div></div><div></div><div></div>`,
            attributes: {
                
            },
            resizable: true,
        }
    })

    

    addCmp({
        type: 'MuiDataGridHeader',
        component: MuiDataGridHeader,
        props: {
            attributes: {
                
            },
            resizable: false,
        }
    })

    addCmp({
        type: 'MuiTable',
        component: MuiTable,
        props: {
            attributes: {
                
            },
            resizable: true,
        }
    })

    addCmp({
        type: 'MenuItem',
        component: MenuItem,
        props: {
            Components: 'Menu Item'
        }
    })

    addCmp({
        type: 'Container',
        component: Container,
        props: {
        }
    })

    addCmp({
        type: 'MuiText',
        component: Text,
        props: {
            
        }
    })

    
};