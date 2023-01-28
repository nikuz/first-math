import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import cl from 'classnames';
import { Fireworks, FireworksHandlers } from '@fireworks-js/react'
import { Switch, Results, Colors } from './components';
import {
    generateEquation,
    getRandomListItem,
} from './tools';
import './App.css';
import { maxEquationsInRow, colors, fireworksTime } from './constants';
import { Equation, Mode } from './types';

function App() {
    const [mode, setMode] = useState<Mode>(Mode.hard);
    const [result, setResult] = useState<number>();
    const [equations, setEquations] = useState<Equation[]>([]);
    const [color, setColor] = useState(getRandomListItem(colors));
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [equation, setEquation] = useState<Equation>(generateEquation(mode, equations));
    const [finished, setFinished] = useState(false);
    const [clock, setClock] = useState<number>(0);
    const fireworks = useRef<FireworksHandlers>(null);
    const resultElement = useRef<HTMLDivElement>(null);
    const equationElement = useRef<HTMLDivElement>(null);
    const timer = useRef<ReturnType<typeof setInterval>>();

    const clockHandler = useCallback(() => {
        setClock((clock) => clock + 1);
    }, []);

    const refreshHandler = useCallback((newMode?: Mode) => {
        setEquation(generateEquation(newMode ?? mode, equations));
        clearInterval(timer.current);
        timer.current = setInterval(clockHandler, 1000);
        if (resultElement.current) {
            resultElement.current.innerText = '';
        }
    }, [mode, equations, clockHandler]);

    const modeChangeHandler = useCallback((value: boolean) => {
        const newMode = value ? Mode.hard : Mode.easy;
        setMode(newMode);
        refreshHandler(newMode);
    }, [refreshHandler]);

    const resultEditHandler = useCallback((event: React.ChangeEvent<HTMLDivElement>) => {
        let value = event.currentTarget.textContent ?? '';
        if (Number.isNaN(Number(value))) {
            value = '';
        }
        if (resultElement.current) {
            resultElement.current.innerText = value.substring(0, 2);
            const range = document.createRange();
            const sel = window.getSelection();
            const node = resultElement.current.childNodes[0] as Text | undefined;
            if (node) {
                range.setStart(node, node.length);
                range.collapse(true);

                sel?.removeAllRanges();
                sel?.addRange(range);
            }
            if (result) {
                setResult(undefined);
            }
            if (error) {
                setError(false);
            }
        }
    }, [result, error]);

    const resultBlurHandler = useCallback(() => {
        if (!success && resultElement.current) {
            resultElement.current.focus();
        }
    }, [success]);

    const resultKeydownHandler = useCallback((event: React.KeyboardEvent) => {
        const value = resultElement.current?.innerText;
        if (event.key === 'Enter' && value && value !== '') {
            setResult(Number(value));
        }
    }, []);

    const loop = useCallback(() => {
        setEquations([
            ...equations,
            equation,
        ]);
        setSuccess(false);
        fireworks.current?.stop();
        refreshHandler();
        resultElement.current?.focus();
        equationElement.current?.classList.remove('fade');
    }, [equation, equations, refreshHandler]);

    const resetHandler = useCallback(() => {
        setEquations([]);
        setFinished(false);
        refreshHandler();
        setTimeout(() => {
            resultElement.current?.focus();
        }, 100);
    }, [refreshHandler]);

    useEffect(() => {
        if (result !== undefined) {
            const correctResult = eval(equation.toString());
            if (correctResult !== result) {
                setError(true);
            } else {
                fireworks.current?.start();
                setSuccess(true);
                setTimeout(() => {
                    resultElement.current?.blur();
                }, 100);
            }
        }
    }, [result, equation]);

    useEffect(() => {
        if (success) {
            equationElement.current?.classList.add('fade');
            clearInterval(timer.current);
            setTimeout(loop, fireworksTime);
        }
    }, [success, loop]);

    useEffect(() => {
        if (equations.length === maxEquationsInRow) {
            setFinished(true);
            clearInterval(timer.current);
        }
    }, [equations]);

    useEffect(() => {
        timer.current = setInterval(clockHandler, 1000);

        return () => clearInterval(timer.current);
    }, [clockHandler]);

    useLayoutEffect(() => {
        resultElement.current?.focus();
    }, []);

    return (
        <div className="app" style={{ background: color }}>
            <div ref={equationElement} className={cl('equation-container', { hidden: finished })}>
                <div>
                    {equation.toString()} =
                </div>
                <div
                    ref={resultElement}
                    className={cl('result', { error })}
                    contentEditable
                    onBlur={resultBlurHandler}
                    onInput={resultEditHandler}
                    onKeyDown={resultKeydownHandler}
                />
            </div>
            <Fireworks
                ref={fireworks}
                autostart={false}
                className="fireworks"
                options={{
                    autoresize: true,
                    opacity: 0.5,
                    sound: {
                        enabled: true,
                        files: [
                            `${process.env.PUBLIC_URL}/explosion0.mp3`,
                            `${process.env.PUBLIC_URL}/explosion1.mp3`,
                            `${process.env.PUBLIC_URL}/explosion2.mp3`,
                        ],
                        volume: {
                            min: 4,
                            max: 8
                        }
                    }
                }}
            />
            <div className="mode-switch-container">
                <span>Easy</span>
                <Switch
                    className="mode-switch"
                    on={mode === Mode.hard}
                    color={color}
                    onChange={modeChangeHandler}
                />
                <span>Hard</span>
            </div>
            <div
                className="refresh-button"
                onClick={() => refreshHandler()}>
                <span>↺</span>
            </div>
            <Colors
                color={color}
                onChoose={(color: string) => setColor(color)}
            />
            <Results
                shown={finished}
                list={equations}
                color={color}
                clock={clock}
                finished={finished}
                onReset={resetHandler}
            />
        </div>
    );
}

export default App;
