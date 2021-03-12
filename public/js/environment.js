const COLOR_FLOOR = 0x101010;
const listener = new THREE.AudioListener();
let rectLights
let ground

function createEnvironment(scene) {
  console.log("Adding environment");

  THREE.RectAreaLightUniformsLib.init();

  // for (let i = 0; i < 20; i++) {
  //   scene.add(getNewMesh());
  // }

  scene.add(createGround())
  scene.add(createSkydome())

  rectLights = createLights()
  rectLights.forEach(light => scene.add(light))

  // change a light to green.
  // const light = rectLights[0]
  // light.color = new THREE.Color(0x00ff00)
  // light.children[0].material.color = new THREE.Color(0x00ff00)
}

function getNewMesh() {
  const geometry = new THREE.TorusKnotGeometry(10, 2, 100, 16);
  const material = new THREE.MeshLambertMaterial({ color: 0x444444 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(getRandom(50), Math.random() * 10, getRandom(50));
  return mesh;
}

function getRandom(scale = 1) {
  return scale * (Math.random() - 0.5) * 2
}

function updateEnvironment(scene) {
  // rectLights[0].position.y = Math.sin(Date.now() * 0.001 + index) * 1 + 4
}

function createRectangularLight(color, intensity, width, height, position, lookAt) {
  rectLight = new THREE.RectAreaLight(color, intensity, width, height);
  rectLight.position.set(...position);
  rectLight.lookAt(...lookAt);
  // scene.add( rectLight );

  var rectLightMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ side: THREE.BackSide }));
  rectLightMesh.scale.x = rectLight.width;
  rectLightMesh.scale.y = rectLight.height;
  rectLight.add(rectLightMesh);

  var rectLightMeshBack = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ color: 0x080808 }));
  rectLightMesh.add(rectLightMeshBack);
  return rectLight
}

function createLights() {
  const CIRCLE_PERCENTAGE = 0.7
  const offsetAngle = Math.PI * -1
  const number = 15
  const deltaAngle = 2 * Math.PI * CIRCLE_PERCENTAGE / number
  const radius = 30

  const lights = []

  for (let i = 0; i < number; i++) {

    const a = i * deltaAngle + offsetAngle
    const h = 5
    const w = 1
    const x = radius * Math.cos(a)
    const z = radius * Math.sin(a)
    const y = h * 0.5 + 0.5

    lights[i] = createRectangularLight(0xffffff, 10, w, h, [x, y, z], [0, y, 0])


    // sound

    const sound = new THREE.PositionalAudio(listener)
    const oscillator = listener.context.createOscillator();
    const gain = listener.context.createGain();
    gain.gain.value = 0
    gain.gain.linearRampToValueAtTime(1, sound.context.currentTime + 20);
    
    oscillator.type = 'sine';
    oscillator.frequency.linearRampToValueAtTime(50 + 1000 * Math.random(), sound.context.currentTime + 1);
    oscillator.start(0);
    oscillator.connect(gain);

    sound.setNodeSource(gain);
    sound.setRefDistance(20);
    sound.setVolume(0.01);
    lights[i].add(sound);
  }






  return lights

}

function createGround() {
  const WRAP_REPEAT = 15
  const loader = new THREE.TextureLoader();
  const rMap = loader.load('../assets/lavatile.jpg');
  rMap.wrapS = THREE.RepeatWrapping;
  rMap.wrapT = THREE.RepeatWrapping;
  rMap.repeat.set(WRAP_REPEAT * 2, WRAP_REPEAT);

  const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000);
  const matStdFloor = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 1,
    roughnessMap: rMap,
    metalness: 0.5
  });
  return new THREE.Mesh(geoFloor, matStdFloor);

}

function createSkydome() {
  const skyGeo = new THREE.SphereGeometry(200, 25, 25)
  const loader = new THREE.TextureLoader()
  const texture = loader.load("../assets/lavatile.jpg")

  const mat = new THREE.MeshStandardMaterial({
    roughness: 0.1,
    metalness: 1,
    map: texture
  })
  const sky = new THREE.Mesh(skyGeo, mat)
  sky.material.side = THREE.BackSide
  return sky

}