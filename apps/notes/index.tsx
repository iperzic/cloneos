import React, { useState, useRef } from 'react';
import { Descendant } from 'slate';

import { Block } from '@/apps/notes/types';
import CustomEditor, {
  FormattingHandle,
} from '@/apps/notes/editor/CustomEditor';

import styles from './styles.module.css';

export default function Notes() {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: Block.PARAGRAPH,
      children: [{ text: '' }],
    },
  ]);

  const editor = useRef<FormattingHandle>(null);

  return (
    <div className={styles.notes}>
      <div className={styles.toolbar}>
        <button type="button" onClick={editor.current?.bold}>
          Bold
        </button>
        <button type="button" onClick={editor.current?.italic}>
          Italic
        </button>
        <button type="button" onClick={editor.current?.underline}>
          Underline
        </button>
        <button type="button" onClick={editor.current?.strikethrough}>
          Strikethrough
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.sidebar} />
        <CustomEditor ref={editor} value={value} onChange={setValue} />
      </div>
    </div>
  );
}
