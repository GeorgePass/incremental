import React, { useMemo } from 'react';
import './App.css';

const PlayerStats = ({ health, maxHealth, hunger, maxHunger, equippedWeapon, armor, food, furs, silver }) => {
  const attackDamageRange = useMemo(() => {
    switch (equippedWeapon) {
      case 'fists':
        return '1 damage';
      case 'branch':
        return '1-4 damage';
      case 'sword':
        return '1-6 damage';
      default:
        return '1 damage';
    }
  }, [equippedWeapon]);

  return (
    <div className="player-stats">
      <p>Health: {health}/{maxHealth}</p>
      <p>Hunger: {hunger}/{maxHunger}</p>
      <p>Attack: {attackDamageRange}</p>
	  <p>Armor: {armor}</p> {/* Add armor stat */}
      <h3>Items</h3>
      <p>Food: {food}</p>
      <p>Furs: {furs}</p>
      <p>Silver: {silver}</p>
    </div>
  );
};

export default PlayerStats;