import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { createEditor, Descendant } from 'slate';
import type { ReactEditor } from 'slate-react';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

import { Block, Mark } from '@/apps/notes/types';
import { markRenderer, toggleMark } from '@/apps/notes/editor/Mark';
import { blockRenderer, toggleBlock } from '@/apps/notes/editor/Element';

import styles from '@/apps/notes/styles.module.css';

type CustomEditorProps = {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
};

export type FormattingHandle = {
  bold: () => void;
  underline: () => void;
  italic: () => void;
  strikethrough: () => void;
  title: () => void;
  heading: () => void;
  subHeading: () => void;
  bulletedList: () => void;
  numberedList: () => void;
  dashedList: () => void;
  body: () => void;
};

const CustomEditor = forwardRef<FormattingHandle, CustomEditorProps>(
  ({ value, onChange }, ref) => {
    const editor: ReactEditor = useMemo(
      () => withReact(withHistory(createEditor())),
      []
    );

    useImperativeHandle(ref, () => ({
      bold: () => toggleMark(editor, Mark.BOLD),
      italic: () => toggleMark(editor, Mark.ITALIC),
      underline: () => toggleMark(editor, Mark.UNDERLINE),
      strikethrough: () => toggleMark(editor, Mark.STRIKETHROUGH),
      title: () => toggleBlock(editor, Block.TITLE),
      heading: () => toggleBlock(editor, Block.HEADING),
      subHeading: () => toggleBlock(editor, Block.SUBHEADING),
      bulletedList: () => toggleBlock(editor, Block.BULLETED_LIST),
      numberedList: () => toggleBlock(editor, Block.NUMBERED_LIST),
      dashedList: () => toggleBlock(editor, Block.DASHED_LIST),
      body: () => toggleBlock(editor, Block.PARAGRAPH),
    }));

    return (
      <Slate editor={editor} value={value} onChange={onChange}>
        <Editable
          renderLeaf={markRenderer}
          renderElement={blockRenderer}
          className={styles.editor}
        />
      </Slate>
    );
  }
);

export default CustomEditor;
