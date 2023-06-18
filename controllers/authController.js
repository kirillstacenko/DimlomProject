import userModel from "../models/userModel.js";
import {comparePassword, hashPassword} from "../helpers/authHelpers.js";
import JWT from "jsonwebtoken";

export const registerController = async (req,res) => {
    try {
        const { name, email, password, phone, address,answer } = req.body;
        //validations
        if (!name) {
            return res.send({ message: "Имя обязательно" });
        }
        if (!email) {
            return res.send({ message: "Требуется электронная почта" });
        }
        if (!password) {
            return res.send({ message: "Требуется пароль" });
        }
        if (!phone) {
            return res.send({ message: "Требуется телефон" });
        }
        if (!address) {
            return res.send({ message: "Требуется адресс" });
        }
        if (!answer) {
            return res.send({ message: "Требуется дата рождения" });
        }
        //check user
        const exisitingUser = await userModel.findOne({ email });
        //exisiting user
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: "Уже зарегистрировались, пожалуйста, войдите в систему",
            });
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer
        }).save();

        res.status(201).send({
            success: true,
            message: "Пользователь успешно зарегистрировался",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Ошибка при регистрации",
            error,
        });
    }
};

//POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Неверный адрес электронной почты или пароль",
            });
        }
        //check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Адрес электронной почты не зарегистрирован",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Неверный пароль",
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "успешно войдите в систему",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role:user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Ошибка при входе в систему",
            error,
        });
    }
}

//восстановление пароля.
export const forgotPasswordController = async (req,res) => {
    try {
        const {email,answer, newPassword} = req.body;
        if (!email){
            res.status(400).send({message: 'Требуется email...'})
        }
        if (!answer){
            res.status(400).send({message: 'Требуется ответ...'})
        }
        if (!newPassword){
            res.status(400).send({message: 'Требуется новый пароль...'})
        }
        const user = await userModel.findOne({email,answer})
        if (!user){
            return res.status(404).send({
                success:false,
                message: 'неправильный ответ или Email'
            });
        };
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message: 'Пароль успешно изменён'
        });
    }catch (error){
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'Что то пошло не так...',
            error
        })
    }
}


//test controller
export const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};