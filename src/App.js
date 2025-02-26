import React, { useState } from 'react';
import './App.css';

function App() {
  const [points, setPoints] = useState(0);

  const incrementPoints = () => {
    setPoints(points + 1);
  };

  return (
    <div className="App">
      <h1>Incremental Game</h1>
      <p>Points: {points}</p>
      <button onClick={incrementPoints}>Click Me!</button>
    </div>
  );
}

export default App;