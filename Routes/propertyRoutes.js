const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

// Route to create a new property
router.post('/createProperty', propertyController.createProperty);

// Route to get all properties
router.get('/allProperty', propertyController.getAllProperties);

// Route to get a property by ID
router.get('/Property/:id', propertyController.getPropertyById);

// Route to update a property by ID
router.put('/Property/:id', propertyController.updateProperty);

// Route to delete a property by ID
router.delete('/Property/:id', propertyController.deleteProperty);

// Route to get properties by location
router.get('/properties/location/:location', propertyController.getPropertiesByLocation);

// Route to get properties by category
router.get('/properties/category/:category', propertyController.getPropertiesByCategory);

router.patch('/properties/:id/approve', propertyController.approveProperty);


module.exports = router;
