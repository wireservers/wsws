const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://wsadmin:W!r3W!r31!@ws-cloud-mongo.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected!");
    const db = client.db("foods-test");
    const collections = await db.listCollections().toArray();
    console.log(
      "Collections:",
      collections.map((c) => c.name)
    );

    // Get unique nutrients from nutritionfacts
    const nfColl = db.collection("nutritionfacts");
    const nutrients = new Map();
    const cursor = nfColl.find({}).limit(20000);
    let count = 0;
    for await (const doc of cursor) {
      count++;
      const key = String(doc.nutrientId);
      if (!nutrients.has(key)) {
        nutrients.set(key, {
          nutrientId: doc.nutrientId,
          nutrientNumber: doc.nutrientNumber,
          nutrientName: doc.nutrientName,
          unitName: doc.unitName,
          nutrientRank: doc.nutrientRank,
        });
      }
    }
    console.log(`\nScanned ${count} nutritionfacts docs`);
    console.log(`Unique nutrient types: ${nutrients.size}\n`);
    for (const [, v] of nutrients) {
      console.log(
        `  ${v.nutrientId} | #${v.nutrientNumber} | ${v.nutrientName} | ${v.unitName}`
      );
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);
