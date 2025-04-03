import { useState } from "react";
import { getPrediction } from "../api/PredictionApi";

const HomePage = () => {

    const [result, setResult] = useState(null);
    const [userId, setUserId] = useState('');
    const [itemId, setItemId] = useState('');

    const handleClick = async () => {
        try {
            const input = userId
                ? { userId, itemIds: [] }
                : { userId: 'anonymous', itemIds: [itemId] };

            const prediction = await getPrediction(input);
            setResult(prediction);
        } catch (error) {
            console.error('Error fetching prediction:', error);
        }
    };
    
    return (
        <>
            <h1>This is the home page</h1>
            <div>
                <label>Select User ID:</label>
                <select value={userId} onChange={(e) => { setUserId(e.target.value); setItemId(''); }} disabled={!!itemId}>
                    <option value="">None</option>
                    <option value="user_123">user_123</option>
                    <option value="user_456">user_456</option>
                </select>
            </div>
            <div>
                <label>Select Item ID:</label>
                <select value={itemId} onChange={(e) => { setItemId(e.target.value); setUserId(''); }} disabled={!!userId}>
                    <option value="">None</option>
                    <option value="item1">item1</option>
                    <option value="item2">item2</option>
                </select>
            </div>
            <button onClick={handleClick}>Get Recommendations</button>
            {result && (
                <pre>{JSON.stringify(result, null, 2)}</pre>
            )}
        
        </>
    )
}

export default HomePage;