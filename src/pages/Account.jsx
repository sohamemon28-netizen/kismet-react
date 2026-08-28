import {
    useContext,
    useState
} from "react";

import {
    Navigate,
    useNavigate
} from "react-router-dom";

import {
    AuthContext
} from "../context/AuthContext";

import {
    API_BASE
} from "../config/api";


function Account() {

const {
    user,
    token,
    isLoggedIn,
    logout,
    setUser
} = useContext(AuthContext);


    const navigate = useNavigate();


    const [isEditing, setIsEditing] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    const [details, setDetails] =
        useState({
            name: user?.name || "",
            phone: user?.phone || "",
            address: user?.address || "",
            city: user?.city || ""
        });


    const pakistanCities = [
        "Karachi",
        "Lahore",
        "Faisalabad",
        "Rawalpindi",
        "Gujranwala",
        "Multan",
        "Hyderabad",
        "Peshawar",
        "Quetta",
        "Islamabad",
        "Sargodha",
        "Sialkot",
        "Bahawalpur",
        "Jhang",
        "Sheikhupura",
        "Gujrat",
        "Sukkur",
        "Larkana",
        "Sahiwal",
        "Okara",
        "Abbottabad",
        "Mardan",
        "Mingora",
        "Rahim Yar Khan",
        "Dera Ghazi Khan",
        "Wah Cantt",
        "Kasur",
        "Nawabshah",
        "Chiniot",
        "Jhelum",
        "Mansehra",
        "Gwadar",
        "Murree",
        "Gilgit",
        "Muzaffarabad"
    ];


    if (!isLoggedIn) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    function handleLogout() {

        logout();

        navigate(
            "/",
            {
                replace: true
            }
        );
    }


    function handleChange(e) {

        const {
            name,
            value
        } = e.target;


        setDetails((previous) => ({
            ...previous,
            [name]: value
        }));
    }


    function handleEdit() {

        setDetails({
            name: user?.name || "",
            phone: user?.phone || "",
            address: user?.address || "",
            city: user?.city || ""
        });

        setMessage("");
        setError("");

        setIsEditing(true);
    }


    function handleCancel() {

        setDetails({
            name: user?.name || "",
            phone: user?.phone || "",
            address: user?.address || "",
            city: user?.city || ""
        });

        setError("");
        setMessage("");

        setIsEditing(false);
    }


    async function handleSave(e) {

        e.preventDefault();


        try {

            setLoading(true);
            setError("");
            setMessage("");


            if (
                !details.name.trim() ||
                !details.phone.trim() ||
                !details.address.trim() ||
                !details.city
            ) {

                throw new Error(
                    "Please complete all your details."
                );
            }


            const response = await fetch(
                `${API_BASE}/api/users/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        name:
                            details.name.trim(),

                        phone:
                            details.phone.trim(),

                        address:
                            details.address.trim(),

                        city:
                            details.city
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update your details."
                );
            }


            setUser(data.user);


            setDetails({
                name:
                    data.user.name || "",

                phone:
                    data.user.phone || "",

                address:
                    data.user.address || "",

                city:
                    data.user.city || ""
            });


            setMessage(
                "Your details have been updated."
            );


            setIsEditing(false);


        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }


    return (

        <main className="account-page">

            <div className="account-container">


                <div className="account-heading">

                    <p className="account-eyebrow">
                        MY ACCOUNT
                    </p>


                    <h1>
                        Hello, {user?.name}.
                    </h1>


                    <p className="account-description">
                        Manage your personal and delivery
                        details.
                    </p>

                </div>


                {message && (

                    <p className="account-success">
                        {message}
                    </p>

                )}


                {error && (

                    <p className="account-error">
                        {error}
                    </p>

                )}


                {!isEditing ? (

                    <>
                        <section className="account-card">

                            <div className="account-row">

                                <span>
                                    Name
                                </span>

                                <strong>
                                    {user?.name}
                                </strong>

                            </div>


                            <div className="account-row">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {user?.email}
                                </strong>

                            </div>


                            <div className="account-row">

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {user?.phone ||
                                        "Not added yet"}
                                </strong>

                            </div>


                            <div className="account-row">

                                <span>
                                    Address
                                </span>

                                <strong>
                                    {user?.address ||
                                        "Not added yet"}
                                </strong>

                            </div>


                            <div className="account-row">

                                <span>
                                    City
                                </span>

                                <strong>
                                    {user?.city ||
                                        "Not added yet"}
                                </strong>

                            </div>


                            <div className="account-row">

                                <span>
                                    Account type
                                </span>

                                <strong>
                                    {user?.role === "admin"
                                        ? "Administrator"
                                        : "Customer"}
                                </strong>

                            </div>

                        </section>


                        <div className="account-actions">

                            <button
                                type="button"
                                className="edit-details-button"
                                onClick={handleEdit}
                            >
                                Edit Details
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/orders")
                                }
                            >
                                My Orders
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/shop")
                                }
                            >
                                Continue Shopping
                            </button>


                            <button
                                type="button"
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>

                    </>

                ) : (

                    <form
                        className="account-edit-form"
                        onSubmit={handleSave}
                    >

                        <div className="account-form-heading">

                            <p className="account-eyebrow">
                                EDIT DETAILS
                            </p>

                            <h2>
                                Update your information.
                            </h2>

                        </div>


                        <div className="account-form-group">

                            <label htmlFor="name">
                                FULL NAME
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={details.name}
                                onChange={handleChange}
                                disabled={loading}
                            />

                        </div>


                        <div className="account-form-group">

                            <label htmlFor="phone">
                                PHONE NUMBER
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="03XX XXXXXXX"
                                value={details.phone}
                                onChange={handleChange}
                                disabled={loading}
                            />

                        </div>


                        <div className="account-form-group">

                            <label htmlFor="city">
                                CITY
                            </label>

                            <select
                                id="city"
                                name="city"
                                value={details.city}
                                onChange={handleChange}
                                disabled={loading}
                            >

                                <option value="">
                                    Select your city
                                </option>


                                {pakistanCities.map(
                                    (city) => (

                                        <option
                                            key={city}
                                            value={city}
                                        >
                                            {city}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="account-form-group">

                            <label htmlFor="address">
                                DELIVERY ADDRESS
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                rows="4"
                                placeholder="House / apartment, street, area..."
                                value={details.address}
                                onChange={handleChange}
                                disabled={loading}
                            />

                        </div>


                        <div className="account-edit-actions">

                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>


                            <button
                                type="button"
                                className="cancel-edit-button"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                )}

            </div>

        </main>
    );
}


export default Account;