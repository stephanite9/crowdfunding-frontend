import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="text-center">
            <h1>404 - Page Not Found</h1>
            <p>Sorry (╥﹏╥) I'm new at at this. The page you're looking for doesn't exist.</p>
            <Link to="/">Go back Home</Link>
        </div>
    );
}

export default NotFoundPage;