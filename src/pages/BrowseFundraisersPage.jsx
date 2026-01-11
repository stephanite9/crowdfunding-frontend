import useFundraisers from "../hooks/use-fundraisers";
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css";

function BrowseFundraisersPage() {
    const { fundraisers, isLoading, error } = useFundraisers();

    if (isLoading) return <p>loading...</p>;
    if (error) return <p>{error.message}</p>;

    return (
        <div className="home">
            <section className="fundraisers">
                <div className="fundraisers__header">
                    <h2>Live fundraisers</h2>
                </div>
                <div id="fundraiser-list" className="fundraiser-grid">
                    {fundraisers.map((fundraiserData, key) => (
                        <FundraiserCard key={key} fundraiserData={fundraiserData} />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default BrowseFundraisersPage;