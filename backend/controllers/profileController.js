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

module.exports = { updateProfile ,getTutorById};
