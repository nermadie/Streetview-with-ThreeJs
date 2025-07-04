import * as THREE from "three";

import Stats from "three/addons/stats.module.js";

import { GUI } from "three/addons/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/OrbitControls.js";

import { HDRJPGLoader } from "@monogrid/gainmap-js";

const params = {
  background: "BKDN_E1",
  roughness: 1.0,
  metalness: 0.0,
  exposure: 1.0,
  previousBackground: "BKDN_E1",
  streetView: false,
};

const gui = new GUI();

let container, stats;
let camera, scene, renderer, controls;
let geometryMesh, planeMesh;

let hdrJpg;
let hdrJpgPMREMRenderTarget = {};
let hdrJpgEquirectangularMap = {};

// Arrow helper
let arrows = [];
const origin = new THREE.Vector3(0, 0, 0);
const length = 80;
const hex = 0xffffff;
const headLength = 30;
const headWidth = 10;
const streetView = [
  {
    name: "BKDN_E1",
    url: "background/E1.hdr.jpg",
    arrows: [
      {
        direction: [-68, 0, 90],
        target: "BKDN_E2",
      },
      {
        direction: [-90, 0, -68],
        target: "BKDN_E3",
      },
      {
        direction: [90, 0, 68],
        target: "BKDN_E4",
      },
      {
        direction: [68, 0, -90],
        target: "BKDN_E5",
      },
    ],
  },
  {
    name: "BKDN_E2",
    url: "background/E2.hdr.jpg",
    arrows: [
      {
        direction: [62, 0, -100],
        target: "BKDN_E1",
      },
    ],
  },
  {
    name: "BKDN_E3",
    url: "background/E3.hdr.jpg",
    arrows: [
      {
        direction: [-26, 0, -20],
        target: "BKDN_E6",
      },
      {
        direction: [26, 0, 20],
        target: "BKDN_E1",
      },
    ],
  },
  {
    name: "BKDN_E4",
    url: "background/E4.hdr.jpg",
    arrows: [
      {
        direction: [-1, 0, -1],
        target: "BKDN_E1",
      },
    ],
  },
  {
    name: "BKDN_E5",
    url: "background/E5.hdr.jpg",
    arrows: [
      {
        direction: [-1, 0, 1],
        target: "BKDN_E1",
      },
    ],
  },
  {
    name: "BKDN_E6",
    url: "background/E6.hdr.jpg",
    arrows: [
      {
        direction: [1, 0, 1],
        target: "BKDN_E3",
      },
    ],
  },
  {
    name: "Default",
    url: "background/spruit_sunrise_4k.hdr.jpg",
    arrows: [],
  },
  {
    name: "BKDN_F1",
    url: "background/F1.hdr.jpg",
    arrows: [
      {
        direction: [-3, 0, -5],
        target: "BKDN_F2",
      },
    ],
  },
  {
    name: "BKDN_F2",
    url: "background/F2.hdr.jpg",
    arrows: [
      {
        direction: [3, 0, 5],
        target: "BKDN_F1",
      },
      {
        direction: [-3, 0, -5],
        target: "BKDN_F3",
      },
    ],
  },
  {
    name: "BKDN_F3",
    url: "background/F3.hdr.jpg",
    arrows: [
      {
        direction: [3, 0, 5],
        target: "BKDN_F2",
      },
      {
        direction: [-2, 0, -10],
        target: "BKDN_F4",
      },
    ],
  },
  {
    name: "BKDN_F4",
    url: "background/F4.hdr.jpg",
    arrows: [
      {
        direction: [20, 0, 1],
        target: "BKDN_F3",
      },
    ],
  },
];

const fileSizes = {};
const resolutions = {};

init();
animate();

function init() {
  const lbl = document.getElementById("lbl_left");

  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  camera.position.set(0, 0, 120);

  scene = new THREE.Scene();

  //RENDERER
  renderer = new THREE.WebGLRenderer();
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  //SphereGeometry (radius : Float, widthSegments : Integer, heightSegments : Integer)
  let geometry = new THREE.SphereGeometry(15, 32, 16);
  let material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: params.metalness,
    roughness: params.roughness,
  });

  geometryMesh = new THREE.Mesh(geometry, material);
  scene.add(geometryMesh);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  THREE.DefaultLoadingManager.onLoad = function () {
    pmremGenerator.dispose();
  };

  for (let i = 0; i < streetView.length; i++) {
    const street = streetView[i];
    const hdrJpg = new HDRJPGLoader(renderer).load(
      street.url,
      function () {
        resolutions[street.name] = hdrJpg.width + "x" + hdrJpg.height;

        if (i === 0) {
          lbl.innerHTML =
            street.name +
            " size : " +
            fileSizes[street.name] +
            ", Resolution: " +
            resolutions[street.name];
        }

        hdrJpgEquirectangularMap[street.name] = hdrJpg.renderTarget.texture;
        hdrJpgPMREMRenderTarget = pmremGenerator.fromEquirectangular(
          hdrJpgEquirectangularMap[street.name]
        );

        hdrJpgEquirectangularMap[street.name].mapping =
          THREE.EquirectangularReflectionMapping;
        hdrJpgEquirectangularMap[street.name].needsUpdate = true;

        hdrJpg.dispose();
      },
      function (progress) {
        fileSizes[street.name] = humanFileSize(progress.total);
      }
    );
  }

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  stats = new Stats();
  container.appendChild(stats.dom);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 50;
  controls.maxDistance = 300;

  window.addEventListener("resize", onWindowResize);

  // Create the arrow helper

  for (let i = 0; i < streetView.length; i++) {
    if (streetView[i].name !== params.background) {
      continue;
    }
    const street = streetView[i];
    for (let j = 0; j < street.arrows.length; j++) {
      const arrow = street.arrows[j];
      const arrowHelper = new THREE.ArrowHelper(
        new THREE.Vector3(
          arrow.direction[0],
          arrow.direction[1],
          arrow.direction[2]
        ),
        origin,
        length,
        hex,
        headLength,
        headWidth
      );

      // Create a Raycaster object for this arrow
      const arrowRaycaster = new THREE.Raycaster();
      arrowHelper.userData.raycaster = arrowRaycaster;
      arrowHelper.userData.target = arrow.target;

      arrowHelper.visible = params.streetView;

      scene.add(arrowHelper);
      arrows.push(arrowHelper);
    }
  }

  gui.add(params, "background", [
    "BKDN_E1",
    "BKDN_E2",
    "BKDN_E3",
    "BKDN_E4",
    "BKDN_E5",
    "BKDN_F1",
    "BKDN_F2",
    "BKDN_F3",
    "BKDN_F4",
    "Default",
  ]);
  gui.add(params, "roughness", 0, 1, 0.01);
  gui.add(params, "metalness", 0, 1, 0.01);
  gui.add(params, "exposure", 0, 2, 0.01);
  gui.add(params, "streetView").onChange(function (value) {
    arrows.forEach((arrow) => {
      arrow.visible = value;
    });
  });
  gui.open();
  renderer.domElement.addEventListener("mousemove", eventHandler); // For hover effect
  renderer.domElement.addEventListener("click", eventHandler); // For click events
}

function humanFileSize(bytes, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

function animate(event) {
  requestAnimationFrame(animate);
  TWEEN.update(event);
  stats.begin();
  render();
  stats.end();
}

const loadedTextures = {};

function transitionTo(targetName) {
  new TWEEN.Tween({ opacity: 0 })
    .to({ opacity: 1 }, 1000) // Thời gian chuyển cảnh 1 giây
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();
}

function eventHandler(event) {
  if (params.streetView) {
    // Update hover state based on mouse position
    const mouse = new THREE.Vector2();

    // Convert mouse coordinates to normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    for (let i = 0; i < arrows.length; i++) {
      const arrow = arrows[i];
      const arrowRaycaster = arrow.userData.raycaster;
      arrowRaycaster.setFromCamera(mouse, camera);
      const intersects = arrowRaycaster.intersectObject(arrow);
      if (event.type === "mousemove") {
        if (intersects.length > 0) {
          arrow.setColor(0xb0e0e6);
        } else {
          arrow.setColor(0xffffff);
        }
      } else if (event.type === "click") {
        if (intersects.length > 0) {
          const target = arrow.userData.target;
          transitionTo(target);
          params.background = target;
        }
      }
    }
  }
}

function render() {
  geometryMesh.material.roughness = params.roughness;
  geometryMesh.material.metalness = params.metalness;

  let pmremRenderTarget, equirectangularMap;

  if (params.previousBackground != params.background) {
    // Giải phóng bộ nhớ của texture và PMREMRenderTarget cũ
    if (hdrJpgPMREMRenderTarget[params.previousBackground]) {
      hdrJpgPMREMRenderTarget[params.previousBackground].dispose();
    }
    if (hdrJpgEquirectangularMap[params.previousBackground]) {
      hdrJpgEquirectangularMap[params.previousBackground].dispose();
    }
    params.previousBackground = params.background;
    const lbl = document.getElementById("lbl_left");

    lbl.innerHTML =
      params.background +
      " size : " +
      fileSizes[params.background] +
      ", Resolution: " +
      resolutions[params.background];

    for (let i in arrows) {
      scene.remove(arrows[i]);
    }
    arrows = [];
    // Create the arrow helper
    for (let i = 0; i < streetView.length; i++) {
      if (streetView[i].name !== params.background) {
        continue;
      }
      const street = streetView[i];
      for (let j = 0; j < street.arrows.length; j++) {
        const arrow = street.arrows[j];
        const arrowHelper = new THREE.ArrowHelper(
          new THREE.Vector3(
            arrow.direction[0],
            arrow.direction[1],
            arrow.direction[2]
          ),
          origin,
          length,
          hex,
          headLength,
          headWidth
        );

        // Create a Raycaster object for this arrow
        const arrowRaycaster = new THREE.Raycaster();
        arrowHelper.userData.raycaster = arrowRaycaster;
        arrowHelper.userData.target = arrow.target;

        arrowHelper.visible = params.streetView;

        scene.add(arrowHelper);
        arrows.push(arrowHelper);
      }
    }
  }

  pmremRenderTarget = hdrJpgPMREMRenderTarget[params.background];
  equirectangularMap = hdrJpgEquirectangularMap[params.background];

  const newEnvMap = pmremRenderTarget ? pmremRenderTarget.texture : null;

  if (newEnvMap && newEnvMap !== geometryMesh.material.envMap) {
    planeMesh.material.map = newEnvMap;
    planeMesh.material.needsUpdate = true;
  }

  scene.environment = equirectangularMap;
  scene.background = equirectangularMap;
  renderer.toneMappingExposure = params.exposure;

  renderer.render(scene, camera);
}
