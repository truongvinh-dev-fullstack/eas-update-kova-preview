import {
  AmbientLight,
  DirectionalLight,
  AnimationMixer,
  Clock,
  PerspectiveCamera,
  Scene,
  Group,
  DoubleSide,
  LoadingManager,
  MeshStandardMaterial,
  Color,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  WebGLRenderTarget
} from "three";

import {
  Renderer,
  TextureLoader
} from "expo-three";

import {
  FBXLoader
} from "./FBXLoader.js";
import {
  GLTFLoader
} from "./GLTFLoader.js";

/**
 * 
 */
class VTOModule {

  /**
   * 
   */
  constructor() {
    this.body_params = new Object();
    this.cloth_params = new Object();
    this.render_target = new Object();

    this.createRTTObject();
    this.scene = new Scene();
    this.scene.rotation.order = "YXZ"

    let ambLight = new AmbientLight(0xffffff, 1.5);
    this.scene.add(ambLight);

    let directionalLight1 = new DirectionalLight(0xffeeff, 0.5);
    directionalLight1.position.set(0.0, 1.0, 1.0);
    this.scene.add(directionalLight1);

    let directionalLight2 = new DirectionalLight(0xffeeff, 0.5);
    directionalLight2.position.set(0.0, 1.0, -1.0);
    this.scene.add(directionalLight2);

    this.clock = new Clock();

    this.group_body = new Group();
    this.group_cloth = new Group();

    this.scene.add(this.group_cloth);
    this.scene.add(this.group_body);

    this.blobURLs = [];
    this.manager = new LoadingManager();
    this.manager.setURLModifier(url => {
      this.blobURLs.push(url);
      return url;
    });

    this.mixer = new AnimationMixer();
  }

  /**
   * 
   */
  createRTTObject() {
    let geometry = new PlaneGeometry(2, 2);

    let material = new ShaderMaterial({
      uniforms: {
        tex: {
          value: undefined
        },
        base_skin: {
          value: new Color(0.0, 0.0, 0.0)
        },
        skin_color: {
          value: new Color(0.0, 0.0, 0.0)
        }
      },
      vertexShader: [
        "varying vec2 vUv;",
        "void main() {",
        "vUv = uv;",
        "gl_Position = vec4(position, 1.0);",
        "}",
      ].join("\n"),

      fragmentShader: [
        "varying vec2 vUv;",
        "uniform sampler2D tex;",
        "uniform vec3 base_skin;",
        "uniform vec3 skin_color;",
        "void main() {",
        "vec4 base_color = texture2D(tex, vUv);",
        "vec3 diff0 = skin_color / base_skin;",
        "vec3 diff1 = (1.0 - skin_color) / (1.0 - base_skin);",
        "vec3 diff2 = (skin_color - base_skin) / (1.0 - base_skin);",
        "bvec3 flag = greaterThan(base_color.rgb, base_skin);",
        "vec3 dest0 = base_color.rgb * diff0;",
        "vec3 dest1 = base_color.rgb * diff1 + diff2;",
        "base_color.rgb = mix(dest0, dest1, flag);",
        "gl_FragColor = vec4(base_color.rgb, 1.0);",
        "}",
      ].join("\n")
    });

    this.render_target.plane = new Mesh(geometry, material);
    this.render_target.material = material;
    this.render_target.render = new WebGLRenderTarget(1024, 1024);
  }

  /**
   * 
   * @returns 
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new VTOModule();
    }
    return this.instance;
  }

  /**
   * 
   * @param {Object} domains 
   */
  setVTODomains(domains) {
    this.domains = {
      pred_domain: domains["3dr_domain"],
      face_domain: domains["3dr_domain"],
      body_domain: domains["vto_domain"],
      hair_domain: domains["vto_domain"],
      skin_domain: domains["vto_domain"],
      size_domain: domains["vto_domain"],
      user_domain: domains["avt_domain"],
      prod_domain: domains["vto_domain"]
    }
  }

  /**
   * 
   */
  initAttributes() {
    delete this.base_action;
    delete this.front_scan;
    delete this.side_scan;
    delete this.face_scan;
    delete this.skeleton;
    delete this.image_hex;

    this.body_params = new Object();
    this.cloth_params = new Object();

    while (this.group_body && this.mixer && this.group_body.children.length) {
      this.mixer.uncacheRoot(this.group_body.children[0]);
      this.disposeNode(this.group_body.children[0]);
      this.group_body.remove(this.group_body.children[0]);
    }

    while (this.group_cloth && this.mixer && this.group_cloth.children.length) {
      this.mixer.uncacheRoot(this.group_cloth.children[0]);
      this.disposeNode(this.group_cloth.children[0]);
      this.group_cloth.remove(this.group_cloth.children[0]);
    }

    if (this.renderer !== undefined) {
      this.renderer.setAnimationLoop(null);
      this.renderer.renderLists.dispose();
    }

    this.blobURLs.forEach(url => {
      URL.revokeObjectURL(url);
    });
    this.blobURLs = [];
  }

  /**
   * 
   * @param {String} url 
   * @param {String} method 
   * @param {Object} params 
   * @param {Boolean} parsed 
   * @returns 
   */
  async callAPIRequest(url, method, params) {
    let xhr = new XMLHttpRequest();

    let res = await new Promise((resolve, reject) => {
      xhr.onreadystatechange = (e) => {
        try {
          if (xhr.readyState !== 4) {
            return;
          }
          if (xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            resolve(res);
          } else {
            reject(xhr.status);
          }
        } catch (err) {
          reject(err);
        }
      }

      if (method === "POST") {
        let data = new FormData();

        Object.keys(params).forEach(key => {
          data.append(key, params[key]);
        })

        xhr.open(method, url);
        xhr.send(data);
      } else {
        xhr.open(method, url);
        xhr.send();
      }
    });

    return res;
  }

  /**
   * 
   * @param {String} url 
   * @param {String} method 
   * @param {Object} params 
   * @param {Boolean} parsed 
   * @returns 
   */
  async callIntervalAPIRequest(url, method, params) {
    let res = await new Promise(resolve => {
      let handler = setInterval(async () => {
        try {
          let res = await this.callAPIRequest(url, method, params);

          if (res.state !== "pending") {
            resolve(res);
            clearInterval(handler);
          }
        } catch (err) {
          reject(err);
          clearInterval(handler);
        }
      }, 1000);
    });

    return res;
  }

  /**
   * 
   * @param {Object} obj 
   * @param {Function} fn 
   * @returns 
   */
  traverseNode(obj, fn) {
    if (!obj) return;
    fn(obj);
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach(o => {
        this.traverseNode(o, fn);
      });
    }
  }

  /**
   * 
   * @param {Object} obj 
   */
  disposeNode(obj) {
    let disposeFunc = (name, key, attr) => {
      if (attr.isGeometry || attr.isBufferGeometry) {
        for (let key in attr.attributes) {
          attr.removeAttribute(key);
        }
        attr.setIndex([]);
        attr.dispose();
      }

      if (attr.isMaterial) {
        console.log(name, key);
        Object.keys(attr).forEach(k => {
          let v = attr[k];
          if (v && v.isTexture) {
            v.dispose();
          }
        });
        attr.dispose();
      }
    }

    this.traverseNode(obj, o => {
      if (!o) {
        return;
      }

      Object.keys(o).forEach(key => {
        let attr = o[key];

        if (!attr) {
          return;
        }

        if (attr.length) {
          for (let i = 0; i < attr.length; ++i) {
            disposeFunc(o.name, key, attr[i]);
          }
        } else {
          disposeFunc(o.name, key, attr);
        }
      });
    });
  }

  /**
   * 
   * @param {*} url 
   * @param {*} loader 
   * @returns 
   */
  loadAsync(url, loader) {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, undefined, reject);
    });
  }

  /**
   * 
   * @param {Object} params 
   * @returns 
   */
  async initGuestSession(params) {
    this.initAttributes();
    this.body_params.gender = params.gender;
    this.body_params.weight = params.weight;

    let response = {
      status: true,
      message: 'initGuestSession'
    }
    return response;
  }

  /**
   * 
   * @returns 
   */
  async closeGuestSession() {
    this.initAttributes();
    let response = {
      status: true,
      message: 'closeGuestSession'
    }
    return response;
  }

  /**
   * 
   * @param {WebGL2RenderingContext} gl 
   * @returns 
   */
  async initWebRenderer(gl) {
    if (this.renderer !== undefined) {
      this.renderer.setAnimationLoop(null);
      this.renderer.renderLists.dispose();
    }

    let width = gl.drawingBufferWidth;
    let height = gl.drawingBufferHeight;

    this.renderer = new Renderer({
      gl: gl,
      antialias: true,
      alpha: true
    });

    this.rotateAngle = 0;
    this.clockwise = 0;

    this.camera = new PerspectiveCamera(45, width / height, 0.1, 20);
    this.camera.position.set(0.0, 1.0, 3.0);
    this.camera.lookAt(0.0, 1.0, 0.0);

    this.renderer.setPixelRatio(1.0);
    this.renderer.setSize(width, height);

    this.renderer.setAnimationLoop(() => {
      this.updateScene();
      gl.endFrameEXP();
    });
  }

  /**
   * 
   */
  updateScene() {
    let delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);

    let currAngle = this.scene.rotation.y;
    let destAngle = this.rotateAngle;

    if (this.clockwise == 1 && currAngle <= destAngle) {
      destAngle -= 2.0 * Math.PI;
    } else if (this.clockwise == -1 && currAngle >= destAngle) {
      destAngle += 2.0 * Math.PI;
    }

    let angle = (destAngle - currAngle) / 24;
    if (Math.abs(angle) < 0.001) {
      this.scene.rotation.y = this.rotateAngle;
      this.clockwise = 0;
    } else {
      this.scene.rotateY(angle);
    }

    this.renderer.setRenderTarget(this.render_target.render);
    this.renderer.render(this.render_target.plane, this.camera);

    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 
   * @param {*} angle 
   */
  setSceneOrientationClockWise(angle) {
    if (angle > 0.0) {
      this.rotateAngle = (angle + Math.PI) % (2.0 * Math.PI) - Math.PI;
    } else if (angle < 0.0) {
      this.rotateAngle = (angle - Math.PI) % (2.0 * Math.PI) + Math.PI;
    } else {
      this.rotateAngle = angle;
    }
    this.clockwise = 1;
  }

  /**
   * 
   * @param {*} angle 
   */
  setSceneOrientationCounterClockWise(angle) {
    if (angle > 0.0) {
      this.rotateAngle = (angle + Math.PI) % (2.0 * Math.PI) - Math.PI;
    } else if (angle < 0.0) {
      this.rotateAngle = (angle - Math.PI) % (2.0 * Math.PI) + Math.PI;
    } else {
      this.rotateAngle = angle;
    }
    this.clockwise = -1;
  }

  /**
   * 
   * @param {*} ratio 
   */
  setSceneScale(ratio) {
    if (ratio > 1.8) ratio = 1.8;
    if (ratio < 1.5) ratio = 1.5;
    this.scene.scale.set(ratio / 1.7, ratio / 1.7, ratio / 1.7);
  }

  /**
   * 
   * @returns 
   */
  async genModelFromImage() {
    await Promise.all([
      this.genFaceTexture(),
      this.getMeasuresFromImage()
    ]);

    let body_params = await this.genModelFromMeasures();

    if (body_params) {
      let fbx_loader = new FBXLoader();
      let base_url = body_params.base_url;
      let model_path = body_params.model_path;

      let obj = await this.loadAsync(`${base_url}/${model_path}`, fbx_loader);
      if (obj) {
        this.addBodyModelToScene(obj);
      }
    }

    let response = {
      status: true,
      message: 'genModelFromImage'
    }
    return response;
  }

  /**
   * 
   */
  async getMeasuresFromImage() {
    let gender = this.body_params.gender;
    let weight = this.body_params.weight;

    if (gender && this.front_scan && this.side_scan) {
      let req = {
        gender: gender,
        front: this.front_scan,
        side: this.side_scan,
        weight: weight
      }

      let domain = this.domains.pred_domain;
      let token_res = await this.callAPIRequest(`${domain}/predict_body/from_image`, "POST", req);


      if (token_res && token_res.process_token) {
        let req = {
          token: token_res.process_token
        }
        let param_res = await this.callIntervalAPIRequest(`${domain}/mobile/predict_body/from_image/result`, "POST", req);

        if (param_res.body_measure) {
          this.body_params.body_measure = param_res.body_measure;
        }
      }
    }
  }

  /**
   * 
   * @returns 
   */
  async genModelFromMeasures() {
    let body_measure = this.body_params.body_measure;
    let gender = this.body_params.gender;

    if (body_measure && gender) {
      let req = {
        gender: gender,
      }
      Object.assign(req, body_measure);

      let domain = this.domains.body_domain;
      let body_params = await this.callAPIRequest(`${domain}/predict_body/from_params`, "POST", req);

      if (body_params && body_params.model_id) {
        this.body_params.model_id = body_params.model_id;

        if (body_params.base_url && body_params.model_path) {
          return body_params;
        }
      }
    }
  }

  /**
   * 
   * @param {*} obj 
   * @param {*} tex 
   */
  addBodyModelToScene(obj) {
    let body_measure = this.body_params.body_measure;

    if (body_measure && body_measure["cao"]) {
      this.setSceneScale(parseFloat(body_measure["cao"]));
    } else {
      this.setSceneScale(1.7);
    }

    this.traverseNode(obj, child => {
      if (child.isMesh) {
        let texture = this.render_target.render.texture;

        let body_material = new MeshStandardMaterial();
        body_material.roughness = 1.0;
        body_material.map = texture;
        body_material.skinning = true;
        body_material.specular = new Color(0.1, 0.1, 0.1);

        this.disposeNode({
          name: "body",
          mat: child.material
        });

        child.material = body_material;
        this.skeleton = child.skeleton;
      }
    });

    while (this.group_body.children.length) {
      this.mixer.uncacheRoot(this.group_body.children[0]);
      this.disposeNode(this.group_body.children[0]);
      this.group_body.remove(this.group_body.children[0]);
    }

    this.group_body.add(obj);

    if (this.base_action !== undefined) {
      let action = this.mixer.clipAction(obj.animations[0], obj).syncWith(this.base_action);
      action.play();
    } else {
      let action = this.mixer.clipAction(obj.animations[0], obj);
      this.base_action = action;
      action.play();
    }
  }

  /**
   * 
   * @param {*} params 
   */
  async loadModelFromAvatarList(params) {
    let req = {
      id: params.avatar_id,
      user_id: params.user_id
    }

    let domain = this.domains.user_domain;
    let user_model = await this.callAPIRequest(`${domain}/user_model/get`, "POST", req);
    if (user_model && user_model.result && user_model.result.length > 0) {
      let record = user_model.result[0];
      try {
        let content = JSON.parse(record.render_content);
        this.gender = content.gender;

        await Promise.all([
          (async () => {
            let tex_loader = new TextureLoader();
            let base_url = user_model.image_endpoint;
            let tex_path = record.image_texture_name;

            console.log(`${base_url}/${tex_path}`);
            let tex = await this.loadAsync(`${base_url}/${tex_path}`, tex_loader);

            let uniform = this.render_target.material.uniforms;
            if (uniform.tex.value !== undefined) {
              uniform.tex.value.dispose();
            }
            uniform.tex.value = tex;
          })(),
          (async () => {
            this.body_params.body_measure = content.body_measure;
            this.body_params.gender = content.gender;
            let body_params = await this.genModelFromMeasures();

            if (body_params) {
              let fbx_loader = new FBXLoader();
              let base_url = body_params.base_url;
              let model_path = body_params.model_path;

              console.log(`${base_url}/${model_path}`);
              let obj = await this.loadAsync(`${base_url}/${model_path}`, fbx_loader);

              if (obj) {
                this.addBodyModelToScene(obj);
              }
            }
          })()
        ]);

        if (content.base_skin) {
          let r = parseInt(content.base_skin.r) / 255.0;
          let g = parseInt(content.base_skin.g) / 255.0;
          let b = parseInt(content.base_skin.b) / 255.0;

          let uniform = this.render_target.material.uniforms
          uniform.base_skin.value = new Color(r, g, b);
        }

        if (content.skin_color) {
          this.setSkinColor(content.skin_color);
        }

        // if (content.hair_id) {
        //   this.setHairModelToScene(content.hair_id);
        // }
      } catch (err) {
        return {
          status: 500
        }
      }
    }
  }

  /**
   * 
   * @param {*} user_id 
   */
  async saveModelToAvatarList(user_id) {
    let req = {
      image_hex: this.image_hex
    }
  }

  /**
   * 
   * @param {*} hair_id 
   */
  async setHairModelToScene(hair_id) {
    let model_id = this.body_params.model_id;
    let gender = this.body_params.gender;

    if (model_id && gender) {
      let req = {
        hair_id: hair_id,
        gender: gender,
        model_id: model_id
      }

      let domain = this.domains.hair_domain;
      let hair_params = await this.callAPIRequest(`${domain}/get_hair_model`, "POST", req);

      if (hair_params && this.skeleton) {
        if (hair_params.base_url && hair_params.hair_path && hair_params.hair_offset) {
          this.body_params.hair_id = hair_id;
          await this.addHairModel(hair_params);
        }
      }
    }
  }

  /**
   * 
   * @param {*} hair_params 
   */
  async addHairModel(hair_params) {
    let fbx_loader = new FBXLoader(this.manager);
    let base_url = hair_params.base_url;
    let model_path = hair_params.hair_path;

    console.log(`${base_url}/${model_path}`);
    let obj = await this.loadAsync(`${base_url}/${model_path}`, fbx_loader);

    this.blobURLs.forEach(url => {
      URL.revokeObjectURL(url);
    });
    this.blobURLs = [];

    this.traverseNode(obj, child => {
      if (child.isMesh) {
        child.scale.set(0.01, 0.01, 0.01);
        child.translateY(-parseFloat(hair_params.hair_offset));
        child.translateZ(0.03);
        this.hairModelTraverse(child);
      }
    });
  }

  /**
   * 
   * @param {*} child 
   */
  hairModelTraverse(child) {
    if (Array.isArray(child.material)) {
      child.material.forEach(mat => {
        mat.roughness = 1.0;
        mat.vertexColors = false;
        mat.depthWrite = false;
        mat.side = DoubleSide;
      });
    } else {
      child.material.roughness = 1.0;
      child.material.vertexColors = false;
      child.material.depthWrite = false;
      child.material.side = DoubleSide;
    }

    this.skeleton.bones.forEach(bone => {
      if (bone.name === "mixamorigHead") {
        while (bone.children.length) {
          this.disposeNode(bone.children[0]);
          bone.remove(bone.children[0]);
        }
        bone.add(child);
      }
    });
  }

  /**
   * 
   */
  removeHairFromModel() {
    this.skeleton.bones.forEach(bone => {
      if (bone.name === "mixamorigHead") {
        while (bone.children.length) {
          this.disposeNode(bone.children[0]);
          bone.remove(bone.children[0]);
        }
      }
    });
  }

  /**
   * 
   */
  resetSkinColor() {}

  /**
   * 
   * @param {*} rgb 
   */
  async setSkinColor(color) {
    let r = parseInt(color.r) / 255.0;
    let g = parseInt(color.g) / 255.0;
    let b = parseInt(color.b) / 255.0;

    let uniform = this.render_target.material.uniforms
    uniform.skin_color.value = new Color(r, g, b);
  }

  /**
   * 
   * @returns 
   */
  async genFaceTexture() {
    let gender = this.body_params.gender;
    if (gender && this.face_scan) {
      let req = {
        gender: gender,
        face: this.face_scan
      }

      let domain = this.domains.face_domain;
      let token_res = await this.callAPIRequest(`${domain}/predict_face`, "POST", req);
      if (token_res && token_res.process_token) {
        let token = token_res.process_token;
        let req = {
          token: token
        }
        let image_res = await this.callIntervalAPIRequest(`${domain}/mobile/predict_face/result_status`, "POST", req);

        if (image_res && image_res.image_hex && image_res.skin_color) {
          this.image_hex = image_res.image_hex;
          let r = parseInt(image_res.skin_color.r) / 255.0;
          let g = parseInt(image_res.skin_color.g) / 255.0;
          let b = parseInt(image_res.skin_color.b) / 255.0;

          let tex_loader = new TextureLoader();
          let tex = await this.loadAsync(`${domain}/mobile/predict_face/result?token=${token}`, tex_loader);

          let uniform = this.render_target.material.uniforms;
          if (uniform.tex.value !== undefined) {
            uniform.tex.value.dispose();
          }
          uniform.tex.value = tex;
          uniform.base_skin.value = new Color(r, g, b);
          uniform.skin_color.value = new Color(r, g, b);
        }
      }
    }
  }

  /**
   * 
   * @param {*} cloth_params 
   * @param {*} reload 
   */
  async addClothToScene(cloth_params, reload = false) {
    let cloth_data = this.cloth_params.cloth_data;
    let cloth_info = reload || !cloth_data ? [] : cloth_data.cloth_info
    let model_id = this.body_params.model_id;

    if (cloth_info && model_id && cloth_params) {
      let req = {
        cloth_params: JSON.stringify(cloth_params),
        model_id: model_id,
        cloth_info: JSON.stringify(cloth_info)
      }

      let domain = this.domains.prod_domain;
      let cloth_data = await this.callAPIRequest(`${domain}/get_cloth_model`, "POST", req);

      if (cloth_data && cloth_data.base_url) {
        if (cloth_data.cloth_urls && cloth_data.cloth_info) {
          await this.showClothModelToScene(cloth_data);
          // await this.savePreviewContent(cloth_data);
        }
      }
    }
  }

  /**
   * 
   * @param {*} cloth_data 
   */
  async savePreviewContent(cloth_data) {
    let cloth_urls = cloth_data.cloth_urls;

    await new Promise(resolve => setTimeout(resolve, 500));
    if (cloth_urls.length === 2) {

      if (this.group_cloth.children.length === 2) {
        // let resize_canvas = document.createElement("canvas");
        // let resize_context = resize_canvas.getContext("2d");

        // resize_canvas.height = "960";
        // resize_canvas.width = "540";
        // resize_context.drawImage(this.canvas, 0, 0, 540, 960);
        // let image_base64 = resize_canvas.toDataURL("image/png");
        // this.cloth_params.cloth_img = image_base64;
      }
    }
  }

  /**
   * 
   * @returns 
   */
  getClothPreview() {
    return this.cloth_params;
  }

  /**
   * 
   * @param {*} cloth_data 
   */
  async showClothModelToScene(cloth_data) {
    let cloth_urls = cloth_data.cloth_urls;
    let group_array = [];
    await Promise.all(cloth_urls.map(async urls => {
      let [tex, gltf] = await Promise.all([
        (async () => {
          let tex_loader = new TextureLoader();
          let base_url = cloth_data.base_url;
          let tex_path = urls.tex_url;

          let tex = await this.loadAsync(`${base_url}/${tex_path}`, tex_loader);
          return tex;
        })(),
        (async () => {
          let gltf_loader = new GLTFLoader();
          let base_url = cloth_data.base_url;
          let model_path = urls.cloth_url;

          let gltf = await this.loadAsync(`${base_url}/${model_path}`, gltf_loader);
          return gltf;
        })()
      ]);

      tex.flipY = false;
      let object = gltf.scene;

      object.scale.set(0.2, 0.2, 0.2);
      object.translateY(0.7);

      this.traverseNode(object, child => {
        if (child.isMesh) {
          let texture_material = new MeshStandardMaterial();
          texture_material.vertexColors = false;
          texture_material.side = DoubleSide;
          texture_material.morphTargets = true;
          texture_material.morphNormals = true;
          texture_material.map = tex;

          let tension_material = new MeshStandardMaterial();
          tension_material.transparent = true;
          tension_material.side = DoubleSide;
          tension_material.wireframe = false;
          tension_material.vertexColors = true;
          tension_material.morphTargets = true;
          tension_material.morphNormals = true;

          child.tension_material = tension_material;
          child.texture_material = texture_material;

          this.disposeNode({
            name: "cloth",
            mat: child.material
          });
          child.material = texture_material;
        }
      });

      group_array.push({
        obj: object,
        clip: gltf.animations[0]
      });
    }));

    while (this.group_cloth.children.length) {
      this.mixer.uncacheRoot(this.group_cloth.children[0]);
      this.disposeNode(this.group_cloth.children[0]);
      this.group_cloth.remove(this.group_cloth.children[0]);
    }

    group_array.forEach(e => {
      this.group_cloth.add(e.obj);
      if (this.base_action !== undefined) {
        let action = this.mixer.clipAction(e.clip, e.obj).syncWith(this.base_action);
        action.play();
      } else {
        let action = this.mixer.clipAction(e.clip, e.obj);
        this.base_action = action;
        action.play();
      }
    });

    this.cloth_params.cloth_data = {
      base_url: cloth_data.base_url,
      cloth_urls: cloth_data.cloth_urls,
      cloth_info: cloth_data.cloth_info
    };
  }

  /**
   * 
   * @param {*} switchMode 
   */
  async changeClothModelViewMode(switchMode = false) {
    if (!switchMode) {
      await Promise.all(this.group_cloth.children.map(obj => {
        this.traverseNode(obj, child => {
          if (child.isMesh && child.texture_material) {
            child.material = child.texture_material;
          }
        });
      }));
    } else {
      await Promise.all(this.group_cloth.children.map(obj => {
        this.traverseNode(obj, child => {
          if (child.isMesh) {
            if (child.material.vertexColors === false && child.tension_material) {
              child.material = child.tension_material;
            } else if (child.material.vertexColors === true && child.texture_material) {
              child.material = child.texture_material;
            }
          }
        })
      }));
    }
  }

  /**
   * 
   * @param {*} brand_name 
   * @returns 
   */
  async getRecommendSize(brand_name) {
    let body_measure = this.body_params.body_measure;

    if (body_measure) {
      let req = {
        brand_name: brand_name,
      }
      Object.assign(req, this.body_measure);

      let domain = this.domains.size_domain;
      let res = await this.callAPIRequest(`${domain}/recommend_size`, "POST", req);

      if (res.recommend_size) {
        return res.recommend_size;
      }
    }
  }

  /**
   * 
   * @param {*} image_hex 
   */
  setFrontScan(image_hex) {
    this.front_scan = image_hex;
  }

  /**
   * 
   * @param {*} image_hex 
   */
  setSideScan(image_hex) {
    this.side_scan = image_hex;
  }

  /**
   * 
   * @param {*} image_hex 
   */
  setFaceScan(image_hex) {
    this.face_scan = image_hex;
  }

  /**
   * 
   */
  async captureFrameFront() {
    this.front_scan = localStorage.getItem("front");
  }

  /**
   * 
   */
  async captureFrameSide() {
    this.side_scan = localStorage.getItem("side");
  }

  /**
   * 
   */
  async captureFrameFace() {
    this.face_scan = localStorage.getItem("face");
  }
}

export {
  VTOModule
};