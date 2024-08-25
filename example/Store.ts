import { create } from 'zustand';
import { type FC } from 'react';
import { type ProjectileData } from './Projectiles';

interface GameState {
	projectiles: ProjectileData[]
	spawnProjectile: (data: ProjectileData) => void
}

const useGameStore = create<GameState>() ((set) => ({
	projectiles: [],
	spawnProjectile: (data: ProjectileData) => { 
		//console.log("should spawn a projectile with zustand");
		set((state) => ({ projectiles: [...state.projectiles, data] }));
	}

}));

export { useGameStore }
