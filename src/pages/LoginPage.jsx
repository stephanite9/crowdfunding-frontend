import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

function LoginPage() {
    return (
        <>
            <LoginForm />
            
            <div>
                <Link to="/createuser">Create New Account</Link>
            </div>
        </>
    );
}



export default LoginPage;