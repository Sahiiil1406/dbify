require('dotenv').config();

const { Firecrawl } = require('@mendable/firecrawl-js');
const OpenAI = require('openai');
const { ChromaClient } = require('chromadb');
const crypto = require('crypto');

// Initialize with OpenAI instead of Gemini
const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let chroma, collection;

async function connectDB() {
  chroma = new ChromaClient();
  
  try {
    // Try to create collection
    collection = await chroma.createCollection({
      name: "scraped_docs",
      metadata: { "hnsw:space": "cosine" }
    });
    console.log('✅ Created new ChromaDB collection');
  } catch (err) {
    // Collection exists, get it
    collection = await chroma.getCollection({ name: "scraped_docs" });
    console.log('✅ Connected to existing ChromaDB collection');
  }
}

// Enhanced scraping with fallback for direct URLs
async function scrape(url) {
  try {
    // Try Firecrawl first
    const response = await firecrawl.scrape(url, { 
      formats: ['markdown'],
      onlyMainContent: true 
    });
    console.log(`🌐 Scraped with Firecrawl: ${response.metadata?.title || 'Unknown Title'}`);
    return {
      id: crypto.createHash('md5').update(url).digest('hex'),
      url: url,
      title: response.metadata?.title || 'Unknown Title',
      content: response.markdown || response.content || ''
    };
  } catch (error) {
    console.log(`⚠️ Firecrawl failed for ${url}, trying direct fetch...`);
    
    // Fallback to direct fetch for raw GitHub files
    try {
      const fetch = require('node-fetch');
      const response = await fetch(url);
      const content = await response.text();
      
      const title = url.split('/').pop() || 'README.md';
      console.log(`🌐 Scraped directly: ${title}`);
      
      return {
        id: crypto.createHash('md5').update(url).digest('hex'),
        url: url,
        title: title,
        content: content
      };
    } catch (fetchError) {
      throw new Error(`Both Firecrawl and direct fetch failed: ${fetchError.message}`);
    }
  }
}

// OpenAI embedding with retry logic and rate limiting
async function getEmbedding(text, retries = 3) {
  // OpenAI text-embedding-3-small has a limit of ~8191 tokens
  // Truncate text if too long (roughly 4 chars per token)
  const maxLength = 30000; // Conservative estimate for ~7500 tokens
  const truncatedText = text.length > maxLength ? text.substring(0, maxLength) : text;
  
  for (let i = 0; i < retries; i++) {
    try {
      // Add delay to handle rate limits
      if (i > 0) {
        console.log(`⏳ Retrying embedding (attempt ${i + 1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * i)); // Exponential backoff
      }
      
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small', // More cost-effective than text-embedding-3-large
        input: truncatedText,
        encoding_format: 'float'
      });
      
      return response.data[0].embedding;
    } catch (error) {
      if (error.status === 429 || error.message.includes('rate limit')) {
        console.log(`❌ Rate limit exceeded, waiting longer...`);
        if (i === retries - 1) {
          throw new Error('OpenAI rate limit exceeded. Please try again later or upgrade your plan.');
        }
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      } else if (error.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.');
      } else {
        console.error(`Embedding error: ${error.message}`);
        throw error;
      }
    }
  }
}

// Store in DB with error handling
async function store(doc) {
  try {
    console.log(`🔄 Getting embedding for: ${doc.title}`);
    const embedding = await getEmbedding(doc.content);
    
    await collection.add({
      ids: [doc.id],
      embeddings: [embedding],
      metadatas: [{ 
        url: doc.url, 
        title: doc.title, 
        content: doc.content.substring(0, 500) 
      }],
      documents: [doc.content]
    });
    
    console.log(`💾 Stored: ${doc.title}`);
  } catch (error) {
    console.error(`❌ Failed to store ${doc.title}:`, error.message);
    throw error;
  }
}

// Retrieve/Search with error handling
async function retrieve(query, topK = 3) {
  try {
    console.log(`🔍 Searching for: "${query}"`);
    const queryEmbedding = await getEmbedding(query);
    
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK,
      include: ['metadatas', 'documents', 'distances']
    });
    
    if (!results.metadatas || !results.metadatas[0]) {
      console.log('No results found');
      return [];
    }
    
    return results.metadatas[0].map((metadata, i) => ({
      score: 1 - results.distances[0][i], // Convert distance to similarity
      title: metadata.title,
      url: metadata.url,
      content: metadata.content
    }));
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    return [];
  }
}

// Enhanced main function with better error handling
async function main() {
  try {
    console.log('🚀 Starting scraper with OpenAI embeddings...');
    
    // 1. Connect to DB
    await connectDB();
    
    // 2. Scrape and Store
    const urls = ['https://raw.githubusercontent.com/Sahiiil1406/dbify/refs/heads/main/README.md'];
    
    for (const url of urls) {
      try {
        console.log(`\n📄 Processing: ${url}`);
        const doc = await scrape(url);
        
        if (!doc.content || doc.content.trim().length === 0) {
          console.log(`⚠️ Skipping ${url}: No content found`);
          continue;
        }
        
        await store(doc);
        
        // Rate limiting between requests (OpenAI has generous limits but still good practice)
        console.log('⏳ Waiting to avoid rate limits...');
        await new Promise(r => setTimeout(r, 1000)); // 1 second delay (less than Gemini)
        
      } catch (err) {
        console.log(`❌ Failed: ${url}`, err.message);
        
        // If it's a rate limit error, wait longer before trying next URL
        if (err.message.includes('rate limit') || err.status === 429) {
          console.log('⏳ Waiting 30 seconds due to rate limits...');
          await new Promise(r => setTimeout(r, 30000));
        }
      }
    }
    
    // 3. Test Retrieval (only if we successfully stored something)
    try {
      console.log('\n🔍 Testing search functionality...');
      const results = await retrieve('dbify');
      
      if (results.length > 0) {
        console.log('\n✅ Search Results:');
        results.forEach((r, i) => {
          console.log(`${i+1}. ${r.title} (${r.score.toFixed(3)})`);
          console.log(`   ${r.url}`);
          console.log(`   ${r.content.substring(0, 100)}...`);
        });
      } else {
        console.log('No results found for "dbify"');
      }
    } catch (searchError) {
      console.log('❌ Search test failed:', searchError.message);
    }
    
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
    process.exit(1);
  }
}



module.exports = { main, scrape, store, retrieve, connectDB };