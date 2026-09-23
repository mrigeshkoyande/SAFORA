const { getNearbyPlaces } = require('../services/map.service');
const { sendSuccess, sendError } = require('../utils/response');

// Helper to fetch places based on type
const fetchPlaces = async (req, res, type) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return sendError(res, 'Latitude and longitude are required', 400);

    const places = await getNearbyPlaces(parseFloat(lat), parseFloat(lng), type);
    return sendSuccess(res, `Nearby ${type} retrieved`, { places });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @route   GET /api/map/police
// @desc    Get nearby police stations
// @access  Private
const getPolice = async (req, res, next) => {
  return fetchPlaces(req, res, 'police');
};

// @route   GET /api/map/hospitals
// @desc    Get nearby hospitals
// @access  Private
const getHospitals = async (req, res, next) => {
  return fetchPlaces(req, res, 'hospital');
};

// @route   GET /api/map/safe-places
// @desc    Get nearby safe places (malls, metro stations, etc)
// @access  Private
const getSafePlaces = async (req, res, next) => {
  // Combining some typical well-lit/crowded safe public places
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return sendError(res, 'Latitude and longitude are required', 400);

    // Fetching shopping_mall as a proxy for safe place, can be extended
    const places = await getNearbyPlaces(parseFloat(lat), parseFloat(lng), 'shopping_mall');
    return sendSuccess(res, 'Nearby safe places retrieved', { places });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPolice,
  getHospitals,
  getSafePlaces,
};
