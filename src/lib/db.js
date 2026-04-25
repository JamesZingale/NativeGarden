import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root1",
  database: "native_garden",
  port: 3306
});

export default pool;