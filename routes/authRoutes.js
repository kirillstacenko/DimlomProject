import express from "express";
import {
    registerController,
    loginController,
    testController,
    forgotPasswordController
} from '../controllers/authController.js'
const router = express.Router()

import {isAdmin, requireSingIt} from "../middlewares/authMiddleware.js";

//роутинг
//регистрация
router.post('/register', registerController)

//LOGIN POST
router.post('/login', loginController)

//востановление пароля

router.post('/forgot-password',forgotPasswordController)

//тест
router.get('/test', requireSingIt, isAdmin, testController)

//Роль-путь пользователя
router.get('/user-auth', requireSingIt, (req,res) => {
    res.status(200).send({ok:true});
})
//Роль-путь админа
router.get('/admin-auth', requireSingIt, isAdmin, (req,res) => {
    res.status(200).send({ok:true});
});

export default router;
