import { Link } from "react-router-dom";
import "./FundraiserCard.css";

function FundraiserCard(props) {
    const { fundraiserData } = props;
    const fundraiserLink = `fundraisers/${fundraiserData.id}`;


    return (
    <div className="fundraiser-card">
        <Link to={fundraiserLink}>
        <img src={fundraiserData.image} />
        <h2>{fundraiserData.title}</h2>
        <h3>Goal: ${fundraiserData.goal}</h3>
        </Link>
    </div>
    );
}

export default FundraiserCard;