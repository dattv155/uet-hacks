require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
var mysql = require('mysql')

function connectDatabase() {
  var con = mysql.createConnection({
    host: 'localhost',
    user: 'backend',
    password: 'backend',
    database: 'backend'
  });
  con.connect(function (err) {
    if (err) throw err;
    console.log('connected!');
  });
  return con;
}

async function mainJob(dbCon) {
  const result = [];

  const resultFetch = await axios({
    method: "GET",
    url: `http://112.137.129.87/qldt/index.php?SinhvienLmh%5Bterm_id%5D=030&page=1&ajax=sinhvien-lmh-grid&pageSize=50000&r=sinhvienLmh%2Fadmin`,
  });
  const $ = cheerio.load(resultFetch.data);

  $("tbody>tr").each((index, e) => {
    const mapping = {
      STT: "",
      MaLH: "",
      NgaySinh: "",
      LopKhoaHoc: "",
      MaLMH: "",
      TenMonHoc: "",
      Nhom: "",
      SoTinChi: "",
      GhiChu: "",
    };
    mapping.MaSV = e.children[2].children[0].data;
    mapping.HoVaTen = e.children[3].children[0].data;
    mapping.NgaySinh = e.children[4].children[0].data;
    mapping.LopKhoaHoc = e.children[5].children[0].data;
    mapping.MaLMH = e.children[6].children[0].data;
    mapping.TenMonHoc = e.children[7].children[0].data;
    mapping.Nhom = e.children[8].children[0].data;
    mapping.SoTinChi = e.children[9].children[0].data;
    mapping.GhiChu = e.children[10].children[0].data;
    result.push(mapping);
  });
  result.forEach((mapping) => {
    const sql = 'INSERT INTO schedule VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';
    dbCon.query(sql, [
      mapping.MaSV,
      mapping.HoVaTen,
      mapping.NgaySinh,
      mapping.LopKhoaHoc,
      mapping.MaLMH,
      mapping.TenMonHoc,
      mapping.Nhom,
      mapping.SoTinChi,
      mapping.GhiChu,
    ], function (err, result) { });
  })
}

async function main() {
  const dbCon = connectDatabase();
  await mainJob(dbCon);
  console.log("Done");
}

main();