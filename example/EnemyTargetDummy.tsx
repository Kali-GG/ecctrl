
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from "three";
import { Suspense, useEffect, useRef, useMemo, useState } from "react";
import { useControls } from "leva";

export default function EnemyTargetDummy(props) {
  const { nodes, animations } = useGLTF("/Enemy Character.glb");

  // gradientMapTexture for MeshToonMaterial
  const gradientMapTexture = useTexture("./textures/3.jpg");
  gradientMapTexture.minFilter = THREE.NearestFilter;
  gradientMapTexture.magFilter = THREE.NearestFilter;
  gradientMapTexture.generateMipmaps = false;



  /**
   * Prepare replacing materials
   */
  const outlineMaterial = new THREE.MeshBasicMaterial({
        color: "black",
        transparent: true,
      });

  const meshToonMaterial = new THREE.MeshToonMaterial({
        color: "red",
        gradientMap: gradientMapTexture,
        transparent: true,
      })

  return (
	<Suspense>
		<group name="Scene" scale={0.8}>
			<group name="TargetDummy">
				<skinnedMesh
					name="outlineEnemey"
					geometry={nodes.outline.geometry}
					material={outlineMaterial}
					skeleton={nodes.outline.skeleton}
				/>
				<skinnedMesh
					name="PrototypePeteEnemy"
					geometry={nodes.PrototypePete.geometry}
					material={meshToonMaterial}
					skeleton={nodes.PrototypePete.skeleton}
					receiveShadow
					castShadow
				/>
			</group>
		</group>
	</Suspense>

  )
}

useGLTF.preload("/Enemy Character.glb")