import { interactionGroups, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useGameStore } from "./Store"
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CollissionGroup } from "./CollisionGroups";


export default function Projectiles() {
	const projectiles = useGameStore((state) => state.projectiles);
	return projectiles.map((data, i) => <Projectile key={i} data={data}/>);
}

interface ProjectileData {
	pos: THREE.Vector3,
	targetPos: THREE.Vector3
}

function Projectile({data}) {

	const ref = useRef<RapierRigidBody>();
	const originPos: THREE.Vector3 = useMemo(() => data.pos, []);

	useEffect(() => {	
		let direction: THREE.Vector3 = new THREE.Vector3(
			data.targetPos.x - data.pos.x,
			data.targetPos.y - data.pos.y,
			data.targetPos.z - data.pos.z 
		);

		ref.current?.setLinvel(
			new THREE.Vector3(
				direction.x * 2,
				direction.y * 2,
				direction.z * 2
			),
			false
		);
	}, []);

	return ( 
		<RigidBody 
			mass={0.1} 
			ref={ref}
			collisionGroups={interactionGroups([CollissionGroup.projectile], [CollissionGroup.enemy, CollissionGroup.environment])}
			position={originPos}
		>
			<mesh
				castShadow
				receiveShadow
			>
				<boxGeometry args={[0.5, 0.5, 0.5]} />
				<meshStandardMaterial color="orange" />
			</mesh>
		</RigidBody>
	)
}

export { type ProjectileData }