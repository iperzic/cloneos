import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import { createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

import { Block, Mark } from '@/apps/notes/types';
import { markRenderer, toggleMark } from '@/apps/notes/editor/Mark';
import { blockRenderer, toggleBlock } from '@/apps/notes/editor/Element';
import {
  handleElementEnding,
  handleLists,
  handleShortcuts,
} from '@/apps/notes/editor/keydownHandlers';
import styles from '@/apps/notes/styles.module.css';

import type { KeyboardEvent } from 'react';
import type { ReactEditor } from 'slate-react';
import type { Descendant } from 'slate';

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

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (handleElementEnding(editor, event)) {
          return;
        }

        if (handleShortcuts(editor, event)) {
          return;
        }

        handleLists(editor, event);
      },
      [editor]
    );

    return (
      <Slate editor={editor} value={value} onChange={onChange}>
        <Editable
          renderLeaf={markRenderer}
          renderElement={blockRenderer}
          className={styles.editor}
          onKeyDown={handleKeyDown}
        />
      </Slate>
    );
  }
);

export default CustomEditor;
