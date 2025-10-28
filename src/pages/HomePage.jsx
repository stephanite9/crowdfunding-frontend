import useFundraisers from "../hooks/use-fundraisers"; 
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css";

function HomePage() {
    // const {fundraisers} = useFundraisers();

    const { fundraisers, isLoading, error } = useFundraisers();
        
        if (isLoading) {
            return (<p>loading...</p>)
        }
    
        if (error) {
            return (<p>{error.message}</p>)
        }

    return (
        <div>
            <h1>The Show Must Go On!</h1>
            <h2>Bring Your Favourite Stories Back To Life</h2>
            <div id="fundraiser-list" >
                {fundraisers.map((fundraiserData, key) => {
                    return <FundraiserCard key={key} fundraiserData={fundraiserData} />;
                })}
            </div>
        </div>
    );
}

export default HomePage;