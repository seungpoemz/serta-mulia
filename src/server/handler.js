const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
// Ensure you import or define storeData function
const storeData = require('../services/storeData'); // Example, adjust the import path if necessary

async function postPredictHandler(request, h) {
  const { image } = request.payload; // Get the image from the request payload
  const { model } = request.server.app; // Get the model from the server app context

  // Perform prediction using the model
  const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);

  // Generate a unique ID and capture the creation timestamp
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // Prepare the response data
  const data = {
    id,
    result: label,
    explanation,
    suggestion,
    confidenceScore,
    createdAt
  };

  // Store the data, make sure storeData function is properly imported/defined
  await storeData(id, data);

  // Prepare the HTTP response
  const response = h.response({
    status: 'success',
    message: confidenceScore > 99 
      ? 'Model is predicted successfully.' 
      : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data
  });

  // Set the HTTP status code to 201 (Created)
  response.code(201);

  // Return the response
  return response;
}

module.exports = postPredictHandler;
