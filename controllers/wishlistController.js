// models/WishList.js

// controllers/wishlistController.js
const Wishlist = require("../models/Wishlist");
const Property = require("../models/Property"); // Adjust the path according to your project structure
const Bhojnalaya = require("../models/Bhojnalaya"); // Adjust the path according to your project structure
const RoomForm = require("../models/RoomForm"); // Adjust the path according to your project structure
const Roommate = require("../models/RoommateForm"); // Adjust the path according to your project structure
const Office = require("../models/OfficeListingForm"); // Adjust the path according to your project structure
const Hostel = require("../models/HostelDetailsForm")

// Add to wishlist logic
// const addToWishlist = async (req, res) => {
//     const { UserUid, PropertyUid } = req.body;

//     try {
//         // Find the wishlist item by PropertyUid
//         const existingWishList = await WishList.findOne({ PropertyUid });

//         if (existingWishList) {
//             // Check if UserUid is already in the array
//             if (existingWishList.UserUid.includes(UserUid)) {
//                 return res.status(400).json({ message: 'Property already in wishlist for this user.' });
//             }

//             // Add UserUid to the existing UserUid array
//             existingWishList.UserUid.push(UserUid);
//             await existingWishList.save(); // Save the updated wishlist

//             return res.status(200).json({
//                 message: 'User added to existing property in wishlist successfully',
//                 wishList: existingWishList
//             });
//         }

//         // If the property does not exist, create a new wishlist entry
//         const newWishList = new WishList({
//             UserUid: [UserUid], // Store UserUid as an array
//             PropertyUid
//         });

//         await newWishList.save();

//         res.status(201).json({
//             message: 'Property added to wishlist successfully',
//             wishList: newWishList
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

// // Remove from wishlist logic
// const removeFromWishlist = async (req, res) => {
//     const { UserUid, PropertyUid } = req.body;

//     try {
//         // Find the wishlist item by PropertyUid
//         const wishListItem = await WishList.findOne({ PropertyUid });

//         if (!wishListItem) {
//             return res.status(404).json({ message: 'Property not found in wishlist' });
//         }

//         // Check if UserUid is part of the UserUid array
//         if (!wishListItem.UserUid.includes(UserUid)) {
//             return res.status(400).json({ message: 'UserUid not found in the wishlist' });
//         }

//         // Remove the user from the UserUid array
//         wishListItem.UserUid = wishListItem.UserUid.filter(uid => uid !== UserUid);

//         // If UserUid array becomes empty, delete the entire wishlist item
//         if (wishListItem.UserUid.length === 0) {
//             await WishList.deleteOne({ PropertyUid });
//         } else {
//             await wishListItem.save(); // Save the updated wishlist item
//         }

//         res.status(200).json({ message: 'Property removed from wishlist successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

// // Get wishlist for a user logic
// const getWishlist = async (req, res) => {
//     const { userUid, propertyUid } = req.body; // Get userUid and propertyUid from the request body

//     try {
//         // Find the wishlist item by PropertyUid
//         const wishListItem = await WishList.findOne({ PropertyUid: propertyUid });

//         // Check if the wishlist item exists
//         if (!wishListItem) {
//             return res.status(404).json({ message: 'Property not found in wishlist.' });
//         }

//         // Check if the userUid is in the UserUid array of that wishlist item
//         if (!wishListItem.UserUid.includes(userUid)) {
//             return res.status(404).json({ message: 'User is not in the wishlist for this property.' });
//         }

//         // Find the property in the properties collection using propertyUid
//         const property = await Property.findOne({ PropertyUid: propertyUid }); // Adjust according to your property ID field

//         // Check if the property exists
//         if (!property) {
//             return res.status(404).json({ message: 'Property not found.' });
//         }

//         res.status(200).json({
//             message: 'User found in wishlist for this property.',
//             wishlist: wishListItem,
//             property // Return the full property object
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

// const getUserWishlistProperties = async (req, res) => {
//     const { userId } = req.query; // Get userId from the query parameters

//     try {
//         // Find all wishlist items that include the userId
//         const wishListItems = await WishList.find({ UserUid: userId }); // Adjust according to your UserUid field

//         // Check if the wishlist items exist
//         if (!wishListItems.length) {
//             return res.status(404).json({ message: 'No properties found in wishlist for this user.' });
//         }

//         // Extract the property UIDs from the wishlist items
//         const propertyUids = wishListItems.map(item => item.PropertyUid);

//         // Find the properties corresponding to the property UIDs
//         const properties = await Property.find({ PropertyUid: { $in: propertyUids } }); // Adjust according to your property ID field

//         // Check if any properties were found
//         if (!properties.length) {
//             return res.status(404).json({ message: 'No properties found.' });
//         }

//         res.status(200).json({
//             message: 'Properties found for the user in their wishlist.',
//             properties // Return the array of property objects
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// };
const addRemoveToWishlist = async (req, res) => {
  const { itemId, itemType } = req.body;

  if (!itemId || !itemType) {
    return res.status(400).json({ message: "Item ID and type are required." });
  }

  try {
    const itemTypes = {
      "Bhojnalaya": Bhojnalaya,
      "RoomForm": RoomForm,
      "Roommate": Roommate,
      "Office":Office,
      "Hostel":Hostel,
    };
    // Ensure the item exists
    let item;
    if (itemTypes[itemType]) {
      item = await itemTypes[itemType].findById(itemId);
    }

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    // Check if the wishlist already exists for the user
    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, items: [] });
    }

    // Check if the item is already in the wishlist
    const existingItemIndex = wishlist.items.findIndex(
      (i) => i.itemId.toString() === itemId && i.itemType === itemType
    );

    if (existingItemIndex !== -1) {
      // Remove the item if it already exists
      wishlist.items.splice(existingItemIndex, 1);
      await wishlist.save();
      return res
        .status(200)
        .json({ message: "Item removed from wishlist.", wishlist });
    } else {
      // Add the item if it doesn't exist
      wishlist.items.push({ itemId, itemType });
      await wishlist.save();
      return res
        .status(200)
        .json({ message: "Item added to wishlist.", wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: "Error toggling wishlist item.", error });
  }
};
const getWishlist = async (req, res) => {
    try {
      // Find the wishlist for the logged-in user
      const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
        "items.itemId"
      );
  
      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found." });
      }
  
      // Extract item IDs from the wishlist
      const itemIds = wishlist.items.map((item) => item.itemId._id);
  
      // Populate additional details based on itemType
      const populatedItems = await Promise.all(
        wishlist.items.map(async (item) => {
          let populatedItem;
  
          // Fetch additional details based on itemType
          switch (item.itemType) {
            case "Bhojnalaya":
              populatedItem = await Bhojnalaya.findById(item.itemId).populate("uid");
              break;
            case "RoomForm":
              populatedItem = await RoomForm.findById(item.itemId).populate("uid");
              break;
            case "Roommate":
              populatedItem = await Roommate.findById(item.itemId).populate("uid");
              break;
            case "Office":
              populatedItem = await Office.findById(item.itemId).populate("uid");
              break;
            case "Hostel":
              populatedItem = await Hostel.findById(item.itemId).populate("uid");
              break;
            default:
              populatedItem = null; // Handle unexpected itemType
              break;
          }
  
          // Return the item with its populated details
          return { ...item.toObject(), details: populatedItem };
        })
      );
  
      // Send the response
      res.status(200).json({ itemIds, populatedItems });
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Error fetching wishlist.", error });
    }
  };
  

// Export the functions
module.exports = {
  // addToWishlist,
  // removeFromWishlist,
  // getWishlist,
  // getUserWishlistProperties
  addRemoveToWishlist,
  getWishlist,
};
