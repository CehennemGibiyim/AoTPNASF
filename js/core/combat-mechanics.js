/* Core Combat Mechanics */
export const combatStats = {
  armorPenetration: (armor, penetration) => Math.max(0, armor - penetration),
  damageReduction: (armor) => armor / (armor + 1000),
  skillDamage: (baseDamage, weaponPower, targetArmor) => {
    const reduction = targetArmor / (targetArmor + 1000);
    return baseDamage * weaponPower * (1 - reduction);
  },
  ccDuration: (baseDuration, targetResistance) => baseDuration * (1 - targetResistance / 100),
  healingEfficiency: (baseHeal, healPower, targetMaxHP) => Math.min(baseHeal * healPower, targetMaxHP * 0.5),
  movementSpeed: (baseSpeed, buffs) => baseSpeed * (1 + buffs.reduce((sum, b) => sum + b, 0))
};