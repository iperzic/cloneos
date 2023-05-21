import { ReactEditor } from 'slate-react';

import type { BaseEditor } from 'slate';

export enum Mark {
  BOLD = 'bold',
  ITALIC = 'italic',
  UNDERLINE = 'underline',
  STRIKETHROUGH = 'strikethrough',
}

export enum Block {
  TITLE = 'title',
  HEADING = 'heading',
  SUBHEADING = 'subheading',
  PARAGRAPH = 'paragraph',
  BULLETED_LIST = 'bulleted-list',
  NUMBERED_LIST = 'numbered-list',
  DASHED_LIST = 'dashed-list',
  LIST_ITEM = 'list-item',
}

type CustomElement = { type: Block; children: CustomText[] };
type CustomText = {
  text: string;
} & { [K in Mark]?: boolean };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
