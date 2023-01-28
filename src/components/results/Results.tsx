import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Modal } from '../modal';
import { Equation } from '../../types';
import './Results.css';

interface Props {
    shown: boolean,
    list: Equation[],
    color?: string,
    clock?: number,
    finished: boolean,
    onReset?: () => void,
}

export default function Results(props: Props) {
    const {
        shown,
        list,
        color,
        clock,
        finished,
        onReset,
    } = props;
    const [resultsShown, setResultsShown] = useState(shown);

    const time = useMemo(() => {
        if (!clock) {
            return '';
        }

        const minutesFull = clock / 60;
        const minutes = Math.trunc(minutesFull);
        const seconds = Math.floor((minutesFull - minutes) * 60);

        let secondsStr = seconds.toString();
        let minutesStr = minutes.toString();
        if (seconds < 10) {
            secondsStr = `0${secondsStr}`;
        }
        if (minutes < 10) {
            minutesStr = `0${minutesStr}`;
        }

        return `${minutesStr}:${secondsStr}`;
    }, [clock]);

    const openHandler = useCallback(() => {
        setResultsShown(true);
    }, []);

    const closeHandler = useCallback(() => {
        setResultsShown(false);
        if (finished && onReset) {
            onReset();
        }
    }, [finished, onReset]);

    useEffect(() => {
        setResultsShown(shown)
    }, [shown]);

    return (
        <>
            <div className="results-button" onClick={openHandler}>
                <img src={`${process.env.PUBLIC_URL}/stopwatch.png`} alt="" />
            </div>
            <Modal open={resultsShown} onClose={closeHandler}>
                <div className="results-clock">{time}</div>
                {list.length === 0 && (
                    <p className="results-list-empty">No equations solved yet</p>
                )}
                {list.map((item, key) => (
                    <div key={key} className="results-list-item">
                        <div>{item.firstPart}</div>
                        <div>{item.operator}</div>
                        <div>{item.secondPart}</div>
                        <div className="results-list-star-container">
                            <span> = {eval(item.toString())}</span>
                            <span className="results-list-star">★</span>
                        </div>
                    </div>
                ))}
                {finished && (
                    <center>
                        <button
                            className="results-list-restart-button"
                            style={{ background: color }}
                            onClick={closeHandler}
                        >
                            Start over
                        </button>
                    </center>
                )}
            </Modal>
        </>
    );
}