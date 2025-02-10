const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const Court = require('../models/courtModel')
const Slot = require('../models/slotModel')
const courtConfig = require('../models/courtConfig')
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
        console.log(req.params, 'params')
        const id = new mongoose.Types.ObjectId(userId);
        const user = await User.findById({ _id: id })

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

const addCourt = async (req, res) => {
    try {

        const { court_name, court_image } = req.body
        console.log(req.body, 'body')
        console.log("Headers:", req.headers);

        if (!court_name) {
            return res.status(400).json({ message: "missing required field!" })
        }

        const court = await Court.findOne({ court_name: court_name })

        if (court) {
            return res.status(400).json({ message: "court with same name exists" })
        }

        const newCourt = new Court({
            court_name: court_name,
            court_image: court_image
        })

        await newCourt.save();

        const newCourtConfig = new courtConfig({
            court: newCourt._id, 
            defaultStartHour: 6,  
            defaultEndHour: 22,   
            closedDays: [0]       
        });
        console.log(newCourtConfig,'config')

        await newCourtConfig.save();

        return res.status(200).json({ message: "Court added successfully. Admin must set the price." });

    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message });

    }
}

const getAllcourts = async (req, res) => {
    try {
        const allCourts = await Court.find({})
        if (!allCourts) {
            return res.status(400).json({ message: "no courts found!" })
        }

        return res.status(200).json({ courts: allCourts })
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
}
const generateSlots = async (req, res) => {
    try {
        const { courtId, daysToGenerate = 30 } = req.body;
        console.log(req.body,'req')

        const courtConfigData = await courtConfig.findOne({ court: courtId });

        if (!courtConfigData) {
            return res.status(404).json({ message: 'Court configuration not found' });
        }

        const slots = [];
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < daysToGenerate; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);

            if (courtConfigData.closedDays.includes(currentDate.getDay())) {
                continue;
            }

            for (let hour = courtConfigData.defaultStartHour; hour < courtConfigData.defaultEndHour; hour++) {
                const startTime = `${hour.toString().padStart(2, '0')}:00`;
                const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

                const existingSlot = await Slot.findOne({
                    court: courtId,
                    date: currentDate,
                    startTime,
                    endTime
                });

                if (!existingSlot) {
                    slots.push({
                        court: courtId,
                        date: currentDate,
                        startTime,
                        endTime,
                        price: courtConfigData.defaultPrice
                    });
                }
            }
        }

        if (slots.length > 0) {
            await Slot.insertMany(slots);
        }

        return res.status(200).json({
            message: `Slots generated successfully for next ${daysToGenerate} days`,
            slotsCreated: slots.length
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
};


const getAllSlots = async (req, res) => {
    try {
        const { courtId } = req.query;

        let filter = {};
        if (courtId) {
            filter.court = courtId;
        }

        const slots = await Slot.find(filter).sort({ date: 1, startTime: 1 });

        if (slots.length === 0) {
            return res.status(404).json({ message: "No slots available" });
        }

        return res.status(200).json(slots);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const updateSlots = async (req, res) => {
    try {
        const { slotId } = req.params;
        const { startTime, endTime, price } = req.body;

        // Find the current slot
        const slot = await Slot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        // Save old endTime before updating
        const previousEndTime = slot.endTime;

        // Update current slot
        slot.startTime = startTime;
        slot.endTime = endTime;
        slot.price = price;
        await slot.save();

        // Find and update the next slot if it exists
        const nextSlot = await Slot.findOne({
            courtId: slot.courtId,
            date: slot.date,
            startTime: previousEndTime, // Use the old endTime before update
        });

        if (nextSlot) {
            const newNextEndTime = addOneHour(endTime); // Use the updated endTime

            nextSlot.startTime = endTime;
            nextSlot.endTime = newNextEndTime;
            await nextSlot.save();
        }

        res.status(200).json({ message: "Slot updated successfully", updatedSlot: slot });
    } catch (error) {
        console.error("Error updating slots:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


function addOneHour(time) {
    let [hour, minute] = time.split(":").map(Number);
    hour = (hour + 1) % 24; // Ensure it stays within 24-hour format
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}





module.exports = {

    adminLogin,
    adminLogout,
    getAllusers,
    manageUsers,
    addCourt,
    getAllcourts,
    generateSlots,
    getAllSlots,
    updateSlots


}