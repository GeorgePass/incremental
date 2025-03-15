import React, { useState, useEffect } from 'react';
import PlayerStats from './PlayerStats';

const Dungeon = ({ playerStats, onExitDungeon }) => {
  const [currentFloor, setCurrentFloor] = useState(0); // Start at floor 0
  const [currentRoom, setCurrentRoom] = useState(0); // Start at room 0
  const [dungeon, setDungeon] = useState(generateDungeon());




  // Generate a simple dungeon with empty rooms
  function generateDungeon() {
    return [
      // Floor 1
      [
        { id: 1, description: "A dimly lit room with stone walls.", event: "empty" },
        { id: 2, description: "A room filled with eerie silence.", event: "empty" },
      ],
      // Floor 2
      [
        { id: 3, description: "A room with a faint smell of sulfur.", event: "empty" },
      ],
    ];
  }

  // Handle moving to the next room
  const handleNextRoom = () => {
    
        const currentFloorRooms = dungeon[currentFloor]; // Get rooms for the current floor
  const randomRoom = Math.floor(Math.random() * currentFloorRooms.length); // Random room index
  setCurrentRoom(randomRoom); // Set the current room to the random room
    
  };

  // Handle the current room event
  const handleRoomEvent = () => {
    const room = dungeon[currentFloor][currentRoom];
    switch (room.event) {
      case "empty":
        // Empty room: Do nothing
        break;
      // Add more cases for combat, traps, treasure, etc.
      default:
        break;
    }
  };

  // Render the current room
  const renderRoom = () => {
    const room = dungeon[currentFloor][currentRoom];
    return (
      <div>
        <h2>Floor {currentFloor + 1}, Room {room.id}</h2>
        <p>{room.description}</p>
        <p>This room is empty.</p>
        <div className="ascii-art">
          <pre>
            {`
              _______
             |       |
             |       |
             |       |
             |_______|
            `}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="dungeon-container">
      <div className="dungeon-ui">
        <PlayerStats
          health={playerStats.health}
          maxHealth={playerStats.maxHealth}
          hunger={playerStats.hunger}
          maxHunger={playerStats.maxHunger}
          equippedWeapon={playerStats.equippedWeapon}
          armor={playerStats.armor}
          food={playerStats.food}
          furs={playerStats.furs}
          silver={playerStats.silver}
        />
      </div>
      <div className="dungeon-content">
        {renderRoom()}
        <button onClick={handleNextRoom}>Next Room</button>
        <button onClick={onExitDungeon}>Exit Dungeon</button>
      </div>
    </div>
  );
};

export default Dungeon;