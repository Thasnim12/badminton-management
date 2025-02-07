const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const generateAdminToken = require('../authentication/generateAdminToken')


const adminLogin = async (req, res) => {
    try {
        const { name, passkey } = req.body;

        if (!name || !passkey) {
            return res.status(400).json({ message: "Missing required fields!" });
        }

        const admin = await Admin.findOne({ name });
        console.log(admin, 'admin')

        if (admin) {
            const validPasskey = await bcrypt.compare(passkey, admin.passkey);

            if (!validPasskey) {
                return res.status(400).json({ message: "Invalid passkey" });
            }

            admin.lastLogin = new Date();
            await admin.save();

            console.log(admin._id, 'id')

            const token = generateAdminToken(res, admin._id);

            return res.status(200).json({
                admin,
                message: 'Admin logged in successfully',
                token,
            });
        } else {
            if (name !== process.env.ADMIN_NAME || passkey !== process.env.ADMIN_PASSKEY) {
                return res.status(401).json({ message: 'Unauthorized, Invalid credentials' });
            }

            const hashedPasskey = await bcrypt.hash(passkey, 10);

            const newAdmin = new Admin({
                name: name,
                passkey: hashedPasskey,
                lastLogin: new Date(),
            });

            await newAdmin.save();

            const token = generateAdminToken(res, newAdmin._id);
            console.log(token, 'token')

            return res.status(200).json({
                admin: newAdmin,
                message: 'New admin created and logged in successfully',
                token,
            });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const adminLogout = async (req, res) => {

    try {
        res.cookie('adminjwt', '', {
            httpOnly: true,
            expires: new Date(0)
        })
        return res.status(200).json({ message: 'logout user' })
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
}

const getAllusers = async (req, res) => {
    try {

        const users = await User.find({})
        if (!users) {

            return res.status(400).json({ message: "users not found" })
        }
        return res.status(200).json({ users })
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
}

const manageUsers = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(req.params,'params')
        const id = new mongoose.Types.ObjectId(userId);
        const user = await User.findById({_id:id })

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { is_blocked: !user.is_blocked },
            { new: true }
        );

        return res.status(200).json({
            message: `User ${updatedUser.is_blocked ? 'blocked' : 'unblocked'} successfully`,
            user: updatedUser
        });

    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
}




module.exports = {
    adminLogin,
    adminLogout,
    getAllusers,
    manageUsers
}