export enum ActionType {
  CLEAR = 'CLEAR',
  ALL_CLEAR = 'ALL_CLEAR',
  SET_VALUE = 'SET_VALUE',
  SET_OPERATOR = 'SET_OPERATOR',
  CALCULATE = 'CALCULATE',
  DECIMAL = 'DECIMAL',
  PERCENT = 'PERCENT',
  NEGATE = 'NEGATE',
}

export type Action =
    | {
      type: ActionType.CLEAR;
    } | {
      type: ActionType.ALL_CLEAR;
    }
    | {
      type: ActionType.CALCULATE;
    }
    | {
      type: ActionType.SET_VALUE;
      payload: number;
    }
    | {
      type: ActionType.SET_OPERATOR;
      payload: Operator;
    } | {
      type: ActionType.DECIMAL;
    } | {
      type: ActionType.PERCENT;
    } | {
      type: ActionType.NEGATE;
    };

export enum Operator {
  ADD = '+',
  SUBTRACT = '-',
  DIVIDE = '÷',
  MULTIPLY = '×',
}

export type State = {
  lastNumber: null | number
  currentNumber: null | string
  operator: null | Operator
  result: null | number
  decimal: boolean
  equals: boolean
  display: string
  allClear: boolean
  highlightedOperator: null | Operator
};
