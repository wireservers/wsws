#!/usr/bin/env mongosh
// Syncs foods-test → foods: inserts missing docs, updates changed docs, skips identical ones.
// Usage: mongosh "<connection-string>" sync-db.js

const SOURCE_DB = "foods-test";
const TARGET_DB = "foods";
const BATCH_SIZE = 500;

const sourceDb = db.getSiblingDB(SOURCE_DB);
const targetDb = db.getSiblingDB(TARGET_DB);

const sourceCollections = sourceDb.getCollectionNames();
print(`\nSource DB "${SOURCE_DB}" has ${sourceCollections.length} collections: ${sourceCollections.join(", ")}`);
print(`Target DB "${TARGET_DB}"\n`);

let totalInserted = 0;
let totalUpdated = 0;
let totalSkipped = 0;

for (const collName of sourceCollections) {
  const sourceColl = sourceDb.getCollection(collName);
  const targetColl = targetDb.getCollection(collName);

  print(`--- ${collName} ---`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let processed = 0;

  const cursor = sourceColl.find({}).batchSize(BATCH_SIZE);
  let batch = [];

  while (cursor.hasNext()) {
    batch.push(cursor.next());

    if (batch.length >= BATCH_SIZE || !cursor.hasNext()) {
      const ids = batch.map((d) => d._id);
      // Fetch existing docs in target by _id
      const existingDocs = {};
      targetColl
        .find({ _id: { $in: ids } })
        .forEach((d) => {
          existingDocs[d._id.toString()] = d;
        });

      const ops = [];

      for (const srcDoc of batch) {
        const idStr = srcDoc._id.toString();
        const existing = existingDocs[idStr];

        if (!existing) {
          // Document doesn't exist in target → insert
          ops.push({ insertOne: { document: srcDoc } });
          inserted++;
        } else {
          // Compare content (exclude _id)
          const srcCopy = Object.assign({}, srcDoc);
          const tgtCopy = Object.assign({}, existing);
          delete srcCopy._id;
          delete tgtCopy._id;

          if (JSON.stringify(srcCopy) !== JSON.stringify(tgtCopy)) {
            // Content differs → replace
            ops.push({
              replaceOne: {
                filter: { _id: srcDoc._id },
                replacement: srcDoc,
              },
            });
            updated++;
          } else {
            skipped++;
          }
        }
      }

      if (ops.length > 0) {
        targetColl.bulkWrite(ops, { ordered: false });
      }

      processed += batch.length;
      if (processed % 5000 === 0) {
        print(`  processed ${processed}...`);
      }
      batch = [];
    }
  }

  print(
    `  ${collName}: ${inserted} inserted, ${updated} updated, ${skipped} unchanged (${processed} total)`
  );
  totalInserted += inserted;
  totalUpdated += updated;
  totalSkipped += skipped;
}

print(`\n=== DONE ===`);
print(
  `Total: ${totalInserted} inserted, ${totalUpdated} updated, ${totalSkipped} unchanged`
);
