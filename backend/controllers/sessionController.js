const Session = require("../models/sessionModel");

const createSession = async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating session" });
  }
};

const getSessions=async(req,res)=>{
  try {
   const session=await Session.find();
  //  console.log(session);
   res.json(session);
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"Error getting session"});
  }
}

module.exports = { createSession,getSessions};

