// ragAgent.js
// const fs = require('fs');
// const pdfParse = require('pdf-parse');
// const crypto = require('crypto');
// const { OpenAI } = require('openai');
// const { Pinecone } = require('@pinecone-database/pinecone');
// require('dotenv').config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const pinecone = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY,
// });

// const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

// function RAG_Agent() {}

// async function init() {
//   await loadData();
// }

// async function loadData() {
//   const pdfBuffer = fs.readFileSync('./mockData/Influencers.pdf');
//   const data = await pdfParse(pdfBuffer);
//   const chunks = chunkText(data.text, 500);

//   const vectors = await Promise.all(
//     chunks.map(async (chunk) => {
//       const embedding = await getEmbedding(chunk);
//       const id = crypto.createHash('sha256').update(chunk).digest('hex');
//       return {
//         id,
//         values: embedding,
//         metadata: { text: chunk },
//       };
//     })
//   );

//   await index.upsert(vectors);
//   console.log('Data loaded to Pinecone.');
// }

// async function getEmbedding(text) {
//   const res = await openai.embeddings.create({
//     model: 'text-embedding-3-small',
//     input: text,
//   });
//   return res.data[0].embedding;
// }

// function chunkText(text, maxLength = 500) {
//   const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
//   const chunks = [];
//   let current = '';

//   for (const sentence of sentences) {
//     if ((current + sentence).length > maxLength) {
//       chunks.push(current.trim());
//       current = sentence;
//     } else {
//       current += ' ' + sentence;
//     }
//   }
//   if (current.trim()) chunks.push(current.trim());
//   return chunks;
// }

// RAG_Agent.prototype.processQuery = async function (query) {
//   const queryEmbedding = await getEmbedding(query);
//   const result = await index.query({
//     topK: 5,
//     vector: queryEmbedding,
//     includeMetadata: true,
//   });

//   return result.matches.map((match) => match.metadata.text);
// }

// module.exports = {
//   getInst: () => new RAG_Agent(),
//   init,
// };