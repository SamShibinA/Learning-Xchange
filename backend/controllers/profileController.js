const User = require('../models/userModel');

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;

    // Only allow specific fields to be updated
    const allowedFields = ['name', 'bio', 'skills', 'interests', 'hourlyRate', 'profileComplete'];
    const updates = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', data: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const getTutorById=async(req,res)=>{
  try{

   const tutorId=req.params.tutorId;
  //  console.log(tutorId)
   const tutor=await User.findById(tutorId).select('-password');
   if(!tutor){
    return res.status(404).json({message:"Tutor not found"});
   }
   if(tutor.role!=='tutor'){
    return res.status(403).json({message:"You are not a tutor"});
   }
  //  console.log("tutor-for -frontend",tutor);
   res.status(200).json(tutor);
  }catch(err){
    console.log(err);
  }
}


const rateTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 0.5) {
      return res.status(400).json({ message: "Rating must be at least 0.5" });
    }

    const tutor = await User.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: "Tutor not found" });
    if (tutor.role !== "tutor") {
      return res.status(403).json({ message: "User is not a tutor" });
    }

    // Calculate new average rating
    const newTotalRatings = (tutor.totalRatings || 0) + 1;
    const newAverageRating =
      ((tutor.rating || 0) * (tutor.totalRatings || 0) + rating) /
      newTotalRatings;

    tutor.rating = newAverageRating;
    tutor.totalRatings = newTotalRatings;

    // If tutor reaches 4+ stars, unlock charging
    if (tutor.rating >= 4 && !tutor.canCharge) {
      tutor.canCharge = true;
    }

    await tutor.save();

    res.json({
      message: "Rating submitted successfully",
      data: tutor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProfile ,getTutorById,rateTutor};