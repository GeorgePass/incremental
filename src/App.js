import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [food, setFood] = useState(0);
  const maxFood = 10;
  const [isFarming, setIsFarming] = useState(false);
  const [messages, setMessages] = useState(["You woke up and see a farm."]);
  const [health, setHealth] = useState(20);
  const maxHealth = 20;
  const [activeTab, setActiveTab] = useState('world');
  const [currentLocation, setCurrentLocation] = useState('farm');
  const [isExploring, setIsExploring] = useState(false);
  const [hasBranch, setHasBranch] = useState(false);
  const [equippedWeapon, setEquippedWeapon] = useState('fists');
  const [inCombat, setInCombat] = useState(false);
  const [wolfHealth, setWolfHealth] = useState(10);
  const [attackCooldown, setAttackCooldown] = useState(0);
  const [furs, setFurs] = useState(0);
  const [hunger, setHunger] = useState(100);
  const maxHunger = 100;
  const hasInteracted = useRef(false);

  // Farm income logic
  useEffect(() => {
    let interval;
    if (isFarming) {
      interval = setInterval(() => {
        setFood((prevFood) => Math.min(maxFood, prevFood + 1)); // Generate 1 food per 3 seconds
      }, 3000); // 3000ms = 3 seconds
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

  // Explore logic
  useEffect(() => {
    let interval;
    if (isExploring) {
      interval = setInterval(() => {
        const random = Math.random(); // Generate a random number between 0 and 1
        if (random < 0.2) { // 1/5 chance
          const eventRoll = Math.random();
          if (eventRoll < 0.33 && !hasBranch) { // 33% chance to find the branch
            setMessages((prevMessages) => [
              ...prevMessages,
              "You found a stout, solid branch. Not a legendary sword, but it's better than nothing.",
            ]);
            setHasBranch(true); // Give the player the branch
          } else if (eventRoll < 0.66) { // 33% chance to find nothing
            setMessages((prevMessages) => [...prevMessages, "Nothing found."]);
          } else { // 33% chance to encounter a wolf
            setMessages((prevMessages) => [
              ...prevMessages,
              "A wolf appears! Prepare for combat!",
            ]);
            setInCombat(true); // Start combat
            setWolfHealth(10); // Reset wolf health
          }
          setIsExploring(false); // Stop exploring after an event
        }
      }, 1000); // Check every second
    }
    return () => clearInterval(interval); // Cleanup on unmount or when isExploring changes
  }, [isExploring, hasBranch]);

  // Wolf attack logic
  useEffect(() => {
    let interval;
    if (inCombat) {
      interval = setInterval(() => {
        const damage = Math.floor(Math.random() * 4) + 1; // 1-4 damage
        setHealth((prevHealth) => Math.max(0, prevHealth - damage)); // Reduce player health
        setMessages((prevMessages) => [
          ...prevMessages,
          `The wolf hit you for ${damage} damage!`,
        ]);

        if (health - damage <= 0) {
          setMessages((prevMessages) => [...prevMessages, "You were defeated by the wolf!"]);
          setInCombat(false); // End combat
        }
      }, 4000); // Attack every 4 seconds
    }
    return () => clearInterval(interval); // Cleanup on unmount or when inCombat changes
  }, [inCombat, health]);

  // Player attack logic
  const playerAttack = () => {
    const attackCooldownDuration = hunger > 0 ? 4 : 8; // 4 seconds if not famished, 8 seconds if famished
    if (!inCombat || attackCooldown > 0) return; // Only attack if in combat and cooldown is 0

    const damage = equippedWeapon === 'fists' ? 1 : Math.floor(Math.random() * 4) + 1; // 1-4 damage for branch
    setWolfHealth((prevHealth) => Math.max(0, prevHealth - damage)); // Reduce wolf health
    setMessages((prevMessages) => [
      ...prevMessages,
      `You hit the wolf for ${damage} damage!`,
    ]);

    if (wolfHealth - damage <= 0) {
      setMessages((prevMessages) => [...prevMessages, "You defeated the wolf! You gained 1 fur."]);
      setInCombat(false); // End combat
      setFurs((prevFurs) => prevFurs + 1); // Add furs
    }

    setAttackCooldown(attackCooldownDuration); // Start cooldown
  };

  // Attack cooldown logic
  useEffect(() => {
    let interval;
    if (attackCooldown > 0) {
      interval = setInterval(() => {
        setAttackCooldown((prevCooldown) => Math.max(0, prevCooldown - 1)); // Decrement cooldown
      }, 1000); // Update every second
    }
    return () => clearInterval(interval); // Cleanup on unmount or when cooldown ends
  }, [attackCooldown]);

  // Health regeneration logic
  useEffect(() => {
    let interval;
    if (health < maxHealth && hunger > 0) { // Only regenerate if not famished
      interval = setInterval(() => {
        setHealth((prevHealth) => Math.min(maxHealth, prevHealth + 1)); // Regenerate 1 HP
      }, 4000); // Regenerate every 4 seconds
    }
    return () => clearInterval(interval); // Cleanup on unmount or when health is full
  }, [health, maxHealth, hunger]);

  // Hunger logic
  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((prevHunger) => Math.max(0, prevHunger - 1)); // Decrease hunger by 1 every second
    }, 1000); // 1000ms = 1 second
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Automatically eat food when hunger drops to 0
  useEffect(() => {
    if (hunger <= 0 && food > 0) {
      setFood((prevFood) => prevFood - 1); // Consume 1 food
      setHunger(maxHunger); // Restore hunger to 100
      setMessages((prevMessages) => [...prevMessages, "You ate some food and feel less hungry."]);
    } else if (hunger <= 0 && food === 0) {
      setMessages((prevMessages) => [...prevMessages, "You are famished. Slower attack and no regeneration."]);
    }
  }, [hunger, food]);

  // Switch location logic
  const switchLocation = (location) => {
    if (currentLocation === 'farm' && location !== 'farm') {
      setIsFarming(false); // Stop farming when leaving the farm
    }
    setCurrentLocation(location);
  };

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
              onClick={() => switchLocation('farm')}
              className={currentLocation === 'farm' ? 'active' : ''}
            >
              Farm
            </button>
            <button
              onClick={() => switchLocation('forest')}
              className={currentLocation === 'forest' ? 'active' : ''}
            >
              Forest
            </button>
          </div>

          {currentLocation === 'farm' && (
            <>
              <h1>Farm</h1>
              <p className="health-indicator">Health: {health}/{maxHealth}</p>
              <p>Hunger: {hunger}/{maxHunger}</p>
              <p>Food: {food}/{maxFood}</p>
              <p>Furs: {furs}</p>
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
            </>
          )}

          {currentLocation === 'forest' && (
            <>
              <h1>Forest</h1>
              <p className="health-indicator">Health: {health}/{maxHealth}</p>
              <p>Hunger: {hunger}/{maxHunger}</p>
              <p>Food: {food}/{maxFood}</p>
              <p>Furs: {furs}</p>
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
              {inCombat ? (
                <>
                  <div className="ascii-art">
                    <pre>
                      {`
   /\\         /\\
  (oo)       (oo)
  (  )       (  )
   \\/         \\/
                      `}
                    </pre>
                  </div>
                  <p>A wolf is attacking you!</p>
                  <p>Wolf Health: {wolfHealth}/10</p>
                  <button
                    onClick={playerAttack}
                    disabled={attackCooldown > 0}
                    style={{ position: 'relative' }}
                  >
                    Attack
                    {attackCooldown > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: `${(attackCooldown / (hunger > 0 ? 4 : 8)) * 100}%`,
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                      />
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsExploring(!isExploring)}>
                    {isExploring ? "Stop Exploring" : "Explore"}
                  </button>
                  <p>You are in the forest.</p>
                </>
              )}
            </>
          )}
        </>
      )}

      {activeTab === 'equipment' && (
        <div className="equipment-tab">
          <h2>Weapon</h2>
          <p>Equipped: {equippedWeapon === 'fists' ? 'Fists' : 'Branch'}</p>
          <p>Damage:</p>
          <ul>
            <li>
              Fists: 1 damage
              <button
                onClick={() => setEquippedWeapon('fists')}
                disabled={equippedWeapon === 'fists'}
              >
                Equip Fists
              </button>
            </li>
            {hasBranch && (
              <li>
                Branch: 1-4 damage
                <button
                  onClick={() => setEquippedWeapon('branch')}
                  disabled={equippedWeapon === 'branch'}
                >
                  Equip Branch
                </button>
              </li>
            )}
          </ul>
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