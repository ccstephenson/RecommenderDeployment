import { useEffect, useState } from 'react';

// Types
type ItemOption = {
  id: number;
  title: string;
};

type RecommendationResponse = {
  id: number;
  title: string;
  recommendation1: string;
  recommendation2: string;
  recommendation3: string;
  recommendation4: string;
  recommendation5: string;
};

const HomePage = () => {
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | ''>('');
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);
  
  const [contentItemOptions, setContentItemOptions] = useState<ItemOption[]>([]);
  const [selectedContentItemId, setSelectedContentItemId] = useState<number | ''>('');
  const [contentRecommendations, setContentRecommendations] =
    useState<RecommendationResponse | null>(null);

  // Fetch 5 preview items
  useEffect(() => {
    fetch('http://localhost:5000/api/Prediction/csv-preview')
      .then((res) => res.json())
      .then((data) => {
        const options: ItemOption[] = data.sample.map((item: any) => ({
          id: Number(item.id),
          title: item.title,
        }));
        setItemOptions(options);
      })
      .catch((err) => console.error('Error loading item IDs:', err));
  }, []);

  // Fetch content-based preview items
  useEffect(() => {
    fetch('http://localhost:5000/api/Prediction/content-preview')
      .then((res) => res.json())
      .then((data) => {
        const options: ItemOption[] = data.sample.map((item: any) => ({
          id: Number(item.id),
          title: item.title,
        }));
        setContentItemOptions(options);
      })
      .catch((err) => console.error('Error loading content item IDs:', err));
  }, []);

  const handleClick = async () => {
    if (!selectedItemId) return;

    try {
      console.log('Sending itemId:', selectedItemId);
      const res = await fetch(
        `http://localhost:5000/api/Prediction/recommendations/${selectedItemId}`
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Backend error:', errorText);
        alert(`Error: ${errorText}`);
        return;
      }

      const data: RecommendationResponse = await res.json();
      console.log('Recommendation response:', data);
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  const handleContentClick = async () => {
    if (!selectedContentItemId) return;

    try {
      console.log('Sending content itemId:', selectedContentItemId);
      const res = await fetch(
        `http://localhost:5000/api/Prediction/content-recommendations/${selectedContentItemId}`
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Backend error:', errorText);
        alert(`Error: ${errorText}`);
        return;
      }

      const data: RecommendationResponse = await res.json();
      console.log('Content recommendation response:', data);
      setContentRecommendations(data);
    } catch (err) {
      console.error('Error fetching content recommendations:', err);
    }
  };

  return (
    <>
      <h1>This is the home page</h1>

      <div>
        <label>Select Item ID:</label>
        <select
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(Number(e.target.value))}
        >
          <option value="">None</option>
          {itemOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} — {item.title}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleClick} disabled={!selectedItemId}>
        Get Recommendations
      </button>

      {recommendations && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Recommendations for:</h3>
          <p>
            <strong>{recommendations.title}</strong>
          </p>
          <ul>
            {[1, 2, 3, 4, 5].map((i) => {
              const key = `recommendation${i}` as keyof RecommendationResponse;
              return <li key={key}>{recommendations[key]}</li>;
            })}
          </ul>
        </div>
      )}

      <div>
        <label>Select Content Item ID:</label>
        <select
          value={selectedContentItemId}
          onChange={(e) => setSelectedContentItemId(Number(e.target.value))}
        >
          <option value="">None</option>
          {contentItemOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} — {item.title}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleContentClick} disabled={!selectedContentItemId}>
        Get Content Recommendations
      </button>

      {contentRecommendations && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Content Recommendations for:</h3>
          <p>
            <strong>{contentRecommendations.title}</strong>
          </p>
          <ul>
            {[1, 2, 3, 4, 5].map((i) => {
              const key = `recommendation${i}` as keyof RecommendationResponse;
              return <li key={key}>{contentRecommendations[key]}</li>;
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default HomePage;
