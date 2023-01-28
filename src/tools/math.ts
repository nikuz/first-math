import { getRandomArbitrary, getRandomListItem } from './rand';
import { maxDigit } from '../constants';
import { Equation, Mode, Operator } from '../types';

export function generateEquation(mode: Mode, equations: Equation[]): Equation {
    const firstPartMin = mode === Mode.hard ? 10 : 1;
    const firstPartMax = mode === Mode.hard ? 20 : 10;

    let operator = getRandomListItem(Object.values(Operator)) as Operator;
    let secondPart = getRandomArbitrary(1, 10);
    let firstPart = getRandomArbitrary(firstPartMin, firstPartMax);

    if (operator === Operator.plus && firstPart + secondPart > maxDigit) {
        operator = Operator.minus;
    }

    if (operator === Operator.minus) {
        while (firstPart < secondPart) {
            firstPart = getRandomArbitrary(firstPartMin, firstPartMax);
        }
    }

    const newEquation = new Equation(firstPart, operator, secondPart);

    for (const equation of equations) {
        if (
            equation.firstPart === newEquation.firstPart
            && equation.operator === newEquation.operator
            && equation.secondPart === newEquation.secondPart
        ) {
            return generateEquation(mode, equations);
        }
    }

    return newEquation;
}