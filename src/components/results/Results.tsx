import React, { useState, useCallback, useEffect } from 'react';
import { Modal } from '../modal';
import { Equation } from '../../types';
import './Results.css';

interface Props {
    shown: boolean,
    list: Equation[],
    color?: string,
    onReset?: () => void,
}

export default function Results(props: Props) {
    const {
        shown,
        list,
        color,
        onReset,
    } = props;
    const [resultsShown, setResultsShown] = useState(shown);

    const openHandler = useCallback(() => {
        setResultsShown(true);
    }, []);

    const closeHandler = useCallback(() => {
        setResultsShown(false);
    }, []);

    useEffect(() => {
        setResultsShown(shown)
    }, [shown]);

    return (
        <>
            <div className="results-button" onClick={openHandler}>
                <span>⏱</span>
            </div>
            <Modal open={resultsShown} onClose={closeHandler}>
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
                {list.length !== 0 && (
                    <center>
                        <button
                            className="results-list-restart-button"
                            style={{ background: color }}
                            onClick={() => {
                                if (onReset) {
                                    onReset();
                                }
                                setResultsShown(false);
                            }}
                        >
                            Start over
                        </button>
                    </center>
                )}
            </Modal>
        </>
    );
}