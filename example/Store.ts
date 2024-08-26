import { create } from 'zustand';
import Projectiles, { type ProjectileData } from './Projectiles';

interface GameState {
	projectiles: ProjectileData[],
	spawnProjectile: (data: ProjectileData) => void,
	setProjectileActive: (id: number, active: boolean) => void
}

const useGameStore = create<GameState>() ((set, get) => ({
	projectiles: [],
	spawnProjectile: (data: ProjectileData) => { 
		//console.log("should spawn a projectile with zustand");
		set((state) => ({ projectiles: [...state.projectiles, data] }));
	},
	setProjectileActive: (id: number, active: boolean) => {
		const nextProjectiles = get().projectiles;
		nextProjectiles[id].active = active;
		set((state) => ({ projectiles: [...state.projectiles] }));
	}
}));

export { useGameStore }
