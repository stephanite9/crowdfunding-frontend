import { Link } from "react-router-dom";
import useFundraisers from "../hooks/use-fundraisers"; 
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css";
import { useEffect, useState, useRef } from "react";

function HomePage() {
    const { fundraisers, isLoading, error } = useFundraisers();
    const [latest, setLatest] = useState([]);
    const [latestError, setLatestError] = useState(null);
    const [latestLoading, setLatestLoading] = useState(true);
    const carouselRef = useRef(null);

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

    const scrollByCard = (dir) => {
        const el = carouselRef.current;
        if (!el) return;
        const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? 320;
        el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
    };

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
                <p className="hero__subtitle screenplay">
                    <div className="scene-heading">FUNDRAISER</div>
                    <div className="action">*Lights fade up on an empty stage*</div>
                    <div className="dialogue">"We have a vision, but we need your help to bring it to life."</div>

                    <div className="scene-heading">FANDOM</div>
                    <div className="dialogue">"What can I do? All I have is money and an unhealthy obsession!"</div>

                    <div className="scene-heading">FUNDRAISER</div>
                    <div className="action">*Steps forward*</div>
                    <div className="dialogue">"Back theatre, film, and media projects. Discover passionate creators, pledge support, and together, we'll keep the show going."</div>
                </p>

            <section className="about">
                <h2>How it works</h2>
                <p>
                    Create a fundraiser, share your vision, and invite supporters to pledge.
                    Track progress toward your goal, interact with your supporters and keep your backers updated as you go.
                </p>
            
            </section>
                <div className="hero__actions">
                    <Link to="/createfundraiser" className="btn primary">Start a fundraiser</Link>
                    <Link to="/fundraisers" className="btn ghost">Browse projects</Link>
                </div>
            </section>


            <section className="latest">
                <div className="latest__header">
                    <h2>Latest live fundraisers</h2>
                    <div className="carousel-controls">
                        <button onClick={() => scrollByCard(-1)} aria-label="Previous">‹</button>
                        <button onClick={() => scrollByCard(1)} aria-label="Next">›</button>
                    </div>
                </div>
                {latestLoading && <p>Loading latest...</p>}
                {latestError && <p>{latestError.message}</p>}
                {!latestLoading && !latestError && (
                    <div ref={carouselRef} className="carousel">
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