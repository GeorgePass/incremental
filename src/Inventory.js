// Inventory.js
import React from 'react';

const Inventory = ({
  food,
  maxFood,
  furs,
  silver,
  hasBranch,
  hasSword,
  equippedWeapon,
  setEquippedWeapon,
  hasLeatherArmor,
  equippedArmor,
  setEquippedArmor,
}) => {
  return (
    <div className="inventory">
      <h2>Inventory</h2>

      {/* Weapons Section */}
      <h3>Weapons</h3>
      <ul className="weapons-list">
        <li>
          Fists: 1 damage
          <button
            onClick={() => setEquippedWeapon('fists')}
            disabled={equippedWeapon === 'fists'}
            className="equip-button"
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
              className="equip-button"
            >
              Equip Branch
            </button>
          </li>
        )}
        {hasSword && (
          <li>
            Sword: 1-6 damage
            <button
              onClick={() => setEquippedWeapon('sword')}
              disabled={equippedWeapon === 'sword'}
              className="equip-button"
            >
              Equip Sword
            </button>
          </li>
        )}
      </ul>

      {/* Armor Section */}
      <h3>Worn Armor</h3>
      <ul className="weapons-list">
        <li>
          Plain Clothes: 0 armor
          <button
            onClick={() => setEquippedArmor('plain')}
            disabled={equippedArmor === 'plain'}
            className="equip-button"
          >
            Equip Plain Clothes
          </button>
        </li>
        {hasLeatherArmor && (
          <li>
            Leather Armor: 1 armor
            <button
              onClick={() => setEquippedArmor('leather')}
              disabled={equippedArmor === 'leather'}
              className="equip-button"
            >
              Equip Leather Armor
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Inventory;