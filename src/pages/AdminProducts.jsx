import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE } from "../config/api";
import "../styles/AdminProducts.css";
function AdminProducts() {
    const { token, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        image: "",
        category: ""
    });

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
            return;
        }

        loadProducts();
    }, [isAdmin]);

    async function loadProducts() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE}/api/products`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load products."
                );
            }

            setProducts(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    function resetForm() {
        setForm({
            title: "",
            description: "",
            price: "",
            image: "",
            category: ""
        });

        setEditingId(null);
    }

    function startEditing(product) {
        setEditingId(product._id);

        setForm({
            title: product.title || "",
            description: product.description || "",
            price: product.price || "",
            image: product.image || "",
            category: product.category || ""
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        if (
            !form.title.trim() ||
            !form.description.trim() ||
            !form.price ||
            !form.image.trim() ||
            !form.category.trim()
        ) {
            setError(
                "Please fill in all product fields."
            );
            return;
        }

        try {
            setSaving(true);

            const url = editingId
                ? `${API_BASE}/api/products/${editingId}`
                : `${API_BASE}/api/products`;

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: form.title.trim(),
                    description:
                        form.description.trim(),
                    price: Number(form.price),
                    image: form.image.trim(),
                    category: form.category.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Product request failed."
                );
            }

            if (editingId) {
                setProducts((previous) =>
                    previous.map((product) =>
                        product._id === editingId
                            ? data
                            : product
                    )
                );

                setMessage(
                    "Product updated successfully."
                );
            } else {
                setProducts((previous) => [
                    ...previous,
                    data
                ]);

                setMessage(
                    "Product created successfully."
                );
            }

            resetForm();

        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(productId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_BASE}/api/products/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete product."
                );
            }

            setProducts((previous) =>
                previous.filter(
                    (product) =>
                        product._id !== productId
                )
            );

            setMessage(
                "Product deleted successfully."
            );

            if (editingId === productId) {
                resetForm();
            }

        } catch (error) {
            setError(error.message);
        }
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <main className="admin-products-page">

            <div className="admin-products-container">

                <div className="admin-products-header">

                    <div>
                        <p className="admin-eyebrow">
                            ADMIN PANEL
                        </p>

                        <h1>
                            Manage Products
                        </h1>

                        <p>
                            Create, edit and remove
                            products from your Kismet
                            collection.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin")
                        }
                    >
                        Back to Admin
                    </button>

                </div>

                {error && (
                    <div className="admin-message error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="admin-message success">
                        {message}
                    </div>
                )}

                <section className="admin-product-form">

                    <div className="admin-form-heading">

                        <p className="admin-eyebrow">
                            {editingId
                                ? "EDIT PRODUCT"
                                : "NEW PRODUCT"}
                        </p>

                        <h2>
                            {editingId
                                ? "Update product"
                                : "Add a product"}
                        </h2>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="admin-form-grid">

                            <div className="admin-form-group">
                                <label htmlFor="title">
                                    Product name
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Product name"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="category">
                                    Category
                                </label>

                                <input
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    placeholder="Jewellery"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="price">
                                    Price
                                </label>

                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="500"
                                    max="2000"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="1500"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="image">
                                    Image URL
                                </label>

                                <input
                                    id="image"
                                    name="image"
                                    type="url"
                                    value={form.image}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>

                        </div>

                        <div className="admin-form-group">

                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the product..."
                            />

                        </div>

                        <div className="admin-form-actions">

                            <button
                                type="submit"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Product"
                                    : "Create Product"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                >
                                    Cancel Edit
                                </button>
                            )}

                        </div>

                    </form>

                </section>

                <section className="admin-product-list">

                    <div className="admin-list-heading">

                        <p className="admin-eyebrow">
                            COLLECTION
                        </p>

                        <h2>
                            Current Products
                        </h2>

                    </div>

                    {loading ? (
                        <p>
                            Loading products...
                        </p>
                    ) : products.length === 0 ? (
                        <p>
                            No products found.
                        </p>
                    ) : (
                        <div className="admin-products-grid">

                            {products.map(
                                (product) => (
                                    <article
                                        className="admin-product-card"
                                        key={product._id}
                                    >

                                        <div className="admin-product-image">

                                            <img
                                                src={
                                                    product.image
                                                }
                                                alt={
                                                    product.title
                                                }
                                            />

                                        </div>

                                        <div className="admin-product-info">

                                            <p className="admin-product-category">
                                                {
                                                    product.category
                                                }
                                            </p>

                                            <h3>
                                                {
                                                    product.title
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    product.description
                                                }
                                            </p>

                                            <strong>
    Rs.{" "}
    {Number(
        product.price
    ).toLocaleString()}
</strong>

                                            <div className="admin-product-actions">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        startEditing(
                                                            product
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            product._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    </article>
                                )
                            )}

                        </div>
                    )}

                </section>

            </div>

        </main>
    );
}

export default AdminProducts;