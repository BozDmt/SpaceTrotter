import * as THREE from 'three'    
import {MapControls}  from 'three/examples/jsm/Addons.js'

// import {opendir} from 'fs'//unavailable- externalized by vite and cant be used in client code
const radius = 25
const zOffset = 0.000000001
const scene = new THREE.Scene()
const loader = new THREE.CubeTextureLoader()
const canvas = document.getElementById('c')
const renderer = new THREE.WebGLRenderer({antialias: true, canvas})
renderer.setPixelRatio(window.devicePixelRatio)
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

const controls = new MapControls(camera,renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.1
controls.rotateSpeed = 0.25
controls.mouseButtons = {
  LEFT: THREE.MOUSE.LEFT
}



camera.position.z = zOffset
loader.load('https://threejs.org/manual/examples/resources/images/wall.jpg')
const texture = new THREE.TextureLoader().load('./photos/uv.jpeg')
texture.anisotropy = 1
texture.colorSpace = THREE.SRGBColorSpace

const verticesOfCube = [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, ];
const indicesOfFaces = [
2, 1, 0, 0, 3, 2,
0, 4, 7, 7, 3, 0,
0, 1, 5, 5, 4, 0,
1, 2, 6, 6, 5, 1,
2, 3, 7, 7, 6, 2,
4, 5, 6, 6, 7, 4];

const cubeGeo = new THREE.BoxGeometry(1,1,1)
const sphereGeo = new THREE.SphereGeometry(4)
const torusGeo = new THREE.TorusGeometry(.5,0.4,12,48,Math.PI*2)
const octaGeo = new THREE.OctahedronGeometry(1,1)
const polyGeo = new THREE.PolyhedronGeometry(verticesOfCube,indicesOfFaces,1,0)

const colorTex = new THREE.Texture({color:0x00950f})

let yOffsetPos = 0
let yOffsetNeg = 0
let offset = 0
let under = true
let step = 10

const planes = []

let lastCoords = {
  x:0,
  y:0,
  z:0
}
const xSize = 10, ySize = 10
const infoArray = []
for(let i = 1; i < 36; i++){
  if(i % 6 === 0){
    under = !under
    if(under) yOffsetNeg -= 10
    else yOffsetPos += 10
    offset = 0
    step = 0
  }
  const angle =(2*Math.PI / 36) * i
  
  const x = radius*Math.cos(angle)
  const z = zOffset + radius*Math.sin(angle)
  const planeTex = new THREE.TextureLoader().load('photos/photo_2024-11-26_17-19-00.jpg')
  planeTex.colorSpace = THREE.SRGBColorSpace
  const planeGeo = new THREE.PlaneGeometry(xSize,ySize)
  const planeMat = new THREE.MeshBasicMaterial({map:planeTex})
  const plane = new THREE.Mesh(planeGeo,planeMat)
  plane.position.set(x,0,z)
  if(Math.abs(lastCoords.x - plane.position.x) < xSize && lastCoords.y === plane.position.y){
    plane.position.x = lastCoords.x
    plane.position.y += 10
  }
  plane.position.y = (i%3) * 10
  plane.lookAt(camera.position)
  
  scene.add(plane)

  lastCoords.x = x
  lastCoords.y = plane.position.y
  lastCoords.z = z
  // infoArray.push([x,plane.position.y,z])
  // console.log(lastCoords.x,' ',lastCoords.y,' ',lastCoords.z)
}



scene.background = new THREE.MeshBasicMaterial({color:0x00950f})

// const yAxis = new THREE.Vector3(0,0,1+zOffset)
// planes[0].position.set(0,0,-5.04-zOffset)
// planes[0].lookAt(camera.position)
// planes[1].position.set(0,0,5.04+zOffset)
// planes[1].lookAt(camera.position)
// planes[2].position.set(0,5.04,0+zOffset)
// planes[2].lookAt(camera.position)
// planes[3].position.set(0,-5.04,0+zOffset)
// planes[3].lookAt(camera.position)
// planes[4].position.set(5.04,0,0+zOffset)
// planes[4].lookAt(camera.position)
// planes[5].position.set(-5.04,0,0+zOffset)
// planes[5].lookAt(camera.position)
// planes[5].rotateOnAxis(yAxis,1.571)
// scene.add(planes[0])
// scene.add(planes[1])
// scene.add(planes[2])
// scene.add(planes[3])
// scene.add(planes[4])
// scene.add(planes[5])
// camera.position.z = 0.0000000000000000000000000000000000001

const sphereMat = new THREE.MeshStandardMaterial({map:texture})
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
// const octaMesh = new THREE.Mesh

// wireMesh.scale.setScalar(1.001)
// cube.add(wireMesh)
// sphere.add(octaMesh)
// wireMesh.add(torusMesh)
const lighting = new THREE.HemisphereLight(0x04ff1d,0xffffff,1)

// lighting.intensity = 10.2
// scene.add(lighting)

function resizeCanvas(renderer){
  
  const canvas = renderer.domElement
  const height = canvas.clientHeight
  const width = canvas.clientWidth
  
  const needResize = canvas.width !== width ||  canvas.height !== height
  if(needResize){
    renderer.setSize(width,height,false)
  }
  return needResize
}

function animate(){
    if(resizeCanvas(renderer)){
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth/canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(animate) //WARNING: When setAnimationLoop is used, this call should be omitted
}
    // renderer.setAnimationLoop(animate)
    requestAnimationFrame(animate)
    