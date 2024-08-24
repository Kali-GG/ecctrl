import {
	CuboidCollider,
	RigidBody,
	useRapier,
	interactionGroups
  } from "@react-three/rapier";
  import { useEffect, useRef, useMemo } from "react";
  import * as THREE from "three";
  import { useFrame } from "@react-three/fiber";
  import { Text } from "@react-three/drei";
  import type { RayColliderHit } from "@dimforge/rapier3d-compat";
  
  export default function EnemyModelBasic() {
	// Preset
	// couldn't find the correct type
	const floatingMovingPlateRef = useRef<any>();
	const { rapier, world } = useRapier();
  
	/**
	 * Ray setup
	 */
	const rayLength = 0.8;
	const rayDir = { x: 0, y: -1, z: 0 };
	const floatingDis = 0.8;
	const springK = 2.5;
	const dampingC = 0.15;

	// Moving Platform
	const springDirVecMove = useMemo(() => new THREE.Vector3(), []);
	const originMove = useMemo(() => new THREE.Vector3(), []);
	const movingVel = useMemo(() => new THREE.Vector3(), []);
	let movingDir = 1;
	let rayHitMove: RayColliderHit | null = null;
  
	useEffect(() => {  
	  // Loack moving platform rotation
	  floatingMovingPlateRef.current.setEnabledRotations(false, true, false);
	  floatingMovingPlateRef.current.setEnabledTranslations(true, false, true);
	}, []);
  
	useFrame(() => {
	  /**
	   * Ray casting detect if on ground
	   */

	  // Ray cast for moving platform
	  if (floatingMovingPlateRef.current) {
		originMove.set(
		  floatingMovingPlateRef.current.translation().x,
		  floatingMovingPlateRef.current.translation().y,
		  floatingMovingPlateRef.current.translation().z
		);

		// Apply moving velocity to the platform
		if (floatingMovingPlateRef.current.translation().x > 10) {
		  movingDir = -1;
		} else if (floatingMovingPlateRef.current.translation().x < -5) {
		  movingDir = 1;
		}
  
		if (movingDir > 0) {
		  floatingMovingPlateRef.current.setLinvel(
			movingVel.set(2, floatingMovingPlateRef.current.linvel().y, 0)
		  );
		} else {
		  floatingMovingPlateRef.current.setLinvel(
			movingVel.set(-2, floatingMovingPlateRef.current.linvel().y, 0)
		  );
		}
	  }
  

	});
  
	return (
	  <>
  
		{/* Floating moving Platform test */}
		<RigidBody
		  position={[0, 0.25, -27]}
		  mass={1}
		  colliders={false}
		  ref={floatingMovingPlateRef}
		>
		  <Text
			scale={0.5}
			color="black"
			maxWidth={10}
			textAlign="center"
			position={[0, 2.5, 0]}
		  >
			Flos basic EnemyModel (rigidbody)
		  </Text>
		  <CuboidCollider 
		  	args={[1.25, 1.0, 0.5]} 
			collisionGroups={interactionGroups(3, [0])}
			/>
		  <mesh receiveShadow castShadow>
			<boxGeometry args={[2.5, 2.0, 1.0]} />
			<meshStandardMaterial color={"lightsteelblue"} />
		  </mesh>
		</RigidBody>
	  </>
	);
  }
  