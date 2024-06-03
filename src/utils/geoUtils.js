const axios = require("axios");
const GOOGLE_API_KEY = "AIzaSyA7kE8k5LTUFmxVvPAxAcMm6UBv98rOoVg";

const dokdoBounds = {
  latMin: 37.237146,
  latMax: 37.255864,
  lngMin: 131.844482,
  lngMax: 131.8782,
};

class GeoUtils {
  static async getCountryName(lat, lng) {
    if (this.isDokdo(lat, lng)) return "대한민국";

    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          key: GOOGLE_API_KEY,
          region: "KR",
          latlng: `${lat},${lng}`,
          result_type: "country",
          language: "ko",
        },
      }
    );

    const results = res.data.results;
    if (results.length > 0) {
      const addressComponents = results[0].address_components;
      const countryComponent = addressComponents.find((component) =>
        component.types.includes("country")
      );

      if (countryComponent) {
        return countryComponent.long_name;
      }
    }

    return null;
  }

  static isDokdo(lat, lng) {
    return (
      lat >= dokdoBounds.latMin &&
      lat <= dokdoBounds.latMax &&
      lng >= dokdoBounds.lngMin &&
      lng <= dokdoBounds.lngMax
    );
  }
}

module.exports = GeoUtils;
