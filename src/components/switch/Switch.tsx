import React from 'react';
import './Switch.css';

interface Props {
    on: boolean,
    color?: string,
    className?: string,
    onChange: (value: boolean) => void,
}

export default function Switch(props: Props) {
    return (
        <label className={`switch ${props.className}`}>
            <input
                type="checkbox"
                checked={props.on}
                onChange={(event) => {
                    props.onChange(event.target.checked);
                }}
            />
            <span className="slider">
                <span className="slider-toggle" style={{ background: props.color }} />
            </span>
        </label>
    );
}