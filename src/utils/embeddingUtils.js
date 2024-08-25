const pgvector = require("pgvector/pg");
const axios = require("axios");
const sequelize = require("../config/database");
const { redisClient } = require("../config/redis.js");
require("dotenv").config();

const { QueryTypes } = require("sequelize");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_EMBEDDING_API_URL = "https://api.openai.com/v1/embeddings";
const EMBEDDING_MODEL = "text-embedding-3-large";
const CACHE_EXPIRATION = 90 * 24 * 60 * 60;

async function fetchEmbedding(text) {
  const cacheKey = `embedding:${text}`;

  const cachedEmbedding = await redisClient.get(cacheKey);

  if (cachedEmbedding) {
    process.stdout.write("[ Cache Hit : text-embedding ]");
    return JSON.parse(cachedEmbedding);
  } else {
    process.stdout.write("[ Cache Miss: text-embedding ]");
  }

  try {
    const response = await axios.post(
      OPENAI_EMBEDDING_API_URL,
      {
        input: text,
        model: EMBEDDING_MODEL,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const embeddingValue = response.data.data[0].embedding;

    await redisClient.set(cacheKey, JSON.stringify(embeddingValue), {
      EX: CACHE_EXPIRATION,
    });

    return embeddingValue;
  } catch (error) {
    console.error("Error fetching embedding from OpenAI:", error);
    throw new Error("Failed to fetch embedding from OpenAI");
  }
}

async function calculateAndSaveEmbedding(place, categories) {
  try {
    const categoryNames = (categories || [])
      .map((category) => category.name)
      .join(" | ");

    let text = `${place.name} | ${place.description} | ${place.country}`;
    if (categoryNames) {
      text += ` | ${categoryNames}`;
    }
    text = text.replace(/[\r\n]+/g, " ").trim();

    const embedding = await fetchEmbedding(text);

    const queryText = "UPDATE places SET embedding = $2 WHERE place_id = $1;";
    await sequelize.query(queryText, {
      type: QueryTypes.UPDATE,
      bind: [place.placeId, pgvector.toSql(embedding)],
    });
  } catch (error) {
    console.error("Error calculating or saving embedding:", error);
  }
}

function calculateSimilarityThreshold(query) {
  // TODO: query값에 따른 기준치 필요
  return 0.3;
}

async function findSimilarPlaces(query) {
  try {
    const embedding = await fetchEmbedding(query);
    const similarityThreshold = calculateSimilarityThreshold(query);

    const queryText = `
      SELECT place_id, name, description, country, 1 - (embedding <=> $1) as similarity 
      FROM places 
      WHERE 1 - (embedding <=> $1) > $2
      ORDER BY similarity DESC 
      LIMIT 5;
    `;

    const result = await sequelize.query(queryText, {
      type: QueryTypes.SELECT,
      bind: [pgvector.toSql(embedding), similarityThreshold],
    });

    const formattedResult = result.map((row) => ({
      placeId: row.place_id,
      ...row,
    }));

    return formattedResult;
  } catch (error) {
    console.error("Error finding similar places:", error);
    throw new Error("Failed to find similar places");
  }
}

module.exports = { calculateAndSaveEmbedding, findSimilarPlaces };
