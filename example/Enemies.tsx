import { useEffect, useMemo, useRef, useState } from "react";
import {  useStoreEnemies } from "./Store";
import * as THREE from "three";
import { BallCollider, interactionGroups, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { CollissionGroup as CG } from "./CollisionGroups";
import { playerInfo } from "./playerInfo"
import { useFrame } from "@react-three/fiber";

export default function Enemies() {
    const enemies = useStoreEnemies((state) => state.list);
    const useStoreSpawnEnemy = useStoreEnemies( (state) => state.spawn);

    useEffect(() => { setTimeout( spawnEnemies, spawnDelay ); }, []);

    const spawnDelay: number = 6000; // spawn timer in miliseconds 

    const spawnEnemies = () => {
        useStoreSpawnEnemy({
            pos: new THREE.Vector3(
                (Math.random() - 1) * 20,
                2,
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
	const ref = useRef<RapierRigidBody>();
	const originPos: THREE.Vector3 = useMemo(() => props.data.pos, []);
    const healthRef = useRef(null);
    useEffect( () => {healthRef.current = props.data.initialHealth});
    const directionToPlayer: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);

    const dispose = () => {
        ref.current?.setTranslation({
            x: 0,
            y: -20,
            z: 0,
          }, true); 
        setTimeout( () => { setActive(false) }, 500 );
    }

    useFrame(() => { 

        if (!active) { return; }
        directionToPlayer.set(
			playerInfo.position.x - originPos.x,
			playerInfo.position.y - originPos.y,
			playerInfo.position.z - originPos.z 
		).normalize();

        ref.current?.setLinvel(
			directionToPlayer.multiplyScalar(10),
			false
		);
    });

    return(
		active ? <RigidBody 
			mass={1.1} 
			ref={ref}
			colliders={false}
			position={originPos}
		>
			<BallCollider 
                name="basic enemy"
				args={[1.0]} 
				collisionGroups={interactionGroups([CG.enemy], [CG.player, CG.enemy, CG.environment, CG.projectile, CG.weaponSensor])}
				onIntersectionEnter={({ target, other }) => {
					if (other.colliderObject?.name == "projectile") {
                        healthRef.current = healthRef.current - 1;
                        if (healthRef.current <= 0) { 
                            dispose(); 
                        }                        
					}
				}}
			/>
			<mesh
				castShadow
				receiveShadow
			>
				<sphereGeometry args={[1.0]} />
				<meshStandardMaterial color="red" />
			</mesh>
		</RigidBody> : null
    );
}



export { type EnemyData }
