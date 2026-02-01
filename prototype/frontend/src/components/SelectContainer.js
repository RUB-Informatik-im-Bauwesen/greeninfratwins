import react, { useState } from 'react';

const SelectContainer = ({ children }) => {
    const [selected, setSelected] = useState('');
    
    const handleChange = (event) => {
        setSelected(event.target.value);
    };
    
    return (
        <div>
        <select value={selected} onChange={handleChange}>
            {children}
        </select>
        <p>{selected}</p>
        </div>
    );
    }