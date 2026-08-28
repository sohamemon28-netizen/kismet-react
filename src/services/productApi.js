const BASE_URL = "https://fakestoreapi.com";

export async function getJewelleryProducts() {

    const response = await fetch(
        `${BASE_URL}/products/category/jewelery`
    );

    if (!response.ok) {

        throw new Error(
            "Failed to fetch jewellery products."
        );

    }

    return await response.json();

}

export async function getJewelleryProduct(id) {

    const response = await fetch(
        `${BASE_URL}/products/${id}`
    );

    if (!response.ok) {

        throw new Error(
            "Failed to fetch product."
        );

    }

    const product = await response.json();

    if (product.category !== "jewelery") {

        throw new Error(
            "Product not found."
        );

    }

    return product;

}