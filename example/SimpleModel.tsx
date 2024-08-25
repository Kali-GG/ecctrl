import React, { useRef, useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from "three";
import {
	CuboidCollider,
	MeshCollider,
	RigidBody,
	useRapier,
  interactionGroups
  } from "@react-three/rapier";

export default function SimpleModel(props) {

  //mesh
  const groupRef = useRef<THREE.Group>()

  const { nodes } = useGLTF('/Enemy Character.glb')
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
  });

  //physics
  const rigidbodyRef = useRef<any>();

  useEffect(() => {
    rigidbodyRef.current.lockRotations(true);
    rigidbodyRef.current.setEnabledRotations(false, true, false);
  }, []);


  return (
    <RigidBody
      name="Target Practice Dummy"
      mass={10}
      ref={rigidbodyRef}
      colliders="hull"
      collisionGroups={interactionGroups([1], [0, 1, 2, 3])}
  	>

			<group ref={groupRef} {...props} dispose={null}>
        <mesh castShadow receiveShadow geometry={nodes.PrototypePete.geometry} material={meshToonMaterial} />
        <mesh  geometry={nodes.outline.geometry} material={outlineMaterial} />
			</group>
	</RigidBody>
  )
}

useGLTF.preload('/Enemy Character.glb')