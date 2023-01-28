import React, { useState, useCallback, useEffect } from 'react';
import './Modal.css';

interface Props {
    open: boolean,
    children: React.ReactNode,
    onClose: () => void,
}

export default function Modal(props: Props) {
    const { open, onClose } = props;
    const [isOpen, setIsOpen] = useState(open);

    const closeHandler = useCallback(() => {
        setIsOpen(false);
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        setIsOpen(open)
    }, [open]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-blocker" onClick={closeHandler} />
            <div className="modal-content">
                {props.children}
            </div>
        </div>
    );
}