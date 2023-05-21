import { fireEvent, render } from '@testing-library/react';

import Calculator from './index';

type ButtonPress =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '0'
  | '+'
  | '-'
  | '×'
  | '÷'
  | '='
  | 'Clear'
  | 'All Clear'
  | ','
  | '%'
  | '+/-';
type ButtonPresses = ButtonPress[];
type ExpectedDisplay = string;
type TestCase = [ButtonPresses, ExpectedDisplay];

const testCases: TestCase[] = [
  [['1'], '1'],
  [['1', '1'], '11'],
  [['1', '+', '3', '='], '4'],
  [['7', '-', '4', '='], '3'],
  [['5', '×', '6', '='], '30'],
  [['8', '÷', '2', '=', '='], '2'],
  [['1', '8', '÷', '9', '='], '2'],
  [['1', '2', '3'], '123'],
  [['1', '2', '+'], '12'],
  [['1', '2', '3', '+', '4', '='], '127'],
  [['1', '2', '3', '+', '4', '-', '5', '='], '122'],
  [['1', '+', '2', '=', '3', '+', '4', '='], '7'],
  [['1', '2', '3', '+', 'Clear'], '0'],
  [['1', '2', '3', '+', '+'], '123'],
  [['1', '2', '3', '+', '+', '='], '123'],
  [['1', '2', '3', '×', '4', '÷', '5', '='], '98.4'],
  [['9', '×', '9', '=', 'Clear'], '0'],
  [['1', '2', '3', ',', '4', '5', '+', '6', '7', '+/-', '+'], '56.45'],
  [['2', '5', '0', '0', '0', '0', '0', '%'], '25000'],
];
describe('Calculator', () => {
  it('should match snapshot', async () => {
    const { container } = render(<Calculator />);

    expect(container).toMatchSnapshot();
  });

  it.each(testCases)('%#: %s', async (buttonPresses, display) => {
    const { getByRole, getByTestId } = render(<Calculator />);

    buttonPresses.forEach((button) => {
      fireEvent.click(getByRole('button', { name: button }));
    });

    expect(getByTestId('display').textContent).toBe(display);
  });
});
