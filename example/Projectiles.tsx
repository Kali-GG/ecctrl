import { BallCollider, interactionGroups, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useStoreProjectiles } from "./Store"
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CollissionGroup as CG } from "./CollisionGroups";


export default function Projectiles() {
	const projectiles = useStoreProjectiles((state) => state.list);
	return projectiles.map((data, i) => <Projectile key={i} data={data} id={i}/> );
}

interface ProjectileData {
	active: boolean,
	pos: THREE.Vector3,
	targetPos: THREE.Vector3
}

function Projectile(props: {data: ProjectileData, id: number}) {
	const setProjectileActive = useStoreProjectiles((state) => state.setActive);
	const ref = useRef<RapierRigidBody>();
	const originPos: THREE.Vector3 = useMemo(() => props.data.pos, []);

	useEffect(() => {	
		let direction: THREE.Vector3 = new THREE.Vector3(
			props.data.targetPos.x - props.data.pos.x,
			props.data.targetPos.y - props.data.pos.y,
			props.data.targetPos.z - props.data.pos.z 
		).normalize();

		ref.current?.setLinvel(
			new THREE.Vector3(
				direction.x * 20,
				direction.y * 20,
				direction.z * 20
			),
			false
		);
	}, []);

	if (!props.data.active) { 
		return (<></>); 
	}

	return ( 
		<RigidBody 
			mass={0.001} 
			ref={ref}
			colliders={false}
			//collisionGroups={interactionGroups([CG.projectile], [CG.enemy, CG.environment])}
			position={originPos}
		>
			<BallCollider
				sensor
				name = "projectile"
				args={[0.5]} 
				mass={0}
				collisionGroups={interactionGroups([CG.projectile], [CG.enemy, CG.environment])}
				onIntersectionEnter={({ target, other }) => {
					if (other.rigidBodyObject?.position) {
						setProjectileActive(props.id, false);
					}
				}}
			/>
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