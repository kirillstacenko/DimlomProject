import express from "express";
import {isAdmin, requireSingIt} from "../middlewares/authMiddleware.js";
import {
    categoryControlller,
    createCategoryController, deleteCategoryCOntroller, singleCategoryController,
    updateCategoryController
} from "../controllers/CategoryController.js";

const router = express.Router();

//пути
//создание категории
router.post('/create-category',requireSingIt, isAdmin, createCategoryController)


//обновить категории
router.put('/update-category/:id',requireSingIt,isAdmin, updateCategoryController)

//вывести все категории
router.get('/get-category', categoryControlller);

//отдельная категория
router.get('/single-category/:slug', singleCategoryController)

//удаление категорий
router.delete('/delete-category/:id', requireSingIt, isAdmin, deleteCategoryCOntroller)

export default router;