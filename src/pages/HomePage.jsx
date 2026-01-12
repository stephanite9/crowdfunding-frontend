import { Link } from "react-router-dom";
import useFundraisers from "../hooks/use-fundraisers"; 
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css";
import { useEffect, useState } from "react"; // added

function HomePage() {
    const { fundraisers, isLoading, error } = useFundraisers();
    const [latest, setLatest] = useState([]);
    const [latestError, setLatestError] = useState(null);
    const [latestLoading, setLatestLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const url = `${import.meta.env.VITE_API_URL}/fundraisers/latest/`;
                const response = await fetch(url, { method: "GET" });
                if (!response.ok) {
                    const fallback = "Error fetching latest fundraisers";
                    const data = await response.json().catch(() => null);
                    throw new Error(data?.detail ?? fallback);
                }
                const data = await response.json();
                setLatest(data ?? []);
            } catch (err) {
                setLatestError(err);
            } finally {
                setLatestLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (isLoading) {
        return (<p>loading...</p>)
    }

    if (error) {
        return (<p>{error.message}</p>)
    }

    return (
        <div className="home">
            <section className="hero">
                <p className="hero__eyebrow">Crowdfunding for stage & screen</p>
                <h1 className="hero__title">The Show Must Go On</h1>
                <p className="hero__subtitle">
                    Back new theatre, film, and media projects. Discover passionate creators,
                    pledge support, and help bring your favourite stories back to life.
                </p>
                <div className="hero__actions">
                    <Link to="/createfundraiser" className="btn primary">Start a fundraiser</Link>
                    <Link to="/fundraisers" className="btn ghost">Browse projects</Link>
                </div>
            </section>

            <section className="about">
                <h2>How it works</h2>
                <p>
                    Create a fundraiser, share your vision, and invite supporters to pledge.
                    Track progress toward your goal, interact with your supporters and keep your backers updated as you go.
                </p>
            </section>

            <section className="latest">
                <h2>Latest live fundraisers</h2>
                {latestLoading && <p>Loading latest...</p>}
                {latestError && <p>{latestError.message}</p>}
                {!latestLoading && !latestError && (
                    <div id="fundraiser-list">
                        {latest.map((fundraiserData, key) => (
                            <FundraiserCard key={key} fundraiserData={fundraiserData} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default HomePage;