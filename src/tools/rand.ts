export function getRandomArbitrary(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
}

export function getRandomListItem(operators: string[]) {
    const operatorIndex = Math.floor(Math.random() * operators.length);
    return operators[operatorIndex];
}