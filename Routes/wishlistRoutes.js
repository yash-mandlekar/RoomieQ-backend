// routes/wishlistRoutes.js

const express = require('express');
const { addRemoveToWishlist,getWishlist} = require('../controllers/wishlistController');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');

// // Add to wishlist route
// router.post('/addWishlist', addToWishlist);

// // Remove from wishlist route
// router.post('/removeWishlist', removeFromWishlist);


// // Get wishlist for a user route
// // Get wishlist for a user and property route
// router.post('/user/property/wishlist', getWishlist);

// router.get('/properties', getUserWishlistProperties); // This is the route we need
router.post('/wishlist/toggle',isAuthenticated, addRemoveToWishlist);
router.get('/wishlist',isAuthenticated, getWishlist);



module.exports = router;
