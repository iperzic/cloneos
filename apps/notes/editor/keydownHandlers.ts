import { ReactEditor } from 'slate-react';
import { Editor, Element, Transforms } from 'slate';

import { toggleMark } from '@/apps/notes/editor/Mark';
import { Block, Mark } from '@/apps/notes/types';

import type { KeyboardEvent } from 'react';

export function handleShortcuts(
  editor: ReactEditor,
  event: KeyboardEvent<HTMLDivElement>
): boolean {
  if (event.metaKey) {
    if (event.key.toLowerCase() === 'b') {
      event.preventDefault();
      toggleMark(editor, Mark.BOLD);
      return true;
    }
    if (event.key.toLowerCase() === 'i') {
      event.preventDefault();
      toggleMark(editor, Mark.ITALIC);
      return true;
    }
    if (event.key.toLowerCase() === 'u') {
      event.preventDefault();
      toggleMark(editor, Mark.UNDERLINE);
      return true;
    }
  }

  return false;
}

export function handleElementEnding(
  editor: ReactEditor,
  event: KeyboardEvent<HTMLDivElement>
): boolean {
  if (event.key === 'Enter') {
    const { selection } = editor;
    if (!selection) return false;

    const [parentNode] = Editor.parent(editor, selection);
    if (
      Element.isElement(parentNode) &&
      [Block.TITLE, Block.HEADING, Block.SUBHEADING].includes(parentNode.type)
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

      return true;
    }
  }

  return false;
}

export function handleLists(
  editor: ReactEditor,
  event: KeyboardEvent<HTMLDivElement>
): boolean {
  if (event.key === ' ') {
    const { selection } = editor;
    if (!selection) return false;

    const [parentNode, paragraphPath] = Editor.parent(editor, selection);

    if (Element.isElement(parentNode) && parentNode.type !== Block.LIST_ITEM) {
      const start = Editor.start(editor, paragraphPath);
      const textBefore = Editor.string(editor, {
        anchor: start,
        focus: selection.anchor,
      });

      if (textBefore === '1.') {
        event.preventDefault();

        Transforms.delete(editor, {
          distance: 2,
          unit: 'character',
          reverse: true,
        });

        Transforms.setNodes(
          editor,
          { type: Block.LIST_ITEM },
          { at: paragraphPath }
        );

        Transforms.wrapNodes(
          editor,
          { type: Block.NUMBERED_LIST, children: [{ text: '' }] },
          { at: paragraphPath }
        );

        return true;
      }

      if (textBefore === '*') {
        event.preventDefault();

        Transforms.delete(editor, {
          distance: 1,
          unit: 'character',
          reverse: true,
        });

        Transforms.setNodes(
          editor,
          { type: Block.LIST_ITEM },
          { at: paragraphPath }
        );

        Transforms.wrapNodes(
          editor,
          { type: Block.BULLETED_LIST, children: [{ text: '' }] },
          { at: paragraphPath }
        );

        return true;
      }

      if (textBefore === '-') {
        event.preventDefault();

        Transforms.delete(editor, {
          distance: 1,
          unit: 'character',
          reverse: true,
        });

        Transforms.setNodes(
          editor,
          { type: Block.LIST_ITEM },
          { at: paragraphPath }
        );

        Transforms.wrapNodes(
          editor,
          { type: Block.DASHED_LIST, children: [{ text: '' }] },
          { at: paragraphPath }
        );

        return true;
      }
    }
  }

  return false;
}
