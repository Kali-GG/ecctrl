import { CylinderCollider, interactionGroups } from "@react-three/rapier";
import {CollissionGroup} from "./CollisionGroups"
import { useStoreProjectiles } from "./Store";
import { useRef, useState } from "react";


export default function Weapon() {

	const spawnProjectile = useStoreProjectiles((state) => state.spawn);
	const [onCooldown, setOnCooldown] = useState(false);

	const targets = []; //todo: onIntersectionEnter -> push into this. OnIntersetcionExit remove. Attack first one in the list
	const swingTimer = 500; // milliseconds
	const maxRange = 3.0;


	return(
		<CylinderCollider 
			name="weapon sensor"
			sensor
			args={[0.1, maxRange]}
			position={[0,0,0]}
			mass={0.0}

			collisionGroups={interactionGroups([CollissionGroup.weaponSensor], [CollissionGroup.enemy])}
			onIntersectionEnter={({ target, other }) => {
				//if (other.colliderObject) {console.log("Weapon test: ", target.colliderObject?.name," interacted with ",other.rigidBodyObject?.name);}
				if (onCooldown) { return; } 
				if (other.rigidBodyObject?.position) {
					setOnCooldown(true);
					spawnProjectile({
						active: true,
						pos: target.rigidBodyObject.position, 
						targetPos: other.rigidBodyObject.position
					});
					setTimeout( () => { setOnCooldown(false); }, swingTimer );
					//console.log(other)
				}
			}}
		/>
	);
}

