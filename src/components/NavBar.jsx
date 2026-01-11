import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

function NavBar() {
    const { auth, setAuth } = useAuth();
    const location = useLocation();
    const onHome = location.pathname === "/";

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        setAuth({ token: null });
    };

    return (
    <div>
        <nav id="navbar">
        <Link to="/">Home</Link>
        
        {!onHome && (
            <Link to="/createfundraiser">Create New Fundraiser</Link>
        )}

        {auth.token ? (
            <>
            <span className="navbar-user">
                Logged in as: {auth.username || "User"}
            </span>
                <Link to="/" onClick={handleLogout}>
                    Log Out
                </Link>
            </>
            ) : (
            <Link to="/login">Login</Link>
        )}

        </nav>
        <Outlet />
    </div>
    );
}

export default NavBar;