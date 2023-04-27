import { useReducer } from 'react';
import classnames from 'classnames';
import {
  Action, ActionType, Operator, State,
} from './types';

import styles from './styles.module.css';

export function calculate(value1: number, value2: number, operator: Operator) {
  switch (operator) {
    case Operator.DIVIDE:
      return value1 / value2;
    case Operator.MULTIPLY:
      return value1 * value2;
    case Operator.ADD:
      return +value1 + +value2;
    case Operator.SUBTRACT:
      return value1 - value2;
    default:
      return 0;
  }
}

const initialState: State = {
  lastNumber: null,
  currentNumber: null,
  decimal: false,
  equals: false,
  operator: null,
  result: null,
  display: '0',
  allClear: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.CLEAR:
      return {
        ...state,
        currentNumber: null,
        result: null,
        decimal: false,
        equals: false,
        allClear: true,
        display: '0',

      };
    case ActionType.ALL_CLEAR:
      return initialState;
    case ActionType.SET_VALUE: {
      const newValue = `${state.currentNumber === null ? action.payload : state.currentNumber + action.payload}`;
      return {
        ...state, allClear: false, currentNumber: newValue, display: newValue,
      };
    }
    case ActionType.SET_OPERATOR: {
      let {
        currentNumber, lastNumber, operator, result, decimal, equals, display,
      } = state;

      if (equals) {
        currentNumber = `${result}`;
        lastNumber = null;
        operator = null;
        result = null;
        decimal = false;
        equals = false;
        display = currentNumber ?? '0';
      }

      if (lastNumber !== null && currentNumber !== null && operator !== null) {
        result = calculate(lastNumber, parseFloat(currentNumber), operator);
        operator = action.payload;
        lastNumber = result;
        currentNumber = null;
        display = `${result}`;
      } else if (lastNumber === null && currentNumber !== null && operator === null) {
        operator = action.payload;
        lastNumber = parseFloat(currentNumber);
        currentNumber = null;
        display = `${lastNumber}`;
      } else if (lastNumber === null && currentNumber === null && operator === null) {
        display = '0';
      }
      return {
        ...state, currentNumber, lastNumber, display, operator, result, equals, decimal,
      };
    }
    case ActionType.CALCULATE: {
      if (state.lastNumber && state.currentNumber && state.operator) {
        const val = calculate(state.lastNumber, parseFloat(state.currentNumber), state.operator);
        return {
          ...state, result: val, lastNumber: val, display: `${val}`, equals: true,
        };
      }
      return state;
    }
    case ActionType.DECIMAL: {
      if (!state.decimal) {
        const newValue = state.currentNumber === null ? `${0}.` : `${state.currentNumber}.`;
        return {
          ...state, decimal: true, currentNumber: newValue, display: newValue,
        };
      }
      return { ...state, display: state.currentNumber ?? '0', allClear: false };
    }
    case ActionType.PERCENT: {
      if (state.result !== null) {
        const newValue = state.result / 100;
        return { ...state, display: `${newValue}`, result: newValue };
      }
      if (state.currentNumber !== null) {
        const newValue = parseFloat(state.currentNumber) / 100;
        return { ...state, display: `${newValue}`, currentNumber: `${newValue}` };
      }

      return state;
    }
    case ActionType.NEGATE: {
      if (state.result !== null) {
        const newValue = state.result * -1;
        return { ...state, display: `${newValue}`, result: newValue };
      }
      if (state.currentNumber !== null) {
        const newValue = parseFloat(state.currentNumber) * -1;
        return { ...state, display: `${newValue}`, currentNumber: `${newValue}` };
      }

      return state;
    }
    default:
      return state;
  }
}

export default function Calculator() {
  const [{ display, allClear }, dispatch] = useReducer(reducer, initialState);

  function operate(operator: Operator) {
    dispatch({ type: ActionType.SET_OPERATOR, payload: operator });
  }

  function input(value: number) {
    dispatch({ type: ActionType.SET_VALUE, payload: value });
  }

  return (
    <div className={styles.calculator}>
      <div className={styles.display} data-testid="display">{display}</div>
      <div className={styles.keyboard}>
        {allClear
          ? (
            <button
              type="button"
              className={classnames(styles.button, styles.buttonUtil)}
              aria-label="All Clear"
              onClick={() => dispatch({ type: ActionType.ALL_CLEAR })}
            >
              AC
            </button>
          )
          : <button type="button" className={classnames(styles.button, styles.buttonUtil)} aria-label="Clear" onClick={() => dispatch({ type: ActionType.CLEAR })}>C</button>}
        <button type="button" className={classnames(styles.button, styles.buttonUtil)} onClick={() => dispatch({ type: ActionType.NEGATE })}>+/-</button>
        <button type="button" className={classnames(styles.button, styles.buttonUtil)} onClick={() => dispatch({ type: ActionType.PERCENT })}>%</button>
        <button type="button" className={classnames(styles.button, styles.buttonOperator)} onClick={() => operate(Operator.DIVIDE)}>÷</button>

        <button type="button" className={classnames(styles.button)} onClick={() => input(7)}>7</button>
        <button type="button" className={classnames(styles.button)} onClick={() => input(8)}>8</button>
        <button type="button" className={classnames(styles.button)} onClick={() => input(9)}>9</button>
        <button type="button" className={classnames(styles.button, styles.buttonOperator)} onClick={() => operate(Operator.MULTIPLY)}>×</button>

        <button type="button" className={classnames(styles.button)} onClick={() => input(4)}>4</button>
        <button type="button" className={classnames(styles.button)} onClick={() => input(5)}>5</button>
        <button type="button" className={classnames(styles.button)} onClick={() => input(6)}>6</button>
        <button type="button" className={classnames(styles.button, styles.buttonOperator)} onClick={() => operate(Operator.SUBTRACT)}>-</button>

        <button type="button" className={classnames(styles.button)} onClick={() => input(1)}>1</button>
        <button type="button" className={classnames(styles.button)} onClick={() => input(2)}>2</button>
        <button type="button" className={classnames(styles.button)} onClick={() => input(3)}>3</button>
        <button type="button" className={classnames(styles.button, styles.buttonOperator)} onClick={() => operate(Operator.ADD)}>+</button>

        <button type="button" className={classnames(styles.button, styles.buttonWide)} onClick={() => input(0)}>0</button>
        <button type="button" className={classnames(styles.button)} onClick={() => dispatch({ type: ActionType.DECIMAL })}>,</button>
        <button type="button" className={classnames(styles.button, styles.buttonOperator)} onClick={() => dispatch({ type: ActionType.CALCULATE })}>
          =
        </button>
      </div>
    </div>
  );
}
