import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [inputData, setInputData] = useState({ key1: 'value1', key2: 'value2' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputData({
            ...inputData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert inputData to a query string
        const queryString = new URLSearchParams(inputData).toString();
        // Redirect to the process page with the query string
        navigate(`/process?${queryString}`);
    };

    return (
        <div>
            <h1>Enter Data</h1>
            <form onSubmit={handleSubmit}>
                {Object.keys(inputData).map((key) => (
                    <div key={key}>
                        <label>
                            {key}:
                            <input
                                type="text"
                                name={key}
                                value={inputData[key]}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Home;
