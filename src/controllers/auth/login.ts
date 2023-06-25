import { Request, Response, NextFunction } from 'express';
import User from '../../models/User';

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password: enteredPassword } = req.body;
    if (!(email && enteredPassword)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter email and password.'
        });
    }
    const user = await User.findOne({ email });
    console.log(user)
    if (!(user !== null && await user.isPasswordsMatched(enteredPassword))) {
        return res.status(400).json({
            success: false,
            message: 'email or password are invalid',
        });
    }
    const token = user.createToken();
    res.status(201).header('Authorization', token).json({
        success: true,
        message: 'you are logined successfully',
        data: user,
        token:token
    });
};

export default login;