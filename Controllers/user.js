const UserModel = require('../Models/user');

exports.register = async(req,res)=>{
    try {
        const {name,email,photo} = req.body;
        const userExist = await UserModel.findOne({email:email});
        if(!userExist){
            let newUser = new UserModel({name,email,photo});
            await newUser.save();
            return res.status(200).json({
                message:"user generated successfully",
                user: newUser
            })
        }
        return res.status(200).json({
            message: "welcome back",
            user:userExist
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server Error', message: err.message})
    }
}