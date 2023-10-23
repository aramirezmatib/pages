import * as React from 'react';
import { Typography as MUITypography, TextareaAutosize, styled } from '@mui/material';
import { useNode } from './../../../hooks/useNode';

function parseInput(text: unknown): string {
  return String(text).replaceAll('\n', '');
}

const StyledTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  resize: 'none',
  border: 'none',
  outline: 'none',
  padding: 0,

  ...Object.fromEntries(
    Object.keys(theme.typography).map((variant) => [
      [`&.variant-${variant}`],
      theme.typography[variant as keyof typeof theme.typography],
    ]),
  ),
}));

export default function Text({ value, children, isSelected }: { value: string, isSelected: boolean } & React.PropsWithChildren) {

  const [contentEditable, setContentEditable] = React.useState<null | {
    selectionStart: number;
    selectionEnd: number;
  }>(null);

  // Debemos buscar la forma de usar un hook que nos permita comunicarnos con el editor,
  // Por ejemplo, para saber cuando un componente desde el editor es seleccionado para que el componente se comporte de otra forma.
  // Aqui si el componente es seleccionado deberia comportarse como un campo editable para poder cambiar su contenido.
  // Se hizo la simulacion con una propiedad, pero deberia ser por useNode() al ser seleccinaado por el editor
  //const {selectable, datasource, etc...} = useNode()

  const [input, setInput] = React.useState<string>(parseInput(value));

  value = 'Hola mundo'
  const variant = 'body1'

  React.useEffect(() => {
    setInput(parseInput(value));
  }, [value]);

  return !contentEditable ? (<MUITypography onDoubleClick={() => {
    const selection = window.getSelection();
    setContentEditable({
      selectionStart: selection?.anchorOffset || 0,
      selectionEnd: selection?.focusOffset || 0,
    });
  }}>{value}</MUITypography>) : (<StyledTextareaAutosize
    value={input}
    onChange={(event) => {
      setInput(parseInput(event.target.value));
    }}
    onKeyDown={(event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    }}
    autoFocus
    onFocus={(event) => {
      event.currentTarget.selectionStart = contentEditable.selectionStart;
      event.currentTarget.selectionEnd = Math.max(
        contentEditable.selectionStart,
        contentEditable.selectionEnd,
      );
    }}
    onBlur={() => {
      setContentEditable(null);

      // Aqui deberia ser una forma de comunicarse con el editor para actualizar las propiedades del elemento en el propio editor, por que aunque se cambia el texto como no hay forma de comunicarse con el editor no cambiara la propiedad
      //if (nodeRuntime) {
      //  nodeRuntime.updateAppDomConstProp('value', input);
      //}
    }}
    className={`variant-${variant}`}
  />)
}