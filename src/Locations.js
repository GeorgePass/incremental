// Locations.js
import React from 'react';
import { WOLF, BEAR } from './Creatures'; // Import creature constants
import './App.css';
const Locations = ({
  currentLocation,
  switchLocation,
  townSublocation,
  setTownSublocation,
  isFarming,
  setIsFarming,
  inCombat,
  isExploring,
  setIsExploring,
  playerAttack,
  attackCooldown,
  currentCreature, // Add currentCreature prop
  hasBranch,
  hasSword,
  equippedWeapon,
  sellFood,
  sellFur,
  buySword,
  buyLeatherArmor,
  hasLeatherArmor,
  hunger,
  food,
  furs,
  silver,
}) => {
  return (
    <div className="locations-container">
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
        <button
          onClick={() => switchLocation('town')}
          className={currentLocation === 'town' ? 'active' : ''}
        >
          A Small Town
        </button>
      </div>

      {currentLocation === 'farm' && (
        <div className="farm-location">
          <h1>Farm</h1>
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
              setIsFarming(!isFarming);
            }}
          >
            {isFarming ? "Stop Farming" : "Start Farming"}
          </button>
        </div>
      )}

      {currentLocation === 'forest' && (
        <div className="forest-location">
          <h1>Forest</h1>
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
                  {currentCreature.type === 'wolf' ? `
   /\\         /\\
  (oo)       (oo)
  (  )       (  )
   \\/         \\/
                  ` : `
   /\\         /\\
  (  )       (  )
  (oo)       (oo)
   \\/         \\/
                  `}
                </pre>
              </div>
              <p>A {currentCreature.type === 'wolf' ? 'wolf' : 'bear'} is attacking you!</p>
              <p>{currentCreature.type === 'wolf' ? 'Wolf' : 'Bear'} Health: {currentCreature.health}/{currentCreature.type === 'wolf' ? WOLF.health : BEAR.health}</p>
              <button
                onClick={playerAttack} // Call playerAttack directly
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
        </div>
      )}

      {currentLocation === 'town' && (
        <div className="town-location">
          <h1>A Small Town</h1>
          <div className="location-buttons">
            <button
              onClick={() => setTownSublocation('streets')}
              className={townSublocation === 'streets' ? 'active' : ''}
            >
              Streets
            </button>
            <button
              onClick={() => setTownSublocation('shop')}
              className={townSublocation === 'shop' ? 'active' : ''}
            >
              Shop
            </button>
          </div>

          {townSublocation === 'streets' && (
            <div className="ascii-art">
              <pre>
                {`
   _______
  /       \\
 |  Town   |
  \\_______/
    |   |
    |   |
    |   |
                    `}
              </pre>
              <p>You are in the streets of the town.</p>
            </div>
          )}

          {townSublocation === 'shop' && (
            <div className="shop">
              <h2>Shop</h2>
              <button onClick={() => sellFood(1)} disabled={food < 1}>
                Sell 1 Food (1 Silver)
              </button>
              <button onClick={() => sellFur(1)} disabled={furs < 1}>
                Sell 1 Fur (100 Silver)
              </button>
              <button onClick={() => buySword()} disabled={silver < 250 || hasSword}>
                Buy Sword (250 Silver)
              </button>
			  <button onClick={() => buyLeatherArmor()} disabled={silver < 100 || hasLeatherArmor}>
				Buy Leather Armor (100 Silver)
				</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Locations;