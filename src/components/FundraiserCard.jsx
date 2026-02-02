import { Link } from "react-router-dom";
import "./FundraiserCard.css";

function FundraiserCard(props) {
    const { fundraiserData } = props;
    const fundraiserLink = `/fundraisers/${fundraiserData.id}`;

    // Try multiple sources for pledge total
    const totalPledged = 
        fundraiserData.total_pledged ?? // if backend provides this
        fundraiserData.pledgeTotal ?? 
        (Array.isArray(fundraiserData.pledges)
            ? fundraiserData.pledges.reduce((sum, p) => sum + Number(p?.amount ?? 0), 0)
            : 0);

    const goal = Number(fundraiserData.goal || 0);
    const goalReached = goal > 0 && totalPledged >= goal;

    console.log({
        title: fundraiserData.title,
        totalPledged,
        goal,
        goalReached,
        pledgesArray: fundraiserData.pledges,
    });

    return (
        <div className="fundraiser-card">
            {goalReached && <div className="goal-reached-badge">✓ Goal Reached</div>}
            <Link to={fundraiserLink} className="fundraiser-link">
                <img src={fundraiserData.image} alt={fundraiserData.title} />
                <h2>{fundraiserData.title}</h2>
                <h3>Goal: ${fundraiserData.goal}</h3>
            </Link>
        </div>
    );
}

export default FundraiserCard;