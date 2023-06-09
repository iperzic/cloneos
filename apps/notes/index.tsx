import { useState, useRef } from 'react';

import { Block } from '@/apps/notes/types';
import CustomEditor from '@/apps/notes/editor/CustomEditor';
import styles from './styles.module.css';

import type { Descendant } from 'slate';
import type { FormattingHandle } from '@/apps/notes/editor/CustomEditor';

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
        <button type="button" onClick={editor.current?.title}>
          Title
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.sidebar} />
        <CustomEditor ref={editor} value={value} onChange={setValue} />
      </div>
    </div>
  );
}
