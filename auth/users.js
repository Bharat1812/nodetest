const User = require("../models/user")
const jwt = require('jsonwebtoken')
const axios = require('axios')

//user sign in
exports.register = async (req, res, next) => {
    const { username, password, email, contact } = req.body

    //validate password length
    if (password && password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" })
    }

    //check if user already exists & validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
    }

    //create user in db
    await User.create({
        username,
        password,
        email: email.toLowerCase(), //sanitize email
        contact
    }).then((user) => {
        //creating token
        const token = jwt.sign(
            { id: user._id, username, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );
        //return new user with token 
        res.status(201).json({
            message: "User successfully created",
            user: { user, token },
        });
    }).catch((error) =>
        res.status(400).json({
            message: "User creation failed",
            error: error.message,
        })
    );
}


//user login 
exports.login = async (req, res, next) => {
    const { email, password } = req.body

    //check if username or password is empty
    if (!(email && password)) {
        return res.status(400).json({
            message: "Username and Password required",
        })
    }
    try {
        //check user is exist in our db
        const user = await User.findOne({ email })

        //if user not exists
        if (!user) {
            return res.status(400).json({
                message: "Login failed",
                error: "User not found",
            })
        }

        //checking password
        if(password != user.password){
            return res.status(400).json({
                message: "Login failed",
                error: "Incorrect password",
            })
        }
        
        //create token 
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );
        res.status(201).json({
            message: "User successfully Logged in",
            user: { user, token },
        });

    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        })
    }
}

// get user profile
exports.viewProfile = async (req, res) => {
    //after token validation fetching user_id from token
    const userId = req.user.id

    //finding user in db to get logged in user info
    const user = await User.findOne({ _id: userId })

    //if user is not exist in db
    if (!user) {
        return res.status(400).json({
            message: "User not found",
            error: "User not found",
        })
    }

    //return user details when found
    res.status(201).json({
        message: "User Found",
        user: user
    });
}

//get random joke from api
exports.getRandomJoke = async (req, res) => {
    //getting url response through axios
    let result = await axios.get('https://api.chucknorris.io/jokes/random')

    //checking data exits or not
    if (!result.data) {
        res.status(400).json({
            message: "Joke not found",
            error: "Joke not found",
        })
    }

    //returning joke value only
    res.status(201).json({
        message: "Joke Found",
        joke: result.data.value
    });
}

//user logout
exports.logout = async (req, res) => {
    req.headers["x-access-token"] = ' '
    // req.session.destroy(); // way to logout user 
    // we simply cannot destroy a jwt token after creating it 
    // either we can remove it from session header or localstorage
    // and redirect to public page i.e. home
    res.status(201).json({
        message: "User Logged out"
    });
}