import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import * as React from 'react';

import { VTOModule } from "./lib/3dr.mobile.js";

/**
 * @author Duc Long Tran
 * 
 * @description
 * Class sử dụng để call API bên server VTO và vẽ 3D lên canvas
 * THREE.js được sử dụng để render mô hình 3D
 * Bộ nhớ 3D cần phải được free manual, không thể tự động free bằng garbage collection
 * 
 * Do garbage collection chỉ free bộ nhớ trên RAM, không free bộ nhớ GPU, vì thế nếu làm mất reference
 * của instance sẽ dẫn tới việc không thể free bộ nhớ các phần đã mất reference gây ra leak memory.
 * Vì vậy chỉ nên sử dụng cách khởi tạo bằng phương thức getInstance() (được viết theo dạng singleton)
 * 
 * @requires
 * Hiện tại mình đang thử trên bản sử dụng expo framework. Mình sẽ thử phát triển một phiên bản khác 
 * không sử dụng expo để so sánh.
 * Cài đặt expo bằng lệnh: npm install -g expo-cli
 * 
 * Phần 3D hiện tại đang sử dụng expo-three được cung cấp bởi expo framework.
 * Khởi tạo một project của expo sử dụng lệnh của npx (nếu không sẽ không tương thích phiên bản)
 * 
 * npx create-react-native-app -t with-three
 * Sau khi download vào file node_modules/three/build/three.js và commend hai dòng:
 * _gl.pixelStorei( 37441, texture.premultiplyAlpha );
 * _gl.pixelStorei( 3317, texture.unpackAlignment ); 
 * Lý do là expo chưa hỗ trợ các tham số này và lúc chạy sẽ ghi ra nhiều log khó debug
 * 
 * run project tutorial:
 * Kết nối điện thoại vào máy tính, mở chế độ usb debugger (cần sử dụng developer mode)
 * Mở terminal chạy expo start (hoặc yarn start)
 * Trình duyệt tự động mở -> chọn local (ít gặp lỗi kết nối) -> mở trên android
 * 
 * WARNING: nếu có bất cứ vấn đề gì với expo cần thông báo ngay cho mình qua whatapps 
 * để mình kịp thời thay đổi, do mình vừa học react-native nhiều vấn đề chưa nắm được
 * 
 * @type
 * Các hình ảnh gửi lên sử dụng dạng hex của ảnh jpeg
 * Các file hex ví dụ được lưu trong ba file samples/[front_scan|side_scan|face_scan].js
 * Sử dụng trang web https://codepen.io/abdhass/full/jdRNdj để check đầu vào
 * 
 * @implements
 * Hiện tại ngoại trừ các function dưới đây, phần còn lại đã chạy được và tested
 * Nguyên nhân vì chưa xử lý được vấn đề chuỗi binary trên điện thoại
 * 
 * - saveModelToAvatarList
 * - setHairModelToScene
 * - getClothPreview
 * 
 * @tutorial
 * // import VTOMdule từ file js
 * import { VTOModule } from "./lib/3dr.mobile.js";
 * 
 * // Lấy ra instance của VTOModule và khởi tạo nếu cần thiết
 * let vtoModule = VTOModule.getInstance();
 * 
 * // Set domains sử dụng trong VTOModule
 * let domains = {
 *  "3dr_domain": "http://54.255.188.213",
 *  "vto_domain": "http://54.151.147.171",
 *  "avt_domain": "http://18.141.220.109",
 * }
 * vtoModule.setVTODomains(domains);
 * 
 * // Khởi tạo hệ renderer, có thể gọi ngay sau khi canvas khởi tạo thành công
 * // Hàm khởi tạo không ảnh hưởng tới các hàm thêm model vào scene, có thể call độc lập
 * // Nếu thêm model vào scene nhưng chưa khởi tạo renderer, canvas không hiển thị
 * 
 * import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
 * function App() {
 *   return <GLView style={{ flex: 1 }} onContextCreate={ 
 *     async (gl: ExpoWebGLRenderingContext) => {
 *       vtoModule.initWebRenderer(gl);
 *     }
 *   } />;
 * }
 * 
 * // Mở một session mới
 * let session_params = {
 *  "gender": "male" // "female"
 *  "weight": 65.0   // Hiện tại chưa có API không cân
 * }
 * vtoModule.initGuestSession(params);
 * 
 * // truyền ảnh vào VTOModule
 * // Xem qua các input trong 3 file samples để hiểu thêm về đầu vào
 * 
 * // ảnh mặt trước, kích thước 720x1280
 * vtoModule.setFrontScan(front_scan);
 * 
 * // ảnh mặt ngang, kích thước 720x1280
 * vtoModule.setSideScan(side_scan);
 * 
 * // ảnh chụp mặt, kích thước 256x256
 * vtoModule.setFaceScan(face_scan);
 * 
 * // Hai hàm dựng người và dựng mặt
 * // Trước khi chạy hai hàm này cần gọi hàm initGuestSession()
 * 
 * // Hàm dựng người cần call hai hàm setFrontScan và setSideScan để set đầu vào
 * // Hàm dựng người sẽ tự động call hàm dựng mặt nếu có truyền face_scan vào VTOModule
 * // Hàm dựng mặt từ ảnh cần call hàm setFaceScan để set đầu vào
 * 
 * // Dự đoán cơ thể người từ ảnh
 * vtoModule.genModelFromImage();
 * 
 * // Hàm dựng mặt từ ảnh
 * vtoModule.genFaceTexture();
 * 
 * // Hàm mặc quần áo lên cơ thể người
 * // Hai param là size và tex_id có thể không truyền (backend có mặc định) 
 * let cloth_params = {
 *  "brand_name": "Manplus",   // Truyền tên cửa hàng
 *  "sku_code": "A.1.1",       // truyền SKU code của sản phẩm
 *  "size": "M",               // size "S", "M", "L", "XL", ...
 *  "tex_id": 0                // index của texture: 0, 1, 2, ...
 * }
 * vtoModule.addClothToScene(cloth_params);
 * 
 * // Hàm đổi màu da
 * let skin_color = {
 *  "r": 127,
 *  "g": 127,
 *  "b": 127
 * }
 * vtoModule.setSkinColor(skin_color);
 * 
 * // Hàm load model từ avatar list của người dùng
 * // Hàm này sẽ tự động vẽ lên 3D sau khi dowwnload được dữ liệu xuống 
 * let avatar_params = {
 *   avatar_id : "09999298-a4af-11eb-8266-0ab99c26f928",
 *   user_id : "7c642c96-9d04-11eb-8266-0ab99c26f928"
 * }
 * vtoModule.loadModelFromAvatarList(avatar_params);
 * 
 * @example
 * Ví dụ bên dưới bao gồm hai function và một interval
 * function runExamplePredict là chạy predict từ ảnh
 * function runExampleReload là load data được lưu từ avatar list
 * Hiện tại do hàm saveModelToAvatarList chưa hoạt động đầy đủ, vì thế hiện tại
 * sử dụng mặc định đàu vào avatar_params để test
 * 
 * @exports App
 */

// import sample image hex
import front_scan from "./samples/front_scan.js";
import side_scan from "./samples/side_scan.js";
import face_scan from "./samples/face_scan.js";

let vtoModule = VTOModule.getInstance();
let domains = {
  "3dr_domain": "http://54.255.188.213",
  "vto_domain": "http://54.151.147.171",
  "avt_domain": "http://18.141.220.109",
}

vtoModule.setVTODomains(domains);

async function runExamplePredict() {

  // init params
  vtoModule.initGuestSession({ "gender": "male", "weight": 65.0 })

  // set sample image hex
  vtoModule.setFrontScan(front_scan);
  vtoModule.setSideScan(side_scan);

  // predict body
  await vtoModule.genModelFromImage();

  // set sample image face
  vtoModule.setFaceScan(face_scan);
  await vtoModule.genFaceTexture();

  // add cloth
  await vtoModule.addClothToScene({ "brand_name": "Manplus", "sku_code": "A.1.1" });
  await vtoModule.addClothToScene({ "brand_name": "Manplus", "sku_code": "Q.1.1" });
}

async function runExampleReload() {
  let avatar_params = {
    avatar_id : "09999298-a4af-11eb-8266-0ab99c26f928",
    user_id : "7c642c96-9d04-11eb-8266-0ab99c26f928"
  }

  // load model from avatar list
  await vtoModule.loadModelFromAvatarList(avatar_params);

  // load cloth model
  await vtoModule.addClothToScene({ "brand_name": "Manplus", "sku_code": "A.1.2" });
  await vtoModule.addClothToScene({ "brand_name": "Manplus", "sku_code": "Q.1.2" });
}

// chỉ nên thử một trong hai function
// runExamplePredict();
runExampleReload();

let skinColorList = [
  { "r": 244, "g": 211, "b": 204 },
  { "r": 240, "g": 213, "b": 201 },
  { "r": 237, "g": 216, "b": 197 },
  { "r": 224, "g": 176, "b": 166 },
  { "r": 220, "g": 177, "b": 158 },
  { "r": 213, "g": 182, "b": 153 },
  { "r": 198, "g": 141, "b": 129 },
  { "r": 190, "g": 142, "b": 118 },
  { "r": 183, "g": 147, "b": 111 }
]
let skinCounter = 0;

setInterval(() => {
  vtoModule.setSkinColor(skinColorList[skinCounter]);
  skinCounter = (skinCounter + 1) % (skinColorList.length);
}, 1000);

export default function App() {
  return <GLView style={{ flex: 1 }} onContextCreate={
    async (gl: ExpoWebGLRenderingContext) => {
      vtoModule.initWebRenderer(gl);
    }
  } />;
}