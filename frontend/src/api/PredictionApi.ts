export async function getPrediction(input: {
    userId: string,
    itemIds: string[]
}) {
    const response = await fetch('https://localhost:5000/api/prediction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'        
        },
        body: JSON.stringify(input)
    });

    if (!response.ok) {
        throw new Error('Failed to fetch prediction');
    }

    return response.json();
};