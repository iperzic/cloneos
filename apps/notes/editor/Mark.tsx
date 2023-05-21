import React from 'react';
import { ReactEditor } from 'slate-react';
import { Editor } from 'slate';

import { Mark } from '@/apps/notes/types';

import type { RenderLeafProps } from 'slate-react';

export function isMarkActive(editor: ReactEditor, mark: Mark) {
  const marks = Editor.marks(editor);
  return marks ? marks[mark] === true : false;
}
export function toggleMark(editor: Editor, mark: Mark) {
  const isActive = isMarkActive(editor, mark);
  const { selection } = editor;

  if (selection) {
    if (isActive) {
      Editor.removeMark(editor, mark);
    } else {
      Editor.addMark(editor, mark, true);
    }
  }
}

export function markRenderer(props: RenderLeafProps) {
  const { attributes, leaf } = props;
  let { children } = props;
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }
  return <span {...attributes}>{children}</span>;
}
