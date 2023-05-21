import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import { createEditor, Editor, Transforms, Element } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

import { Block, Mark } from '@/apps/notes/types';
import { markRenderer, toggleMark } from '@/apps/notes/editor/Mark';
import { blockRenderer, toggleBlock } from '@/apps/notes/editor/Element';
import styles from '@/apps/notes/styles.module.css';

import type { KeyboardEventHandler } from 'react';
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

    const handleKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
      (event) => {
        if (event.key === 'Enter') {
          const { selection } = editor;
          if (!selection) return;

          const [parentNode] = Editor.parent(editor, selection);
          if (
            Element.isElement(parentNode) &&
            [Block.TITLE, Block.HEADING, Block.SUBHEADING].includes(
              parentNode.type
            )
          ) {
            event.preventDefault();

            Transforms.move(editor, { edge: 'end' });

            Transforms.insertNodes(
              editor,
              {
                type: Block.PARAGRAPH,
                children: [{ text: '' }],
              },
              {
                at: editor.selection
                  ? Editor.after(editor, editor.selection.focus.path)
                  : undefined,
              }
            );
          }
        }

        if (event.metaKey) {
          if (event.key.toLowerCase() === 'b') {
            event.preventDefault();
            toggleMark(editor, Mark.BOLD);
          } else if (event.key.toLowerCase() === 'i') {
            event.preventDefault();
            toggleMark(editor, Mark.ITALIC);
          } else if (event.key.toLowerCase() === 'u') {
            event.preventDefault();
            toggleMark(editor, Mark.UNDERLINE);
          }
        }
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
