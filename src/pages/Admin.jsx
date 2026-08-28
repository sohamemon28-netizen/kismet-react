import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Admin() {
    const { user, isAdmin, logout } =
        useContext(AuthContext);

    const navigate = useNavigate();

    if (!isAdmin) {
        return (
            <main className="admin-page">
                <div className="admin-container">

                    <h1>Access denied</h1>

                    <p>
                        You do not have permission to access
                        the admin area.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </button>

                </div>
            </main>
        );
    }

    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    return (
        <main className="admin-page">
            <div className="admin-container">

                <p className="admin-eyebrow">
                    ADMIN PANEL
                </p>

                <h1>
                    Welcome, {user?.name}.
                </h1>

                <p className="admin-description">
                    You are signed in with administrator
                    permissions.
                </p>

                <div className="admin-card">

                    <p>
                        <strong>Name:</strong>{" "}
                        {user?.name}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {user?.email}
                    </p>

                    <p>
                        <strong>Role:</strong>{" "}
                        {user?.role}
                    </p>

                </div>

                <div className="admin-actions">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                    >
                        Manage Products
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                    >
                        Manage Orders
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>
        </main>
    );
}

export default Admin;