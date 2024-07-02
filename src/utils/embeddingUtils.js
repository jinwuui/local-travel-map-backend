const pg = require("pg");
const pgvector = require("pgvector/pg");
const axios = require("axios");
const pgClient = require("../config/postgresql.js");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function calculateAndSaveEmbedding(place, categories) {
  const client = await pgClient.connect();

  try {
    const categoryNames = (categories || [])
      .map((category) => category.name)
      .join(" | ");
    const text = `${place.name} | ${place.description} | ${place.country} | ${categoryNames}`;
    console.log("embedding text", text);

    const res = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: text,
        model: "text-embedding-3-small",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + OPENAI_API_KEY,
        },
      }
    );

    const embedding = res.data.data[0].embedding;

    const queryText =
      "INSERT INTO placeembedd (placeId, embedding) VALUES($1, $2)";
    const values = [place.placeId, pgvector.toSql(embedding)];

    await client.query(queryText, values);
  } catch (error) {
    console.error("Error calculating or saving embedding:", error);
  } finally {
    client.release();
  }
}

function calculateSimilarityThreshold(query) {
  // TODO: query값에 따른 기준치 필요
  return 0.3;
}

async function findSimilarPlaces(query) {
  const client = await pgClient.connect();

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: query,
        model: "text-embedding-3-small",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + OPENAI_API_KEY,
        },
      }
    );

    const embedding = res.data.data[0].embedding;
    const similarityThreshold = calculateSimilarityThreshold(query);

    const queryText = `
    SELECT placeid, 1 - (embedding <=> $1) as similarity 
    FROM placeembedd 
    WHERE 1 - (embedding <=> $1) > $2
    ORDER BY similarity DESC 
    LIMIT 5
  `;

    const values = [pgvector.toSql(embedding), similarityThreshold];
    const result = await client.query(queryText, values);
    console.log("score", result.rows);

    return result.rows.map((row) => row.placeid);
  } catch (error) {
    console.error("Error calculating or saving embedding:", error);
  } finally {
    client.release();
  }
}

module.exports = { calculateAndSaveEmbedding, findSimilarPlaces };
