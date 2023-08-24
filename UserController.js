const User = require("../Model/user");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const jwt=require('jsonwebtoken')

// register user
const registerUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // checking for all required filed
    if (!userName || !password) {
      return res.status(400).json({ message: "All fields is required" });
    }
    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userDetails = {
      userName,
      password: hashedPassword,
    };

    const user = new User(userDetails);
    user
      .save()
      .then((res) =>
        res.json({
          sucess: true,

          message: "user register sucessfully",
        })
      )

      .catch((err) =>
        res.json({ sucess: false, message: "user register unsucessfully" })
      );
  } catch (err) {
    res.status(404).json({ meassage: "somethings wrong in server.." });
  }
};

// Athenticate User

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(404)
        .json({ status: false, message: "All fields is required" });
    }

    // find the user name
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "username does not exist please register first.",
      });
    }
    const validatepassword = await bcrypt.compare(password, user.password);
    if (!validatepassword) {
      return res
        .status(404)
        .json({ status: false, message: "incorrect username or password" });
    }

    // if authorization is required then here we generate the token for that user

    res.status(200).json({ status: true, message: "Login sucessful" });
  } catch (err) {
    res.status(404).json({ meassage: "somethings went wrong" });
  }
};

// update user
const updateUser = async (req, res) => {
  try {
    const _id = req.params.userid;

    if (!_id) {
      return res
        .status(400)
        .json({ status: false, message: "provide the id for update" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const updatedetails = {
      username: req.body.username,
      password: hashedPassword,
    };

    User.findByIdAndUpdate(_id, updatedetails, function (err, docs) {
      if (err) {
        console.log(err);
        return res.json({
          status: false,
          message: "user not deleted try again",
          error: err,
        });
      } else {
        return res.json({ status: true, message: "user updated sucessfully" });
      }
    });
  } catch (err) {
    res.status(404).json({ meassage: "somethings went wrong" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const _id = req.params.userid;
    if (!_id) {
      return res
        .status(400)
        .json({ status: false, message: "provide the id for delete" });
    }
    User.findOneAndDelete({ _id}, function (err, docs) {
      if (err) {
        console.log(err);
        return res.json({
          status: false,
          message: "user not deleted try again",
          error: err,
        });
      } else {
        return res.json({ status: true, message: "user deleted sucessfully" });
      }
    });
  } catch (err) {
    res.status(404).json({status:false, meassage: "somethings went wrong" });
  }
};


// forgot password
const forgetPassword = async (req, res) => {
    try{
        const {username}=req.body;
        if(!username){
            return res.status(400).json({status:false,message:"provide the username"})
        }
        const user=await User.findOne({username})
        if(!user){
            return res.status(400).json({status:false,message:"provide the valid username"})
        }

        const token=jwt.sign({id:user_id},process.env.SECRET_KEY,{expiresIn:"1d"})

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'reqireemal@gmail.com',
              pass: 'password'
            }
          });
          
          var mailOptions = {
            from: 'reqireemal@gmail.com',
            to: 'targetemail',
            subject: 'reset your password',
            text: `https://localhost:8000/${user._id}/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.json({status:true,message:"email sent"})
            }
          });

    }catch(err){
        res.status(404).json({status:false, meassage: "somethings went wrong" });
    }
};

module.exports = { registerUser, loginUser, updateUser, deleteUser ,forgetPassword};
