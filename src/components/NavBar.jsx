import { Link, Outlet } from "react-router-dom";

function NavBar() {
    return (
    <div>
        <nav id="navbar">
        <Link to="/">Home</Link>
        <Link to="/login">Log In</Link>
        <Link to="/contact">Contact</Link>
        </nav>
        <Outlet />
    </div>
    );
}

export default NavBar;