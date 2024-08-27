import * as THREE from "three";

interface PlayerInfo {
    position: THREE.Vector3,
    setPosition: (position: THREE.Vector3) => void
}

const playerInfo: PlayerInfo = {
    position: new THREE.Vector3(0,0,0),
    setPosition: (position) => { playerInfo.position = position;}
}

export { playerInfo }