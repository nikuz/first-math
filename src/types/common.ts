export class Equation {
    firstPart: number;
    operator: Operator;
    secondPart: number;

    constructor(firstPart: number, operator: Operator, secondPart: number) {
        this.firstPart = firstPart;
        this.operator = operator;
        this.secondPart = secondPart;
    }

    toString = () => {
        return `${this.firstPart} ${this.operator} ${this.secondPart}`;
    };
}

export enum Operator {
    plus = '+',
    minus = '-',
}
