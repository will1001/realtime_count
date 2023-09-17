const { auth, role, xendit_callback } = require("../middleware/index");

module.exports = ({
  UserController,
  RegionController,
}) => [
  {
    method: "GET",
    path: "/",
    handler: UserController.hello,
  },
  {
    method: "POST",
    path: "/register",
    handler: UserController.register,
  },
  {
    method: "POST",
    path: "/login",
    handler: UserController.login,
  },
  {
    method: "GET",
    path: "/kabupaten",
    handler: RegionController.getKabupaten,
  },
  {
    method: "GET",
    path: "/kecamatan/:id_kabupaten",
    handler: RegionController.getKecamatan,
  },
  {
    method: "GET",
    path: "/kelurahan/:id_kecamatan",
    handler: RegionController.getKelurahan,
  },
  {
    method: "GET",
    path: "/kelurahans",
    handler: RegionController.getKelurahans,
  },
];
