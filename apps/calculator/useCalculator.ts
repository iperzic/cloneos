import { useReducer } from 'react';
import { Action, ActionType, Operator, State } from './types';

function performCalculation(
  value1: number,
  value2: number,
  operator: Operator
) {
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

function generateAnimationKey(): string {
  return (Math.random() + 1).toString(36).substring(7);
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
  highlightedOperator: null,
  animationKey: null,
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
        animationKey: generateAnimationKey(),
      };
    case ActionType.ALL_CLEAR:
      return { ...initialState, animationKey: generateAnimationKey() };
    case ActionType.SET_VALUE: {
      const newValue = `${
        state.currentNumber === null
          ? action.payload
          : state.currentNumber + action.payload
      }`;
      return {
        ...state,
        allClear: false,
        currentNumber: newValue,
        display: newValue,
      };
    }
    case ActionType.SET_OPERATOR: {
      let {
        currentNumber,
        lastNumber,
        operator,
        result,
        decimal,
        equals,
        display,
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
        result = performCalculation(
          lastNumber,
          parseFloat(currentNumber),
          operator
        );
        operator = action.payload;
        lastNumber = result;
        currentNumber = null;
        display = `${result}`;
      } else if (
        lastNumber === null &&
        currentNumber !== null &&
        operator === null
      ) {
        operator = action.payload;
        lastNumber = parseFloat(currentNumber);
        currentNumber = null;
        display = `${lastNumber}`;
      } else if (
        lastNumber === null &&
        currentNumber === null &&
        operator === null
      ) {
        display = '0';
      }
      return {
        ...state,
        currentNumber,
        lastNumber,
        display,
        operator,
        result,
        equals,
        decimal,
        highlightedOperator: action.payload,
        animationKey: generateAnimationKey(),
      };
    }
    case ActionType.CALCULATE: {
      if (state.lastNumber && state.currentNumber && state.operator) {
        const val = performCalculation(
          state.lastNumber,
          parseFloat(state.currentNumber),
          state.operator
        );
        return {
          ...state,
          result: val,
          lastNumber: val,
          display: `${val}`,
          equals: true,
          highlightedOperator: null,
          animationKey: generateAnimationKey(),
        };
      }
      return state;
    }
    case ActionType.DECIMAL: {
      if (!state.decimal) {
        const newValue =
          state.currentNumber === null ? `${0}.` : `${state.currentNumber}.`;
        return {
          ...state,
          decimal: true,
          currentNumber: newValue,
          display: newValue,
        };
      }
      return { ...state, display: state.currentNumber ?? '0', allClear: false };
    }
    case ActionType.PERCENT: {
      if (state.result !== null) {
        const newValue = state.result / 100;
        return {
          ...state,
          display: `${newValue}`,
          result: newValue,
          animationKey: generateAnimationKey(),
        };
      }
      if (state.currentNumber !== null) {
        const newValue = parseFloat(state.currentNumber) / 100;
        return {
          ...state,
          display: `${newValue}`,
          currentNumber: `${newValue}`,
          animationKey: generateAnimationKey(),
        };
      }

      return state;
    }
    case ActionType.NEGATE: {
      if (state.result !== null) {
        const newValue = state.result * -1;
        return {
          ...state,
          display: `${newValue}`,
          result: newValue,
          animationKey: generateAnimationKey(),
        };
      }
      if (state.currentNumber !== null) {
        const newValue = parseFloat(state.currentNumber) * -1;
        return {
          ...state,
          display: `${newValue}`,
          currentNumber: `${newValue}`,
          animationKey: generateAnimationKey(),
        };
      }

      return state;
    }
    default:
      return state;
  }
}
export default function useCalculator() {
  const [{ display, allClear, highlightedOperator, animationKey }, dispatch] =
    useReducer(reducer, initialState);

  function operate(operator: Operator) {
    dispatch({ type: ActionType.SET_OPERATOR, payload: operator });
  }

  function input(value: number) {
    dispatch({ type: ActionType.SET_VALUE, payload: value });
  }

  function clearAll() {
    dispatch({ type: ActionType.ALL_CLEAR });
  }

  function clear() {
    dispatch({ type: ActionType.CLEAR });
  }

  function negate() {
    dispatch({ type: ActionType.NEGATE });
  }
  function percent() {
    dispatch({ type: ActionType.PERCENT });
  }

  function decimal() {
    dispatch({ type: ActionType.DECIMAL });
  }
  function calculate() {
    dispatch({ type: ActionType.CALCULATE });
  }
  return {
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
  };
}
