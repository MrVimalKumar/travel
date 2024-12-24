const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")

const User = require("../models/User")

/*Configuration multer for file upload */
const storage = multer.diskStorage({
    destination: function(req, file, cb){
     cb(null, "public/uploads/") //store uploaded files in the 'uploads' folder
    },
    filename: function (req, file,cb){
        cb(null, file.originalname) // Use the original Name
    }
})

const upload = multer({ storage})
/*USER REGISTER */
router.post("/register", upload.single('profileImage'), async(req,res) =>{
    try{
        /*Take all information from the form */
        const{firstName, lastName, email, password} = req.body
        /*The uploaded file is available as req.file */
        const profileImage = req.file
        if(!profileImage){
            return res.status(400).send("No file uploaded")
        }
        /*path to the uploaded profile photo */
        const profileImagePath = profileImage.path
        /*Check if user exists */
        const exsitingUser = await User.findOne({ email })
        if(exsitingUser){
            return res.status(409).json({message:"User already exists!"})
        }
        /*Has the password */
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        /* Create a new user */
        const newUser = new User({
            firstName,
            lastName,
            email,
            password : hashedPassword,
            profileImagePath,
        });
        /* Save the new user */
        await newUser.save()

        /*Send a successfull message */
        res.status(200).json({message:"User registered successfully!", user:newUser})
    }catch (err) {
        console.log(err)
        res.status(500).json({ message: "Registration failed!", error: err.message})
    }
})

/*USER LOGIN */
router.post("/login", async (req,res) => {
    try{
        /* Take the information from the form */
        const{email, password} = req.body
               /*Check if user exists */
               const user = await User.findOne({ email })
               if(!user){
                   return res.status(409).json({message:"User Doesn't exists!"})
               }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!"})
    }

    /* Generate JWT token */
    const token = jwt.sign({id: user._id }, process.env.JWT_SECERT)
    delete user.password

    res.status(200).json({ token, user })

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router;