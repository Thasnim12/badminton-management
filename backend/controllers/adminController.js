const mongoose = require('mongoose')
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcryptjs')
const moment = require('moment')
const multer = require('multer');
const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const Court = require('../models/courtModel')
const Slot = require('../models/slotModel')
const courtConfig = require('../models/courtConfig')
const generateAdminToken = require('../authentication/generateAdminToken')
const Staff = require('../models/staffModel')
const Addons = require('../models/addonModel')
const { upload, bannerUpload } = require('../helper/multer')
const Donations = require('../models/donationModel')
const Banner = require('../models/bannerModel')



const adminLogin = async (req, res) => {
    try {
        const { name, passkey } = req.body;

        if (!name || !passkey) {
            return res.status(400).json({ message: "Missing required fields!" });
        }

        const admin = await Admin.findOne({ name });
        console.log(admin, "admin");

        if (admin) {
            const validPasskey = await bcrypt.compare(passkey, admin.passkey);

            if (!validPasskey) {
                return res.status(400).json({ message: "Invalid passkey" });
            }

            admin.lastLogin = new Date();
            await admin.save();

            console.log(admin._id, "id");

            const token = generateAdminToken(res, admin._id);

            return res.status(200).json({
                admin,
                message: "Admin logged in successfully",
                token,
            });
        } else {
            if (
                name !== process.env.ADMIN_NAME ||
                passkey !== process.env.ADMIN_PASSKEY
            ) {
                return res
                    .status(401)
                    .json({ message: "Unauthorized, Invalid credentials" });
            }

            const hashedPasskey = await bcrypt.hash(passkey, 10);

            const newAdmin = new Admin({
                name: name,
                passkey: hashedPasskey,
                lastLogin: new Date(),
            });

            await newAdmin.save();

            const token = generateAdminToken(res, newAdmin._id);
            console.log(token, "token");

            return res.status(200).json({
                admin: newAdmin,
                message: "New admin created and logged in successfully",
                token,
            });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const getAdminDetails = async (req, res) => {
    try {
        const admin = await Admin.findOne(); // Assuming only one admin for simplicity
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.json(admin);
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error fetching admin details", error });
    }
};

const adminLogout = async (req, res) => {
    try {
        res.cookie("adminjwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ message: "logout user" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const getAllusers = async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            return res.status(400).json({ message: "users not found" });
        }
        return res.status(200).json({ users });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const manageUsers = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(req.params, "params");
        const id = new mongoose.Types.ObjectId(userId);
        const user = await User.findById({ _id: id });

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { is_blocked: !user.is_blocked },
            { new: true }
        );

        return res.status(200).json({
            message: `User ${updatedUser.is_blocked ? "blocked" : "unblocked"
                } successfully`,
            user: updatedUser,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const addCourt = async (req, res) => {
    try {
        const { court_name, court_image } = req.body;
        console.log(req.body, "body");
        console.log("Headers:", req.headers);

        if (!court_name) {
            return res.status(400).json({ message: "missing required field!" });
        }

        const court = await Court.findOne({ court_name: court_name });

        if (court) {
            return res.status(400).json({ message: "court with same name exists" });
        }

        const newCourt = new Court({
            court_name: court_name,
            court_image: court_image,
        });

        await newCourt.save();

        const newCourtConfig = new courtConfig({
            court: newCourt._id,
            defaultStartHour: 6,
            defaultEndHour: 22,
            closedDays: [0],
        });
        console.log(newCourtConfig, "config");

        await newCourtConfig.save();

        return res
            .status(200)
            .json({ message: "Court added successfully. Admin must set the price." });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const getAllcourts = async (req, res) => {
    try {
        const allCourts = await Court.find({});
        if (!allCourts) {
            return res.status(400).json({ message: "no courts found!" });
        }

        return res.status(200).json({ courts: allCourts });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const generateSlots = async (req, res) => {
    try {
        const { courtId } = req.body;
        const today = moment().startOf("day");
        const endDate = moment(today).add(6, "days").endOf("day");

        const existingSlots = await Slot.find({
            court: courtId,
            startTime: { $gte: today.toDate(), $lte: endDate.toDate() },
        });

        if (existingSlots.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Slots already exist",
                count: existingSlots.length,
                data: existingSlots,
            });
        }

        const slots = [];
        const slotMap = new Map();

        for (let day = 0; day < 7; day++) {
            const currentDate = moment(today).add(day, "days");

            for (let hour = 6; hour < 21; hour++) {
                const startTime = moment(currentDate)
                    .set("hour", hour)
                    .set("minute", 0);
                const endTime = moment(startTime).add(1, "hour");

                const slotKey = `${courtId}-${startTime.format("YYYY-MM-DD-HH")}`;

                if (!slotMap.has(slotKey)) {
                    const slot = new Slot({
                        court: courtId,
                        startTime: startTime.toDate(),
                        endTime: endTime.toDate(),
                        price: 500,
                        isBooked: false,
                    });

                    slots.push(slot);
                    slotMap.set(slotKey, true);
                }
            }
        }

        await Slot.deleteMany({
            court: courtId,
            isBooked: false,
            startTime: {
                $gte: today.toDate(),
                $lt: moment(today).add(7, "days").toDate(),
            },
        });

        if (slots.length > 0) {
            await Slot.insertMany(slots);
        }

        res.status(201).json({
            success: true,
            message: "Slots generated successfully",
            count: slots.length,
            data: slots,
        });
    } catch (error) {
        console.error("Error in generateSlots:", error);
        res.status(500).json({
            success: false,
            message: "Error generating slots",
            error: error.message,
        });
    }
};

const getAllSlots = async (req, res) => {
    try {
        const { courtId } = req.params;

        const today = moment().utc().startOf("day");
        const endDate = moment(today).add(7, "days");

        console.log({ courtId, start: today.format(), end: endDate.format() });

        const slots = await Slot.find({
            court: courtId,
            startTime: { $gte: today.toDate(), $lt: endDate.toDate() },
        }).sort("startTime");

        const uniqueSlots = Array.from(
            new Map(
                slots.map((slot) => [slot.startTime.toISOString(), slot])
            ).values()
        );

        res.status(200).json({
            success: true,
            data: uniqueSlots.map((slot) => ({
                _id: slot._id,
                date: slot.startTime,
                startTime: moment(slot.startTime).format("hh:mm A"),
                endTime: moment(slot.endTime).format("hh:mm A"),
                price: slot.price,
                isBooked: slot.isBooked,
            })),
        });
    } catch (error) {
        console.error("Error in getAllSlots:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching slots",
            error: error.message,
        });
    }
};

const updateSlot = async (req, res) => {

    try {
        const { slotId } = req.params;
        const { startTime, endTime, price } = req.body;
        console.log(req.body, 'body')

        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: price"
            });
        }

        const slotToUpdate = await Slot.findById(slotId);
        console.log(slotToUpdate, 'UPDATE')
        if (!slotToUpdate) {
            return res.status(400).json({
                success: false,
                message: 'Slot not found'
            });
        }

        if (slotToUpdate.isBooked) {
            return res.status(400).json({
                success: false,
                message: 'Cannot update a booked slot'
            });
        }

        // if (startTime || endTime) {
        //     console.log('time')
        //     const newStartTime = startTime ? moment(startTime, 'HH:mm A') : moment(slotToUpdate.startTime);
        //     console.log(newStartTime)
        //     const newEndTime = endTime ? moment(endTime, 'HH:mm A') : moment(slotToUpdate.endTime);

        //     if (!newStartTime.isValid() || !newEndTime.isValid()) {
        //         return res.status(400).json({
        //             success: false,
        //             message: 'Invalid time format. Please use HH:mm AM/PM format (e.g., "07:00 AM")'
        //         });
        //     }

        //     const hour = newStartTime.hour();
        //     if (hour < 6 || hour >= 21) {
        //         return res.status(400).json({
        //             success: false,
        //             message: 'Slot time must be between 6 AM and 9 PM'
        //         });
        //     }

        //     return res.status(400).json({
        //         success: false,
        //         message: 'Time updates are not allowed to maintain slot consistency. Only price updates are permitted.'
        //     });
        // }

        const updatedSlot = await Slot.findByIdAndUpdate(
            slotId,
            { price },
            { new: true }
        );
        console.log(updatedSlot, 'SLOT')

        const formattedSlot = {
            _id: updatedSlot._id,
            date: updatedSlot.startTime,
            startTime: moment(updatedSlot.startTime).format('HH:mm'),
            endTime: moment(updatedSlot.endTime).format('HH:mm'),
            price: updatedSlot.price,
            isBooked: updatedSlot.isBooked
        };

        res.status(200).json({
            success: true,
            message: 'Slot price updated successfully',
            data: formattedSlot
        });

    } catch (error) {
        console.error('Error in updateSlot:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating slot',
            error: error.message
        });
    }
}


const addStaff = async (req, res) => {

    try {
        const { name, email, designation, employee_id, joining_date, phoneno } =
            req.body;

        if (
            !name ||
            !email ||
            !designation ||
            !employee_id ||
            !joining_date ||
            !phoneno
        ) {
            return res.status(400).json({ message: "missing required fields" });
        }

        const existingStaff = await Staff.findOne({ email: email });

        if (existingStaff) {
            return res
                .status(400)
                .json({ message: "staff with same email already exists" });
        }

        const newStaff = new Staff({
            name: name,
            email: email,
            phoneno: phoneno,
            designation: designation,
            employee_id: employee_id,
            joining_date: joining_date,
        });

        if (existingStaff) {
            return res.status(400).json({ message: "staff with same email already exists" })
        }

        await newStaff.save();

        return res.status(200).json({ message: 'user addedd successfully', newStaff })

    } catch (error) {
        console.log(error.message);
    }
};

const getAllStaffs = async (req, res) => {
    try {
        const staffs = await Staff.find();

        if (!staffs || staffs.length === 0) {
            return res.status(404).json({ message: "No staff found" });
        }

        return res
            .status(200)
            .json({ message: "Staffs fetched successfully", staffs });
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const getAllDonations = async (req, res) => {
    try {
        const donations = await Donations.find().populate(
            "donor_id",
            "name"
            //   "payment_status"
        );
        console.log(donations, "donation");
        if (!donations || donations.length === 0) {
            return res.status(404).json({ message: "No donations found" });
        }

        return res.status(200).json(donations);
    } catch (error) {
        console.error(error.message);
        return res
            .status(500)
            .json({ message: "Server error, please try again later" });
    }
};


const manageAddons = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { item_name, item_type, quantity, price } = req.body;
            const item_image = req.file ? req.file.filename : null;

            if (!item_name || !item_type || !quantity || !price) {
                return res.status(400).json({ message: "Missing required fields!" });
            }

            const existingItem = await Addons.findOne({ item_name });

            if (existingItem) {
                return res.status(400).json({ message: "Item already exists, try adding a new item!" });
            }

            const newItem = new Addons({
                item_name,
                item_type,
                quantity,
                price,
                item_image
            });

            await newItem.save();

            return res.status(200).json({ message: "Item added successfully", item: newItem });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: "Server error!" });
        }
    });
};

const getAlladdons = async (req, res) => {
    try {
        const addons = await Addons.find({})
        if (!addons) {
            return res.status(400).json({ message: "no addouns found" })
        }

        return res.status(200).json({ addons: addons })
    }
    catch (error) {
        console.log(error.message)
    }
}
const manageStaffs = async (req, res) => {
    try {
        const { name, email, designation, employee_id, joining_date, phoneno } =
            req.body;
        if (
            !name &&
            !email &&
            !designation &&
            !employee_id &&
            !joining_date &&
            !phoneno
        ) {
            return res.status(400).json({ message: "No fields provided to update" });
        }
        const existingStaff = await Staff.findOne({
            employee_id: req.params.employee_id,
        });

        if (!existingStaff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        existingStaff.name = name || existingStaff.name;
        existingStaff.email = email || existingStaff.email;
        existingStaff.phoneno = phoneno || existingStaff.phoneno;
        existingStaff.designation = designation || existingStaff.designation;
        existingStaff.joining_date = joining_date || existingStaff.joining_date;

        await existingStaff.save();
        return res.status(200).json({
            message: "Staff updated successfully",
            updatedStaff: existingStaff,
        });
    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
};

const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params; // Use 'id' instead of '_id'
        console.log(id, "id received for deletion");

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Staff ID format" });
        }

        const existingStaff = await Staff.findById(id);
        if (!existingStaff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        await Staff.findByIdAndDelete(id);

        return res.status(200).json({ message: "Staff deleted successfully" });
    } catch (error) {
        console.error("Delete Staff Error:", error.message);
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
};

const addBanner = async (req, res) => {
    bannerUpload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { title, order } = req.body;
            console.log(req.body, 'bodyy')

            let orderArray;

            orderArray = JSON.parse(order);

            if (!Array.isArray(orderArray) || orderArray.some(isNaN)) {
                return res.status(400).json({ message: "Invalid order format!" });
            }


            const banner_image = req.files ? req.files.map(file => file.filename) : [];

            if (!title || banner_image.length === 0 || orderArray.some(isNaN)) {
                return res.status(400).json({ message: "Missing required fields or invalid order format!" });
            }

            const existingOrder = await Banner.findOne({ order: orderArray });

            if (existingOrder) {
                return res.status(400).json({ message: "Banner with same order exists, try adding with a different order number!" });
            }

            const existingItem = await Banner.findOne({ title });

            if (existingItem) {
                return res.status(400).json({ message: "Banner with the same title exists, try adding a different title!" });
            }

            const newItem = new Banner({
                title,
                order: orderArray,
                imageUrl: banner_image
            });

            await newItem.save();

            return res.status(200).json({ message: "Item added successfully", item: newItem });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: "Server error!" });
        }
    });
};

const getAllBanner = async (req, res) => {
    try {
        console.log('banner')
        const banner = await Banner.find({})
        return res.status(200).json({ banner })
    }
    catch (error) {
        console.log(error.message)
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
}

const viewBanner = async (req, res) => {
    try {

        const { bannerId } = req.params;
        console.log(bannerId, 'id')
        const id = new mongoose.Types.ObjectId(bannerId);

        const banner = await Banner.findById({ _id: id })

        if (!banner) {
            return res.status(400).json({ message: 'banner not found!' })
        }

        return res.status(200).json({ banner: banner })
    }
    catch (error) {
        console.log(error.message)
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }

}


const editBanner = async (req, res) => {

    try {
        console.log("Raw Request Body:", req.body);
        console.log("Raw Request Files:", req.files);

        const { bannerId } = req.params;
        const { title, order, removedImages } = req.body;
        console.log(req.body, 'bodyyy')
        const newImages = req.files ? req.files.map((file) => file.filename) : [];

        if (!mongoose.Types.ObjectId.isValid(bannerId)) {
            return res.status(400).json({ message: "Invalid banner ID" });
        }

        const banner = await Banner.findById(bannerId);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found!" });
        }

        let updatedImages = [...banner.imageUrl];
        let updatedOrder = [...banner.order];

        if (removedImages && removedImages.length > 0) {
            const removedImagesArray = JSON.parse(removedImages);

            removedImagesArray.forEach((img) => {
                const imagePath = path.join(__dirname, "../uploads/", img);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });

            updatedImages = updatedImages.filter((img, index) => {
                if (removedImagesArray.includes(img)) {
                    updatedOrder.splice(index, 1);
                    return false;
                }
                return true;
            });

            updatedOrder = updatedOrder.map((_, i) => i + 1);
        }

        if (newImages.length > 0) {
            updatedImages.push(...newImages);
            updatedOrder.push(...newImages.map((_, i) => updatedImages.length - newImages.length + i + 1));
        }

        banner.imageUrl = updatedImages;
        banner.order = updatedOrder;
        if (title) banner.title = title;

        await banner.save();

        res.status(200).json({ message: "Banner updated successfully!", banner });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



module.exports = {

    adminLogin,
    adminLogout,
    getAllusers,
    manageUsers,
    addCourt,
    getAllcourts,
    generateSlots,
    getAllSlots,
    updateSlot,
    addStaff,
    manageAddons,
    getAlladdons,
    getAllStaffs,
    getAllDonations,
    manageStaffs,
    deleteStaff,
    getAdminDetails,
    addBanner,
    getAllBanner,
    viewBanner,
    editBanner

}
