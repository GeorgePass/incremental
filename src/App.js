// App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Locations from './Locations';
import PlayerStats from './PlayerStats';
import Inventory from './Inventory';
import { WOLF, BEAR } from './Creatures';
import Combat from './Combat'; // Import the custom hook

function App() {
  const [food, setFood] = useState(0);
  const maxFood = 10;
  const [furs, setFurs] = useState(0);
  const [silver, setSilver] = useState(0);
  const [hasBranch, setHasBranch] = useState(false);
  const [hasSword, setHasSword] = useState(false);
  const [armor, setArmor] = useState(0);
	const [hasLeatherArmor, setHasLeatherArmor] = useState(false);
  const [equippedWeapon, setEquippedWeapon] = useState('fists');
  const [hunger, setHunger] = useState(100);
  const maxHunger = 100;
  const [messages, setMessages] = useState(["You woke up and see a farm."]);
  const [isFarming, setIsFarming] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('farm');
  const [townSublocation, setTownSublocation] = useState('streets');
  const [activeTab, setActiveTab] = useState('world');
	const [equippedArmor, setEquippedArmor] = useState('plain');
  const messageBarRef = useRef(null);

  // Add a new message
  const addMessage = (message) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, message];
      return newMessages.length > 10 ? newMessages.slice(-10) : newMessages;
    });
  };


  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (messageBarRef.current) {
      messageBarRef.current.scrollTop = messageBarRef.current.scrollHeight;
    }
  }, [messages]);
	
	 const onDefeatMonster = (fursDropped) => {
  setFurs((prevFurs) => prevFurs + fursDropped);
};

  // Use the custom combat hook
  const { health, inCombat, currentCreature, attackCooldown, playerAttack, startCombat } = Combat(
    20,
    addMessage,
    equippedWeapon,
    hunger,
	20,
	onDefeatMonster,
	armor,
	food	
  );
  
  // Armor
  useEffect(() => {
  if (equippedArmor === 'leather') {
    setArmor(1);
  } else {
    setArmor(0);
  }
}, [equippedArmor]);
  
  // Explore logic
  useEffect(() => {
    let interval;
    if (isExploring) {
      interval = setInterval(() => {
        if (Math.random() < 0.5) {
          if (Math.random() < 0.5 && !hasBranch) {
            addMessage("You found a stout, solid branch. Not a legendary sword, but it's better than nothing.");
            setHasBranch(true);
          } else {
            const creature = Math.random() < 0.5 ? { ...WOLF } : { ...BEAR };
            startCombat(creature); // Start combat using the custom hook
          }
          setIsExploring(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExploring, hasBranch, startCombat]);

  // Farm income logic
  useEffect(() => {
    let interval;
    if (isFarming) {
      interval = setInterval(() => {
        setFood((prevFood) => Math.min(maxFood, prevFood + 1));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isFarming]);
  
 
  
  // Hunger logic
  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((prevHunger) => Math.max(0, prevHunger - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Automatically eat food when hunger drops to 0
  useEffect(() => {
    if (hunger <= 0 && food > 0) {
      setFood((prevFood) => prevFood - 1);
      setHunger(maxHunger);
      addMessage("You ate some food and feel less hungry.");
    } else if (hunger <= 0 && food === 0) {
      addMessage("You are famished. Slower attack and no regeneration.");
    }
  }, [hunger, food]);

  // Shop logic
  const sellFood = (amount) => {
    if (food >= amount) {
      setFood((prevFood) => prevFood - amount);
      setSilver((prevSilver) => prevSilver + amount);
      addMessage(`Sold ${amount} food for ${amount} silver.`);
    }
  };

  const sellFur = (amount) => {
    if (furs >= amount) {
      setFurs((prevFurs) => prevFurs - amount);
      setSilver((prevSilver) => prevSilver + 100 * amount);
      addMessage(`Sold ${amount} fur for ${100 * amount} silver.`);
    }
  };

  const buySword = () => {
    if (silver >= 250) {
      setSilver((prevSilver) => prevSilver - 250);
      setHasSword(true);
      addMessage("You bought a sword! It deals 1-6 damage.");
    } else {
      addMessage("You don't have enough silver to buy a sword.");
    }
  };
  
  const buyLeatherArmor = () => {
  if (silver >= 100) {
    setSilver((prevSilver) => prevSilver - 100);
    setHasLeatherArmor(true);
    addMessage("You bought leather armor! It reduces damage taken by 1.");
  } else {
    addMessage("You don't have enough silver to buy leather armor.");
  }
};


  // Switch location logic
  const switchLocation = (location) => {
    if (currentLocation === 'farm' && location !== 'farm') {
      setIsFarming(false); // Stop farming when leaving the farm
    }
    setCurrentLocation(location);
  };
  
 


return (
    <div className="App">
      {/* PlayerStats is now fixed and always visible */}
      <PlayerStats
        health={health}
        maxHealth={20}
        hunger={hunger}
        maxHunger={maxHunger}
        equippedWeapon={equippedWeapon}
		armor={armor}
		food={food}
          maxFood={maxFood}
          furs={furs}
          silver={silver}
      />

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
        <div className="world-container">
          <Locations
            currentLocation={currentLocation}
            switchLocation={switchLocation}
            townSublocation={townSublocation}
            setTownSublocation={setTownSublocation}
            isFarming={isFarming}
            setIsFarming={setIsFarming}
            inCombat={inCombat}
            isExploring={isExploring}
            setIsExploring={setIsExploring}
            playerAttack={playerAttack}
            attackCooldown={attackCooldown}
            currentCreature={currentCreature}
            hasBranch={hasBranch}
            hasSword={hasSword}
            equippedWeapon={equippedWeapon}
            sellFood={sellFood}
            sellFur={sellFur}
            buySword={buySword}
            hunger={hunger}
            food={food}
            furs={furs}
            silver={silver}
			 hasLeatherArmor={hasLeatherArmor}
			 buyLeatherArmor={buyLeatherArmor}
			setHasLeatherArmor={setHasLeatherArmor}
          />
        </div>
      )}

      {activeTab === 'equipment' && (
        <Inventory
          hasBranch={hasBranch}
          hasSword={hasSword}
          equippedWeapon={equippedWeapon}
          setEquippedWeapon={setEquippedWeapon}
		  equippedArmor={equippedArmor}
			setEquippedArmor={setEquippedArmor}
			hasLeatherArmor={hasLeatherArmor}
		  equippedArmor={equippedArmor}
		  setEquippedArmor={setEquippedArmor}

        />
      )}

      <div className="message-log" ref={messageBarRef}>
        {messages.map((message, index) => (
          <p key={index} className="message">
            {message}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;