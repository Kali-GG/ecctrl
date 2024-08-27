import { create } from 'zustand';
import { type ProjectileData } from './Projectiles';
import { type EnemyData } from './Enemies';
import * as THREE from "three";

interface ProjectilesState {
	list: ProjectileData[],
	spawn: (data: ProjectileData) => void,
	setActive: (id: number, active: boolean) => void
}

const useStoreProjectiles = create<ProjectilesState>() ((set, get) => ({
	list: [],
	spawn: (data: ProjectileData) => { 
		set((state) => ({ list: [...state.list, data] }));
	},
	setActive: (id: number, active: boolean) => {
		const nextProjectiles = get().list;
		nextProjectiles[id].active = active;
		set((state) => ({ list: [...state.list] }));
	}
}));

interface EnemiesState {
	list: EnemyData[],
	spawn: (data: EnemyData) => void,
}

const useStoreEnemies = create<EnemiesState>() ((set, get) => ({
	list: [],
	spawn: (data: EnemyData) => {
		set( (state) => ({ list: [...state.list, data] }));
	},
}));





export { useStoreProjectiles, useStoreEnemies }
