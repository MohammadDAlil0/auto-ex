const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Database connection settings
const config = {
  user: "postgres",
  host: "localhost",
  database: "ExamManager",
  password: "postgres",
  port: 5432,
};

// Function to reset the database (drop and recreate)
async function resetDatabase() {
  const client = new Client({ ...config, database: "postgres" }); // Connect to the default database
  await client.connect();
  try {
    await client.query(`DROP DATABASE IF EXISTS "${config.database}";`);
    await client.query(`CREATE DATABASE "${config.database}";`);
    console.log(`Database ${config.database} reset successfully.`);
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await client.end();
  }
}

// Function to drop a specific table
async function deleteRowsFromTable(tableName) {
  const client = new Client(config);
  await client.connect();
  try {
    await client.query(`DELETE FROM "${tableName}" CASCADE;`);
    console.log(`All rows in table ${tableName} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting rows:", error);
  } finally {
    await client.end();
  }
}

/*
Select json_agg(public."Users".*) from public."Users";
*/

// Function to insert data into a specific table by reading a JSON file
async function insertData(tableName, jsonFilePath) {
  const client = new Client(config);
  await client.connect();

  // Read data from the JSON file
  let data;
  try {
    const jsonData = fs.readFileSync(path.resolve(jsonFilePath), "utf8");
    data = JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    process.exit(1);
  }

  // Check if data is an array
  if (!Array.isArray(data)) {
    console.error("Data should be an array of objects.");
    process.exit(1);
  }

  // Generate the SQL query for bulk insert
  try {
    const columns = Object.keys(data[0]).map((key) => `"${key}"`)
    .join(", ");;
    const values = data
      .map((row) => {
        return `(${Object.values(row)
          .map((value) => `'${value}'`)
          .join(", ")})`;
      })
      .join(", ");

    const query = `INSERT INTO "${tableName}" (${columns}) VALUES ${values};`;

    // Execute the query
    await client.query(query);
    console.log(`Data inserted into table ${tableName} successfully.`);
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await client.end();
  }
}

// Parse command-line arguments
const command = process.argv[2];
const tableName = process.argv[3];
const jsonFilePath = process.argv[4];

// Run the appropriate function based on the command
(async () => {
    console.log(command)
  switch (command) {
    case "dropDatabase":
      await resetDatabase();
      break;
    case "dropTable":
      if (!tableName) {
        console.error("Please specify a table name, e.g., node database-utils.js dropTable users");
        process.exit(1);
      }
      await deleteRowsFromTable(tableName);
      break;
    case "insertData":
      if (!tableName || !jsonFilePath) {
        console.error("Please specify a table name and JSON file path, e.g., node database-utils.js insertData users ./data.json");
        process.exit(1);
      }
      await insertData(tableName, jsonFilePath);
      break;
    default:
      console.log("Unknown command. Use one of: resetDatabase, dropTable <table_name>, insertData <table_name> <json_file_path>");
      process.exit(1);
  }
})();
