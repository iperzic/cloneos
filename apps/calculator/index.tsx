import { useEffect, useRef } from 'react';
import classnames from 'classnames';

import useCalculator from './useCalculator';
import { Operator } from './types';
import styles from './styles.module.css';

export default function Calculator() {
  const {
    display,
    allClear,
    highlightedOperator,
    animationKey,
    operate,
    input,
    clearAll,
    clear,
    negate,
    percent,
    decimal,
    calculate,
  } = useCalculator();
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animationKey && displayRef.current?.animate) {
      displayRef.current.animate([{ opacity: '0' }, { opacity: '1' }], {
        duration: 70,
        iterations: 1,
        easing: 'steps(1)',
      });
    }
  }, [animationKey]);

  return (
    <div className={styles.calculator}>
      <div className={styles.display} ref={displayRef} data-testid="display">
        {display}
      </div>
      <div className={styles.keyboard}>
        {allClear ? (
          <button
            type="button"
            className={classnames(styles.button, styles.buttonUtil)}
            aria-label="All Clear"
            onClick={clearAll}
          >
            AC
          </button>
        ) : (
          <button
            type="button"
            className={classnames(styles.button, styles.buttonUtil)}
            aria-label="Clear"
            onClick={clear}
          >
            C
          </button>
        )}
        <button
          type="button"
          className={classnames(styles.button, styles.buttonUtil)}
          onClick={negate}
        >
          +/-
        </button>
        <button
          type="button"
          className={classnames(styles.button, styles.buttonUtil)}
          onClick={percent}
        >
          %
        </button>
        <button
          type="button"
          className={classnames(styles.button, styles.buttonOperator, {
            [styles.buttonOperatorHighlighted]:
              highlightedOperator === Operator.DIVIDE,
          })}
          onClick={() => operate(Operator.DIVIDE)}
        >
          {Operator.DIVIDE}
        </button>

        <button
          type="button"
          className={classnames(styles.button)}
          onClick={() => input(7)}
        >
          7
        </button>
        <button
          type="button"
          className={classnames(styles.button)}
          onClick={() => input(8)}
        >
          8
        </button>
        <button
          type="button"
          className={classnames(styles.button)}
          onClick={() => input(9)}
        >
          9
        </button>
        <button
          type="button"
          className={classnames(styles.button, styles.buttonOperator, {
            [styles.buttonOperatorHighlighted]:
              highlightedOperator === Operator.MULTIPLY,
          })}
          onClick={() => operate(Operator.MULTIPLY)}
        >
          {Operator.MULTIPLY}
        </button>

        <button
          type="button"
          className={classnames(styles.button)}
          onClick={() => input(4)}
        >
          4
        </button>
        <button
          type="button"
          className={classnames(styles.button)}
          onClick={() => input(5)}
        >
          5
        </button>
        <button
          type="button"
          className={classnames(styles.button)}
          onClick={() => input(6)}
        >
          6
        </button>
        <button
          type="button"
          className={classnames(styles.button, styles.buttonOperator, {
            [styles.buttonOperatorHighlighted]:
              highlightedOperator === Operator.SUBTRACT,
          })}
          onClick={() => operate(Operator.SUBTRACT)}
        >
          {Operator.SUBTRACT}
        </button>

        <button
          type="button"
          className={classnames(styles.button)}
          onClick={() => input(1)}
        >
          1
        </button>
        <button
          type="button"
          className={classnames(styles.button)}
          onClick={() => input(2)}
        >
          2
        </button>
        <button
          type="button"
          className={classnames(styles.button)}
          onClick={() => input(3)}
        >
          3
        </button>
        <button
          type="button"
          className={classnames(styles.button, styles.buttonOperator, {
            [styles.buttonOperatorHighlighted]:
              highlightedOperator === Operator.ADD,
          })}
          onClick={() => operate(Operator.ADD)}
        >
          {Operator.ADD}
        </button>

        <button
          type="button"
          className={classnames(styles.button, styles.buttonWide)}
          onClick={() => input(0)}
        >
          0
        </button>
        <button
          type="button"
          className={classnames(styles.button)}
          onClick={decimal}
        >
          ,
        </button>
        <button
          type="button"
          className={classnames(styles.button, styles.buttonOperator)}
          onClick={calculate}
        >
          =
        </button>
      </div>
    </div>
  );
}
