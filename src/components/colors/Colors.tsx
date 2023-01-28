import React, { useState, useCallback } from 'react';
import { Modal } from '../modal';
import { colors } from '../../constants';
import './Colors.css';

interface Props {
    color: string,
    onChoose: (color: string) => void,
}

export default function Colors(props: Props) {
    const {
        color,
        onChoose,
    } = props;
    const [resultsShown, setResultsShown] = useState(false);

    const openHandler = useCallback(() => {
        setResultsShown(true);
    }, []);

    const closeHandler = useCallback(() => {
        setResultsShown(false);
    }, []);

    return (
        <>
            <div className="colors-button" onClick={openHandler}>
                <img src={`${process.env.PUBLIC_URL}/flower.png`} alt="" />
            </div>
            <Modal open={resultsShown} onClose={closeHandler}>
                <div className="colors-container">
                    {colors.map(item => (
                        <div
                            key={item}
                            className="color-block-wrapper"
                            onClick={() => onChoose(item)}
                        >
                            <div className="color-block" style={{ background: item }}>
                                {color === item && (
                                    <span>✓</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    );
}