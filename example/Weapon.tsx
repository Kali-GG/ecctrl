import { BallCollider, CylinderCollider, interactionGroups, type CollisionTarget } from "@react-three/rapier";
import {CollissionGroup} from "./CollisionGroups"
import { useStoreProjectiles } from "./Store";
import { useEffect, useRef, useState } from "react";


export default function Weapon() {

	const spawnProjectile = useStoreProjectiles((state) => state.spawn);
	const [onCooldown, setOnCooldown] = useState(false);

	const targetRef = useRef([]);
	const self = useRef<CollisionTarget>(null);

	useEffect(() => { targetRef.current = []; }, []);

	const swingTimer = 500; // milliseconds
	const maxRange = 3.0;

	const attack = () => {
		if (targetRef.current.length == 0 || self.current == null || onCooldown) { return; }
		setOnCooldown(true);
		spawnProjectile({
			active: true,
			pos: self.current.rigidBodyObject.position, 
			targetPos: targetRef.current[0].rigidBodyObject.position
		});
		setTimeout( () => { setOnCooldown(false); attack(); }, swingTimer );
	}

	const removeTarget = (other: CollisionTarget) => {
		targetRef.current.splice(targetRef.current.findIndex(obj => obj.rigidBodyObject.uuid == other.rigidBodyObject.uuid), 1);
	}

	return(
		<CylinderCollider 
			name="weapon sensor"
			sensor
			args={[0.1, maxRange]}
			position={[0,0,0]}
			mass={0.0}

			collisionGroups={interactionGroups([CollissionGroup.weaponSensor], [CollissionGroup.enemy])}
			onIntersectionEnter={({ target, other }) => {
				if (!other.rigidBodyObject?.position) { return; }
				targetRef.current.push(other); 
				if (self.current == null) { self.current = target; }
				if (onCooldown == false) { attack(); }
			}}
			onIntersectionExit={({ target, other }) => { removeTarget(other); }}
		/>
	);
}

