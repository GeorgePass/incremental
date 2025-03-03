// Combat.js
import { useState, useEffect, useRef } from 'react';

const Combat = (initialHealth, addMessage, equippedWeapon, hunger, maxHealth) => {
  const [health, setHealth] = useState(initialHealth);
  const [inCombat, setInCombat] = useState(false);
  const [currentCreature, setCurrentCreature] = useState(null);
  const [attackCooldown, setAttackCooldown] = useState(0);
	const hungerRef = useRef(hunger);

 // Update hungerRef whenever hunger changes
  useEffect(() => {
    hungerRef.current = hunger;
  }, [hunger]);

  // Health regeneration logic
  useEffect(() => {
    let interval;
    if (health < maxHealth && hungerRef.current > 0) { // Use hungerRef.current instead of hunger
      interval = setInterval(() => {
        setHealth((prevHealth) => {
          const newHealth = prevHealth + 1;
          return newHealth >= maxHealth ? maxHealth : newHealth;
        });
      }, 5000); // Regenerate 1 HP every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [health, maxHealth]); // Remove hunger from dependencies

  // Start combat with a creature
  const startCombat = (creature) => {
    setCurrentCreature(creature);
    setInCombat(true);
    addMessage(`A ${creature.type} appears! Prepare for combat!`);
  };

  // End combat
  const endCombat = () => {
    setInCombat(false);
    setCurrentCreature(null);
  };

  // Player attack logic
  const playerAttack = () => {
    const attackCooldownDuration = hunger > 0 ? 4 : 8;
    if (!inCombat || attackCooldown > 0) return;

    let damage;
    switch (equippedWeapon) {
      case 'fists':
        damage = 1;
        break;
      case 'branch':
        damage = Math.floor(Math.random() * 4) + 1;
        break;
      case 'sword':
        damage = Math.floor(Math.random() * 6) + 1;
        break;
      default:
        damage = 1;
    }

    setCurrentCreature((prevCreature) => {
      const newHealth = Math.max(0, prevCreature.health - damage);
      return { ...prevCreature, health: newHealth };
    });
    addMessage(`You hit the ${currentCreature.type} for ${damage} damage!`);

    if (currentCreature.health - damage <= 0) {
      addMessage(`You defeated the ${currentCreature.type}! You gained ${currentCreature.fursDropped} furs.`);
      setInCombat(false);
    }

    setAttackCooldown(attackCooldownDuration);
  };

  // Attack cooldown logic
  useEffect(() => {
    let interval;
    if (attackCooldown > 0) {
      interval = setInterval(() => {
        setAttackCooldown((prevCooldown) => Math.max(0, prevCooldown - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [attackCooldown]);

  // Creature attack logic
  useEffect(() => {
    let interval;
    if (inCombat) {
      interval = setInterval(() => {
        const damage = Math.floor(Math.random() * (currentCreature.maxDamage - currentCreature.minDamage + 1)) + currentCreature.minDamage;
        setHealth((prevHealth) => Math.max(0, prevHealth - damage));
        addMessage(`The ${currentCreature.type} hit you for ${damage} damage!`);

       if (health - damage <= 0) {
          addMessage(`You were defeated by the ${currentCreature.type}!`);
          endCombat();
        }
      }, 4000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [inCombat,health]);

  return {
    health,
    inCombat,
    currentCreature,
    attackCooldown,
    playerAttack,
    startCombat,
    endCombat,
  };
};

export default Combat;