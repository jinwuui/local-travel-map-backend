const { Op } = require("sequelize");
const { disassembleHangul } = require("@toss/hangul");

const Utils = require("../utils/utils");
const Place = require("../models/Place");
const { findSimilarPlaces } = require("../utils/embeddingUtils");

async function autocompleteByPattern({ hangul, chosung, alphabet }) {
  try {
    const conditions = [];

    if (hangul) {
      conditions.push({
        hanguls: {
          [Op.like]: `%${hangul}%`,
        },
      });
    }

    if (chosung) {
      conditions.push({
        chosungs: {
          [Op.like]: `%${chosung}%`,
        },
      });
    }

    if (alphabet) {
      conditions.push({
        alphabets: {
          [Op.like]: `%${alphabet}%`,
        },
      });
    }

    if (conditions.length === 0) {
      return [];
    }

    return await Place.findAll({
      attributes: ["placeId", "name", "description", "country"],
      where: {
        [Op.or]: conditions,
      },
      limit: 7,
    });
  } catch (error) {
    console.error("pattern autocomplete error:", error);
    return [];
  }
}

async function autocompleteByEmbedding(query) {
  try {
    const similarPlaceIds = await findSimilarPlaces(query);

    const places = await Place.findAll({
      attributes: ["placeId", "name", "description", "country"],
      where: {
        placeId: {
          [Op.in]: similarPlaceIds,
        },
      },
    });

    const placeMap = new Map();
    places.forEach((place) => {
      placeMap.set(place.placeId, place);
    });

    const sortedPlaces = similarPlaceIds.map((placeId) =>
      placeMap.get(placeId)
    );
    return sortedPlaces;
  } catch (error) {
    console.error("embedding autocomplete error:", error);
    return [];
  }
}

const mergeResults = (primary, secondary) => {
  const seen = new Set();
  const result = [];

  // primary 배열을 먼저 처리
  primary.forEach((item) => {
    if (!seen.has(item.placeId)) {
      seen.add(item.placeId);
      result.push(item);
    }
  });

  // secondary 배열을 처리
  secondary.forEach((item) => {
    if (!seen.has(item.placeId)) {
      seen.add(item.placeId);
      result.push(item);
    }
  });

  return result;
};

module.exports = {
  async getAutocompleteSuggestions(query) {
    // 0-1. 쿼리에서 공백제거 (프론트에서 하자)
    const queryWithoutSpace = Utils.removeAllSpace(query);
    const disassembledQuery = disassembleHangul(queryWithoutSpace);

    // 0-2. 쿼리 분류
    const hangulQuery = Utils.convertToHangul(disassembledQuery);
    const chosungQuery = Utils.convertToChosung(disassembledQuery);
    const alphabetQuery = Utils.convertToAlphabet(disassembledQuery);

    console.log("hangulQuery: ", hangulQuery);
    console.log("chosungQuery: ", chosungQuery);
    console.log("alphabetQuery: ", alphabetQuery);

    const queryParams = { alphabet: alphabetQuery };

    const isChosungSearch = hangulQuery.length === chosungQuery.length;

    if (isChosungSearch) {
      queryParams["chosung"] = chosungQuery;
    } else {
      queryParams["hangul"] = hangulQuery;
    }

    const [resultByPattern, resultByEmbedding] = await Promise.all([
      autocompleteByPattern(queryParams),
      autocompleteByEmbedding(query),
    ]);

    const finalResults = isChosungSearch
      ? mergeResults(resultByPattern, resultByEmbedding)
      : mergeResults(resultByEmbedding, resultByPattern);

    return finalResults;
    // 1. 한글 검색
    // 1-1. 음절 (hanguls 필드, 공백 제거해서 넣어두기)
    // 1-2. 초성 검색 (chosungs 필드, 공백 제거해서 넣어두기)
    // 1-2. 초성만으로 작성해야 초성 검색 실행
    // "abc mart 근처에서 "
    // 2. 영어 검색
    // 2-1. 영어 그 자체로 검색 (name + description로 하면 띄어쓰기는 관리하기 빡셈)
    // 2-1. name + description으로 공백 제거하고 alphabets 필드 만들기

    // 2. 영어만 -> 영어를 한글로 바꿔서 검색 (1번으로) -> 영어 그 자체로 검색 (name + description 필드)

    // 자동 완성 결과에서 중복제거 필요 (같은 장소면 제목 -> 내용 우선순위로)

    // 카테고리도 자동 완성 결과에서 보여주고 싶은데... 나중에하자...

    // 3. 한글과 영어가 섞여서 -> 영어 부분을 한글로 바꿔서 검색 1번 검색 -> 한글 부분을 영어로 바꿔서 2번 검색

    // 4. 반환값 [{placeId: ###, content: @@@, type: '이름'OR'내용'}, ...]
  },
};
