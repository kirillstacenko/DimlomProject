import express from "express";
import {isAdmin, requireSingIt} from "../middlewares/authMiddleware.js";
import {
    createProductController,
    deleteProductController,
    getProductController,
    getSingleProductController, productCategoryController,
    productCountController,
    productFiltersController, productListController,
    productPhotoController, realtedProductController, searchProductController,
    updateProductController
} from "../controllers/productController.js";
import formidable from 'express-formidable'
import braintree from "braintree";
const router = express.Router();

//путь
router.post('/create-product', requireSingIt,isAdmin,formidable(), createProductController);

//обновление товара
router.put(
    "/update-product/:pid",
    requireSingIt,
    isAdmin,
    formidable(),
    updateProductController
);


//показ товара
router.get("/get-product", getProductController);

//вывод одного товара
router.get("/get-product/:slug", getSingleProductController);

//вывод фото
router.get("/product-photo/:pid", productPhotoController);

//удалить товар
router.delete("/delete-product/:pid", deleteProductController)

//фильтрация товара
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

export default router;