const { MongoClient, ObjectId } = require("mongodb");

const URI =
  "mongodb+srv://wsadmin:W!r3W!r31!@ws-cloud-mongo.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";
const DB_NAME = "foods-test";
const BATCH_SIZE = 500;

// Categorize nutrients by FDA nutrient ID ranges
function categorize(nutrientId) {
  if ([1008].includes(nutrientId)) return "Energy";
  if ([1003, 1004, 1005].includes(nutrientId)) return "Macronutrient";
  if ([1079, 1082, 1084].includes(nutrientId)) return "Fiber";
  if ([2000, 1235, 1086].includes(nutrientId)) return "Carbohydrate";
  if (nutrientId >= 1253 && nutrientId <= 1293) return "Lipid";
  if (nutrientId >= 1087 && nutrientId <= 1103) return "Mineral";
  if (nutrientId >= 1104 && nutrientId <= 1186) return "Vitamin";
  return "Other";
}

async function main() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    console.log("Connected to", DB_NAME);
    const db = client.db(DB_NAME);

    // -------------------------------------------------------
    // Step 1: Scan ALL nutritionfacts to extract unique nutrients
    // -------------------------------------------------------
    console.log("\n=== Step 1: Extract unique nutrients ===");
    const nfColl = db.collection("nutritionfacts");
    const uniqueNutrients = new Map(); // keyed by FDA nutrientId
    let scanned = 0;

    const scanCursor = nfColl.find({});
    for await (const doc of scanCursor) {
      scanned++;
      const key = doc.nutrientId; // FDA nutrient ID (int)
      if (!uniqueNutrients.has(key)) {
        uniqueNutrients.set(key, {
          nutrientId: doc.nutrientId,
          nutrientNumber: doc.nutrientNumber,
          nutrientName: doc.nutrientName,
          unitName: doc.unitName,
          nutrientRank: doc.nutrientRank || 0,
        });
      }
      if (scanned % 100000 === 0) console.log(`  scanned ${scanned}...`);
    }
    console.log(
      `  Scanned ${scanned} nutritionfacts, found ${uniqueNutrients.size} unique nutrients`
    );

    // -------------------------------------------------------
    // Step 2: Create 'nutrients' collection (the lookup table)
    // -------------------------------------------------------
    console.log("\n=== Step 2: Create nutrients collection ===");
    const nutrientsColl = db.collection("nutrients");

    // Check if it already exists with data
    const existingCount = await nutrientsColl.countDocuments();
    if (existingCount > 0) {
      console.log(
        `  nutrients collection already has ${existingCount} docs — dropping and recreating`
      );
      await nutrientsColl.drop();
    }

    const nutrientDocs = [];
    for (const [, v] of uniqueNutrients) {
      nutrientDocs.push({
        nutrientNumber: v.nutrientId, // FDA nutrient ID → nutrientNumber in model
        name: v.nutrientName,
        unit: v.unitName,
        category: categorize(v.nutrientId),
        sortOrder: v.nutrientRank || 0,
      });
    }
    // Sort by sortOrder for consistent ordering
    nutrientDocs.sort((a, b) => a.sortOrder - b.sortOrder);

    const insertResult = await nutrientsColl.insertMany(nutrientDocs);
    console.log(`  Inserted ${insertResult.insertedCount} nutrient records`);

    // Build lookup: FDA nutrientId → new MongoDB ObjectId
    const nutrientIdMap = new Map(); // FDA nutrientId → ObjectId
    const allNutrients = await nutrientsColl.find({}).toArray();
    for (const n of allNutrients) {
      nutrientIdMap.set(n.nutrientNumber, n._id);
    }
    console.log(`  Built nutrient lookup map (${nutrientIdMap.size} entries)`);

    // -------------------------------------------------------
    // Step 3: Build food fdcId → ObjectId lookup
    // -------------------------------------------------------
    console.log("\n=== Step 3: Build food fdcId → _id lookup ===");
    const foodsColl = db.collection("foundationfoods");
    const foodIdMap = new Map(); // fdcId → ObjectId
    let foodCount = 0;
    const foodCursor = foodsColl.find({});
    for await (const food of foodCursor) {
      foodIdMap.set(food.fdcId, food._id);
      foodCount++;
      if (foodCount % 100000 === 0) console.log(`  loaded ${foodCount} foods...`);
    }
    console.log(`  Loaded ${foodCount} foods into lookup map`);

    // -------------------------------------------------------
    // Step 4: Create 'foodnutrients' junction collection
    // -------------------------------------------------------
    console.log("\n=== Step 4: Create foodnutrients collection ===");
    const fnColl = db.collection("foodnutrients");

    const existingFnCount = await fnColl.countDocuments();
    if (existingFnCount > 0) {
      console.log(
        `  foodnutrients collection already has ${existingFnCount} docs — dropping and recreating`
      );
      await fnColl.drop();
    }

    let processed = 0;
    let inserted = 0;
    let skipped = 0;
    let batch = [];

    const nfCursor2 = nfColl.find({});
    for await (const doc of nfCursor2) {
      processed++;

      const foodOid = foodIdMap.get(doc.foodFdcId);
      const nutrientOid = nutrientIdMap.get(doc.nutrientId);

      if (!foodOid || !nutrientOid) {
        skipped++;
        if (processed % 100000 === 0)
          console.log(
            `  processed ${processed}, inserted ${inserted}, skipped ${skipped}...`
          );
        continue;
      }

      batch.push({
        foodId: foodOid.toString(),
        nutrientId: nutrientOid.toString(),
        amount: doc.amount || 0,
        derivationDescription: doc.derivationDescription || null,
        dataPoints: null,
        min: null,
        max: null,
      });

      if (batch.length >= BATCH_SIZE) {
        await fnColl.insertMany(batch, { ordered: false });
        inserted += batch.length;
        batch = [];
      }

      if (processed % 100000 === 0)
        console.log(
          `  processed ${processed}, inserted ${inserted}, skipped ${skipped}...`
        );
    }

    // Flush remaining
    if (batch.length > 0) {
      await fnColl.insertMany(batch, { ordered: false });
      inserted += batch.length;
    }

    console.log(
      `\n  Done: ${processed} processed, ${inserted} inserted, ${skipped} skipped (no matching food)`
    );

    // -------------------------------------------------------
    // Step 5: Create indexes
    // -------------------------------------------------------
    console.log("\n=== Step 5: Create indexes ===");
    await fnColl.createIndex({ foodId: 1 });
    await fnColl.createIndex({ nutrientId: 1 });
    await nutrientsColl.createIndex({ nutrientNumber: 1 }, { unique: true });
    console.log("  Indexes created on foodnutrients (foodId, nutrientId) and nutrients (nutrientNumber)");

    // -------------------------------------------------------
    // Summary
    // -------------------------------------------------------
    console.log("\n=== DONE ===");
    console.log(`  nutrients collection: ${allNutrients.length} records`);
    console.log(`  foodnutrients collection: ${inserted} records`);
    console.log(`  (original nutritionfacts: ${scanned} records — kept as-is for reference)`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
