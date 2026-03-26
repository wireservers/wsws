const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const uri = process.env.MONGO_URI || 'mongodb://wsadmin:W!r3W!r31!@fc-d3c79b65ba80-000.global.mongocluster.cosmos.azure.com:10260/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';
const DB_NAME = process.env.DB_NAME || 'foods-test';
const IMAGE_DIR = path.join(__dirname, '..', 'bring-the-diet', 'web', 'public', 'images', 'blog');
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// Map of slug -> Pexels search query for relevant food photography
const SEARCH_MAP = {
  'understanding-macronutrients-protein-carbs-and-fats': 'balanced meal chicken avocado quinoa',
  'mediterranean-diet-complete-beginners-guide': 'mediterranean food olive oil salad',
  'intermittent-fasting-benefits-methods-science': 'empty plate clock healthy food',
  'plant-based-nutrition-meeting-nutritional-needs': 'vegan plant based food colorful',
  'keto-diet-explained-how-it-works': 'keto diet avocado salmon eggs',
  'anti-inflammatory-foods-reduce-chronic-inflammation': 'blueberries salmon turmeric healthy food',
  'gut-health-probiotics-prebiotics-guide': 'yogurt fermented food probiotics',
  'meal-prep-weight-loss-strategies': 'meal prep containers healthy food',
  'protein-requirements-athletes-how-much': 'protein food chicken eggs fitness',
  'essential-guide-micronutrients-vitamins-minerals': 'colorful fruits vegetables rainbow',
  'dash-diet-lowering-blood-pressure-through-food': 'heart healthy salmon broccoli meal',
  'hydration-health-how-much-water-you-need': 'water glass lemon hydration fresh',
  'understanding-food-labels-decoding-guide': 'nutrition label grocery shopping',
  'glycemic-index-how-carbs-affect-blood-sugar': 'whole grain bread rice healthy carbs',
  'omega-3-fatty-acids-why-they-matter': 'salmon walnuts omega 3 fish',
  'mindful-eating-paying-attention-transform-diet': 'mindful eating bowl salad peaceful',
  'superfoods-demystified-separating-hype-science': 'superfoods acai blueberry avocado',
  'sleep-nutrition-how-food-affects-sleep': 'chamomile tea bedtime relaxing',
  'healthy-cooking-methods-maximizing-nutrition': 'steaming vegetables healthy cooking',
  'fiber-most-underrated-nutrient-in-diet': 'high fiber food oats beans lentils',
  'sports-nutrition-fueling-before-during-after-exercise': 'sports nutrition banana protein smoothie',
  'sodium-health-finding-right-balance': 'herbs spices seasoning cooking',
  'nutrition-healthy-aging-eating-well-50s-60s-beyond': 'healthy senior eating nutritious meal',
  'debunking-diet-myths-what-science-supports': 'fresh vegetables fruits nutrition science',
  'whole30-diet-rules-benefits-what-to-expect': 'whole30 grilled steak vegetables clean eating',
  'building-balanced-breakfast-morning-nutrition': 'healthy breakfast eggs avocado toast',
  'paleo-diet-eating-like-ancestors-modern-world': 'paleo food grilled meat vegetables nuts',
  'nutrition-mental-health-food-mood-connection': 'brain food walnuts blueberries dark chocolate',
  'calorie-counting-vs-intuitive-eating-which-right': 'healthy colorful bowl food mindful',
};

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filePath);
    protocol.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadFile(response.headers.location, filePath).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchPexels(query) {
  return new Promise((resolve, reject) => {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
    const options = {
      headers: { Authorization: PEXELS_API_KEY },
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.photos && json.photos.length > 0) {
            // Use large2x for high quality (fits ~1880px wide)
            resolve(json.photos[0].src.large2x);
          } else {
            reject(new Error(`No photos found for query: "${query}"`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse Pexels response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  if (!PEXELS_API_KEY) {
    console.error('ERROR: PEXELS_API_KEY environment variable is not set.');
    console.error('Get a free API key at: https://www.pexels.com/api/');
    console.error('Set it with: export PEXELS_API_KEY="your-key-here"');
    process.exit(1);
  }

  fs.mkdirSync(IMAGE_DIR, { recursive: true });

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(DB_NAME);
    const blogCol = db.collection('blogposts');

    const posts = await blogCol.find(
      {},
      { projection: { _id: 1, slug: 1, title: 1, category: 1, image: 1 } }
    ).toArray();

    console.log(`Found ${posts.length} blog posts\n`);

    let downloaded = 0;
    let skipped = 0;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const imagePath = `/images/blog/${post.slug}.jpg`;
      const localPath = path.join(IMAGE_DIR, `${post.slug}.jpg`);

      // Skip if image already exists locally
      if (fs.existsSync(localPath)) {
        console.log(`[${i + 1}/${posts.length}] SKIP (file exists): ${post.title}`);
        if (!post.image) {
          await blogCol.updateOne({ _id: post._id }, { $set: { image: imagePath } });
          console.log(`  Updated DB image field`);
        }
        skipped++;
        continue;
      }

      const query = SEARCH_MAP[post.slug] || `healthy ${post.category.toLowerCase()} food`;
      console.log(`[${i + 1}/${posts.length}] Searching Pexels: "${query}"`);

      try {
        const imageUrl = await searchPexels(query);
        console.log(`  Downloading: ${imageUrl.substring(0, 80)}...`);
        await downloadFile(imageUrl, localPath);
        console.log(`  Saved to: ${localPath}`);

        await blogCol.updateOne({ _id: post._id }, { $set: { image: imagePath } });
        console.log(`  Updated DB image field to: ${imagePath}`);

        downloaded++;

        // Pexels rate limit: 200 requests/hour — 1s delay is plenty
        if (i < posts.length - 1) {
          await delay(1000);
        }
      } catch (err) {
        console.error(`  ERROR for "${post.title}": ${err.message}`);
        console.log(`  Continuing to next post...\n`);
      }
    }

    console.log(`\nDone! Downloaded: ${downloaded}, Skipped: ${skipped}, Total: ${posts.length}`);

  } finally {
    await client.close();
  }
}

main().catch(console.error);
