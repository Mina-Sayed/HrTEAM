import { Request, Response } from "express";
import User from "../../models/user";


const login = async (req: Request, res: Response) => {
    const {
        email: email,
        password: enteredPassword,
    } = req.body;

    if (!email || !enteredPassword) {
        return res.status(400).json({
            success: false,
            message: "Please enter email and password.",
        });
    }

    const user = await User.findOne({ email });

    if (!(user !== null && await user.isPasswordsMatched(enteredPassword))) {
        return res.status(400).json({
            success: false,
            message: "Email or password are invalid.",
        });
    }

    const {
        password,
        ...userWithoutPassword
    } = user.toObject();
    const token: string = user.createToken();

    return res.status(200).json({
        success: true,
        message: "You are logged in successfully.",
        data: userWithoutPassword,
        token: token,
    });
};

export default login;