import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [silver, setSilver] = useState(0);
  const [isFarming, setIsFarming] = useState(false);
  const [messages, setMessages] = useState(["You woke up and see a farm."]);
  const [health, setHealth] = useState(100);
  const [activeTab, setActiveTab] = useState('world');
  const [currentLocation, setCurrentLocation] = useState('farm');
  const hasInteracted = useRef(false);

  // Farm income logic
  useEffect(() => {
    let interval;
    if (isFarming) {
      interval = setInterval(() => {
        setSilver((prevSilver) => prevSilver + 1); // Generate 1 silver per second
      }, 1000); // 1000ms = 1 second
    }
    return () => clearInterval(interval); // Cleanup on unmount or when isFarming changes
  }, [isFarming]);

  // Add messages when farming starts or stops
  useEffect(() => {
    if (!hasInteracted.current) return; // Skip if no interaction

    if (isFarming) {
      setMessages((prevMessages) => [...prevMessages, "You started farming."]);
    } else {
      setMessages((prevMessages) => [...prevMessages, "You stopped farming."]);
    }
  }, [isFarming]);

  return (
    <div className="App">
      <div className="tabs">
        <button
          onClick={() => setActiveTab('world')}
          className={activeTab === 'world' ? 'active' : ''}
        >
          World
        </button>
        <button
          onClick={() => setActiveTab('equipment')}
          className={activeTab === 'equipment' ? 'active' : ''}
        >
          Equipment
        </button>
      </div>

      {activeTab === 'world' && (
        <>
          <div className="location-buttons">
            <button
              onClick={() => setCurrentLocation('farm')}
              className={currentLocation === 'farm' ? 'active' : ''}
            >
              Farm
            </button>
            <button
              onClick={() => setCurrentLocation('forest')}
              className={currentLocation === 'forest' ? 'active' : ''}
            >
              Forest
            </button>
          </div>

          {currentLocation === 'farm' && (
            <>
              <h1>Farm</h1>
              <p className="health-indicator">Health: {health}/100</p>
              <div className="ascii-art">
                <pre>
                  {`
  __ _         ||| ||| ||| |||
 / _\` |        ||| ||| ||| |||
| (_| |        ||| ||| ||| |||
 \\__,_|        ||| ||| ||| |||
   ||          ||| ||| ||| |||
   ||          ||| ||| ||| |||
   ||          ||| ||| ||| |||
                  `}
                </pre>
              </div>
              <button
                onClick={() => {
                  hasInteracted.current = true; // Mark interaction
                  setIsFarming(!isFarming);
                }}
              >
                {isFarming ? "Stop Farming" : "Start Farming"}
              </button>
              <p>Silver: {silver}</p>
            </>
          )}

          {currentLocation === 'forest' && (
            <>
              <h1>Forest</h1>
              <p className="health-indicator">Health: {health}/100</p>
              <div className="ascii-art">
                <pre>
                  {`
   /\\
  /  \\
 /____\\
  ||||
  ||||
  ||||
                  `}
                </pre>
              </div>
              <p>You are in the forest. Nothing here yet.</p>
            </>
          )}
        </>
      )}

      {activeTab === 'equipment' && (
        <div className="equipment-tab">
          <h2>Weapon</h2>
          <p>Equipped: Fists</p>
        </div>
      )}

      <div className="message-log">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
}

export default App;