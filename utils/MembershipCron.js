const cron = require("node-cron");
const User = require("../models/User"); // Adjust path as per your project structure

// Function to reset expired memberships
const resetExpiredMemberships = async () => {
  try {
    const now = new Date();

    // Find users with expired memberships
    const users = await User.find({ membershipEnd: { $lte: now }, membershipExpiry: false });

    for (const user of users) {
      console.log(`Resetting membership for user: ${user.email}`);
      user.membership = "Free"; // Reset to default "Free" membership
      user.membershipStart = Date.now();
      user.membershipEnd = new Date(now.setDate(now.getDate() + 30));
      user.membershipExpiry = true;
      user.isFeatureListing = false;
      user.verified = false;
      user.listingsCount = 0;

      await user.save();
    }

    console.log(`${users.length} memberships have been reset.`);
  } catch (error) {
    console.error("Error resetting memberships:", error);
  }
};

const resetUserMembership = async (user) => {
  const now = new Date();
  user.membership = "Free";
  user.membershipStart = Date.now();
  user.membershipEnd = new Date(now.setDate(now.getDate() + 30));
  user.listingsCount = 0;
  await user.save();
};
const resetFreeMemberships = async () => {
  const users = await User.find({ membership: "Free" });

  for (const user of users) {
    console.log(`Resetting membership for user: ${user.email}`);
    let getTodayMonth = new Date().getMonth()+1;  
    let userCreatedDateDay = new Date(user.createdAt).getDate();  
    const todayDate = new Date().getDate(); 

    if(getTodayMonth === 2 && userCreatedDateDay >28) userCreatedDateDay = 28;
    if ((userCreatedDateDay === todayDate && userCreatedDateDay !== 31) || (userCreatedDateDay === 31 && --userCreatedDateDay === todayDate)) {
      resetUserMembership(user);
    } 
  }
};
// Schedule the job to run every day at midnight
const scheduleMembershipReset = () => {
  cron.schedule("0 0 * * *", resetExpiredMemberships); // Runs daily at midnight
  cron.schedule('2 0 * * *', resetFreeMemberships);
  console.log("Cron job for resetting expired memberships scheduled.");
};

module.exports = { scheduleMembershipReset };
