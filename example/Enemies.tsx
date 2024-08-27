import { useEffect, useMemo, useRef, useState } from "react";
import {  useStoreEnemies, useStoreProjectiles } from "./Store";
import * as THREE from "three";
import { BallCollider, interactionGroups, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { CollissionGroup as CG } from "./CollisionGroups";


export default function Enemies() {
    const enemies = useStoreEnemies((state) => state.list);
    const useStoreSpawnEnemy = useStoreEnemies( (state) => state.spawn);

    useEffect(() => { setTimeout( spawnEnemies, spawnDelay ); }, []);

    const spawnDelay: number = 6000; // spawn timer in miliseconds 

    const spawnEnemies = () => {
        useStoreSpawnEnemy({
            pos: new THREE.Vector3(
                (Math.random() - 1) * 20,
                1,
                (Math.random() - 1) * 20
            ),
            initialHealth: 2
        });
        setTimeout( spawnEnemies, spawnDelay );
    }


	return enemies.map((data, i) => <Enemy key={i} data={data}/> );
}

interface EnemyData {
	pos: THREE.Vector3,
	initialHealth: number
}

function Enemy(props: {data: EnemyData}) {
    const [active, setActive] = useState(true);
    const [health, setHealth] = useState(props.data.initialHealth);
	const ref = useRef<RapierRigidBody>();
	const originPos: THREE.Vector3 = useMemo(() => props.data.pos, []);

	//let health: number;
	//useEffect(() => { health = props.data.initialHealth; }, [])
	//todo: check if we can avoid using state for health

    if (!active) { return(<></>); }

    return(
		<RigidBody 
			mass={1.1} 
			ref={ref}
			colliders={false}
			//collisionGroups={interactionGroups([CG.projectile], [CG.enemy, CG.environment])}
			position={originPos}
		>
			<BallCollider 
                name="basic enemy"
				args={[1.5]} 
				collisionGroups={interactionGroups([CG.enemy], [CG.player, CG.enemy, CG.environment, CG.projectile, CG.weaponSensor])}
				onIntersectionEnter={({ target, other }) => {
					if (other.colliderObject?.name == "projectile") {
                        let newHealth = health -1;
                        setHealth(newHealth);
                        if (newHealth <= 0) { setActive(false); }                        
					}
				}}
			/>
			<mesh
				castShadow
				receiveShadow
			>
				<boxGeometry args={[1.5, 1.5, 1.5]} />
				<meshStandardMaterial color="red" />
			</mesh>
		</RigidBody>
    );
}



export { type EnemyData }
