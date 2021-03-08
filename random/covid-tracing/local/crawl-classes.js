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
    url: `http://112.137.129.115/tkb/listbylist.php`,
  });
  const $ = cheerio.load(resultFetch.data);

  $("form>table:nth-child(4)>tbody>tr:nth-of-type(n+2)").each((index, e) => {
    const mapping = {
      MaMH: "",
      TenMonHoc: "",
      TinChi: "",
      MaLopMH: "",
      GiaoVien: "",
      SoSV: "",
      Buoi: "",
      Thu: "",
      Tiet: "",
      GiangDuong: "",
      GhiChu: "",
    };
    mapping.MaMH = e.children[1].children[0].data;
    mapping.TenMonHoc = e.children[2].children[0].data;
    mapping.TinChi = e.children[3].children[0].data;
    mapping.MaLopMH = e.children[4].children[0].data;
    mapping.GiaoVien = e.children[5].children[0].data;
    mapping.SoSV = e.children[6].children[0].data;
    mapping.Buoi = e.children[7].children[0].data;
    mapping.Thu = e.children[8].children[0].data;
    mapping.Tiet = e.children[9].children[0].data;
    mapping.GiangDuong = e.children[10].children[0].data;
    mapping.GhiChu = e.children[11].children[0].data;

    result.push(mapping);
  });
  result.forEach((mapping) => {
    const sql = 'INSERT INTO class VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    dbCon.query(sql, [
      mapping.MaMH,
      mapping.TenMonHoc,
      mapping.TinChi,
      mapping.MaLopMH,
      mapping.GiaoVien,
      mapping.SoSV,
      mapping.Buoi,
      mapping.Thu,
      mapping.Tiet,
      mapping.GiangDuong,
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