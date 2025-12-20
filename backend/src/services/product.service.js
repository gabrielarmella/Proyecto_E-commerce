import productRepository from "../repositories/product.repository.js";

const buildAdminFilter = (search) => {
    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { brand : { $regex: search, $options: "i" } },
        ];
    }
    return filter;
};

const buildPublicFilter = ({ search, category, minPrice, maxPrice}) => {
    const filter = { active: true };
    if (category){
        filter.category = category;
    }
    if ( minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags : {$elemMatch: { $regex: search, $options: "i" } } },
        ];
    }
    return filter;
};

const resolveSort = (sort) => {
    if (sort === "price_asc") return { price: 1 };
    if (sort === "price_desc") return { price: -1 };
    if (sort === "name_asc") return { name: 1 };
    if (sort === "name_desc") return { name: -1 };
    return { createdAt: -1 };   
};

const getAdminProducts = async ({ page = 1, limit = 20, search}) => {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;
    const filter = buildAdminFilter(search);

    const { products, total } = await productRepository.findProducts({
        filter,
        sort: { createdAt: -1 },
        skip, 
        limit: limitNumber,
    });

    return {
        products,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            pages: Math.ceil(total / limitNumber),
        },
    };
};

const getPublicProducts = async ({
    search,
    category,
    minPrice,
    maxPrice,
    page = 1,
    limit = 20,
    sort,
}) => {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;
    const skip = (pageNumber - 1) * limitNumber;
    const filter = buildPublicFilter({ search, category, minPrice, maxPrice });
    const sortOption = resolveSort(sort);
    const { products, total } = await productRepository.findProducts({
        filter,
        sort: sortOption,
        skip,
        limit: limitNumber,
    });
    return {
        products,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            pages: Math.ceil(total / limitNumber),
        },
    };
};

const getProductById = async (id) => productRepository.findById(id);

const createProduct = async (payload) => {
    const {
        name,
        price,
        description = "",
        stock = 0,
        category,
        brand,
        images = [],
        isFeatured = false,
        tags = [],
    } = payload;
    if (!name || price == null){
        const error = new Error("Nombre y precio son obligatorios: name, price");
        error.status = 400;
        throw error;
    }
    return productRepository.create({
        name,
        price,
        description,
        stock,
        category,
        brand,
        images,
        isFeatured,
        tags,
        active: true,
    });
};
const updateProduct = async (id, payload) => {
    const allowedFields = [
        "name",
        "price",
        "description",
        "stock",
        "category",
        "brand",
        "images",
        "isFeatured",
        "tags",
        "active",
    ];
    const updates = {};
    for (const key of allowedFields) {
        if (payload[key] !== undefined) {
            updates[key] = payload[key];
        }
    }
    return productRepository.updateById(id, updates);
};

const deleteProduct = async (id) => productRepository.deleteById(id);

export default {
    getAdminProducts,
    getPublicProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};

