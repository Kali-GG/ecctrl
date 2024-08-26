import { CylinderCollider, interactionGroups } from "@react-three/rapier";
import {CollissionGroup} from "./CollisionGroups"
import { useStoreProjectiles } from "./Store";


export default function Weapon() {

	const spawnProjectile = useStoreProjectiles((state) => state.spawn);

	return(
		<CylinderCollider 
			name="weapon sensor"
			sensor
			args={[0.1, 3.01]}
			position={[0,0,0]}
			mass={0.0}

			collisionGroups={interactionGroups([CollissionGroup.weaponSensor], [CollissionGroup.enemy])}
			onIntersectionEnter={({ target, other }) => {
				//if (other.colliderObject) {console.log("Weapon test: ", target.colliderObject?.name," interacted with ",other.rigidBodyObject?.name);}
				if (other.rigidBodyObject?.position) {
					spawnProjectile({
						active: true,
						pos: target.rigidBodyObject.position, 
						targetPos: other.rigidBodyObject.position
					});
					//console.log(other)
				}
			}}
		/>
	);
}

