import productModel from "../models/productModel.js";
import fs from 'fs'
import slugify from "slugify";
import categoryModel from "../models/categoryVModel.js";


//payment gateway

export const createProductController = async (req,res) => {
    try {
        const {name,slug,description,price,categoryV,quantity,shipping} = req.fields
        const {photo,} = req.files
        //alidation
        //alidation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Нужно имя" });
            case !description:
                return res.status(500).send({ error: "Нужно описание" });
            case !price:
                return res.status(500).send({ error: "Нужна цена" });
            case !categoryV:
                return res.status(500).send({ error: "Нужна категория" });
            case !quantity:
                return res.status(500).send({ error: "Укажите количество" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "фотография должна быть размером менее 1 мб" });
        }

        const products = new productModel({...req.fields, slug:slugify(name)})
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Продукт успешно создан",
            products,
        });
    }catch (error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message: 'ошибка при создании товара'
        })
    }
}

//get all products
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate("categoryV")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            counTotal: products.length,
            message: "Весь товар",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Ошибка при выводе товара",
            error: error.message,
        });
    }
};

// get single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("categoryV");
        res.status(200).send({
            success: true,
            message: "Выбран отдельный товар:",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Ошибка при выборе отдельного товара",
            error,
        });
    }
};

// вывод фото
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Ошибка при получении фотографии",
            error,
        });
    }
};

//удаление товаров
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Удаление успешно.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Произошла ошибка при удалении товара",
            error,
        });
    }
};

//upate producta
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;
        //alidation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Имя обязательно" });
            case !description:
                return res.status(500).send({ error: "Описание обязательно" });
            case !price:
                return res.status(500).send({ error: "Цена обязательна" });
            case !category:
                return res.status(500).send({ error: "Категория обязательна" });
            case !quantity:
                return res.status(500).send({ error: "Количество обязательно" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "фото не больше 1мб" });
        }

        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Товар успешно обновлён",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Ошибка при обновлении товара",
        });
    }
};

export const productFiltersController = async (req,res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Filtering Products",
            error,
        });
    }
};

// product count
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error in product count",
            error,
            success: false,
        });
    }
};

// product list base on page
export const productListController = async (req, res) => {
    try {
        const perPage = 50;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in per page ctrl",
            error,
        });
    }
};

// search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const resutls = await productModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                ],
            })
            .select("-photo");
        res.json(resutls);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error In Search Product API",
            error,
        });
    }
};

// similar products
export const realtedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(3)
            .populate("categoryV");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "ошибка при получении соответствующего продукта",
            error,
        });
    }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category");
        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Ошибка",
        });
    }
};




