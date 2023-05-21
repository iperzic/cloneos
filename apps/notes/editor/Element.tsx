import { Editor, Element as SlateElement, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { Block } from '@/apps/notes/types';

import type { RenderElementProps } from 'slate-react';

const LIST_TYPES = [
  Block.NUMBERED_LIST,
  Block.BULLETED_LIST,
  Block.DASHED_LIST,
];

export function isBlockActive(editor: ReactEditor, block: Block) {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === block,
    })
  );

  return !!match;
}

export function toggleBlock(editor: ReactEditor, block: Block) {
  const isActive = isBlockActive(editor, block);
  const isList = LIST_TYPES.includes(block);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (isActive) {
    newProperties = {
      type: Block.PARAGRAPH,
    };
  } else {
    newProperties = {
      type: isList ? Block.LIST_ITEM : block,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, { type: block, children: [] });
  }
}

export function blockRenderer({
  attributes,
  children,
  element,
}: RenderElementProps) {
  switch (element.type) {
    case Block.BULLETED_LIST:
      return <ul {...attributes}>{children}</ul>;
    case Block.TITLE:
      return <h1 {...attributes}>{children}</h1>;
    case Block.HEADING:
      return <h2 {...attributes}>{children}</h2>;
    case Block.SUBHEADING:
      return <h3 {...attributes}>{children}</h3>;
    case Block.LIST_ITEM:
      return <li {...attributes}>{children}</li>;
    case Block.NUMBERED_LIST:
      return <ol {...attributes}>{children}</ol>;
    case Block.DASHED_LIST:
      return <dl {...attributes}>{children}</dl>;
    case Block.PARAGRAPH:
    default:
      return <p {...attributes}>{children}</p>;
  }
}
