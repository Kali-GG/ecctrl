import { CylinderCollider, interactionGroups, RapierRigidBody, RigidBody, type CollisionTarget } from "@react-three/rapier";
import {CollissionGroup} from "./CollisionGroups"
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useGameStore } from "./Store";


export default function Weapon() {

	const spawnProjectile = useGameStore((state) => state.spawnProjectile);

	return(
		<>
			<CylinderCollider 
				name="weapon sensor"
				sensor
				args={[0.1, 3.01]}
				position={[0,0,0]}
				mass={0.0}

				collisionGroups={interactionGroups([CollissionGroup.weaponSensor], [CollissionGroup.enemy])}
				onIntersectionEnter={({ target, other }) => {
					if (other.colliderObject) {console.log("Weapon test: ", target.colliderObject?.name," interacted with ",other.colliderObject?.name);}
					if (other.rigidBodyObject?.position) {
						spawnProjectile({pos: target.rigidBodyObject.position, targetPos: other.rigidBodyObject.position});
						console.log(other)
					}
				}}
			/>
		</>

	)
}

