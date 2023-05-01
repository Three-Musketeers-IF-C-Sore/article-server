const model = require("../models/index");
const User = model.users;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, password) => {
            if(err) {
                return res.status(400).json({
                    message: "Gagal melakukan registrasi",
                });
            }
            if(password) {
                await User.create({ name, email, password });
                return res.status(200).json({
                    message: "Berhasil melakukan registrasi",
                })
            }
        })
    } catch(err) {
        return res.status(500).end();
    }
};

const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });
        if(!user) {
            return res.status(403).json({
                message: "invalid credentials",
                error: "invalid login"
            })
        }

        const status = await bcrypt.compare(password, user.password);
        if(!status) {
            return res.status(403).json({
                message: "invalid credentials",
                error: "invalid login"
            })
        }

        const token = jwt.sign(user.toJSON(), process.env.JWT_KEY, { expiresIn: "24h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "None",
        });

        return res.json({
            token: token,
        });

    } catch(err) {
        return res.status(500).end();
    }
}

module.exports = { register, login };