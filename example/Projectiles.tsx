import { BallCollider, interactionGroups, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useStoreProjectiles } from "./Store"
import { useEffect, useMemo, useRef, useState } from "react";
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
	const [active, setActive] = useState(true);
	const ref = useRef<RapierRigidBody>();
	const originPos: THREE.Vector3 = useMemo(() => props.data.pos, []);

	useEffect(() => {	
		let direction: THREE.Vector3 = new THREE.Vector3(
			props.data.targetPos.x - props.data.pos.x,
			props.data.targetPos.y - props.data.pos.y,
			props.data.targetPos.z - props.data.pos.z 
		).normalize();

		ref.current?.setLinvel(
			direction.multiplyScalar(20),
			false
		);

		setTimeout( () => { setActive(false) }, 3000 );
	}, []);

	return ( 
		active ? <RigidBody 
			mass={0.001} 
			ref={ref}
			colliders={false}
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
						setActive(false);
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
		</RigidBody> : null
	)
}

export { type ProjectileData }