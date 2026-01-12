import { useState, useMemo } from "react";
import useFundraisers from "../hooks/use-fundraisers";
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css";

function BrowseFundraisersPage() {
    const { fundraisers, isLoading, error } = useFundraisers();
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState("relevance");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ media: [], location: "", goalMin: "", goalMax: "" });

    // Helper function to get fundraiser ID
    const getId = (item) => {
        if (!item) return null;
        if (item.id != null) return String(item.id);
        if (item.pk != null) return String(item.pk);
        if (item._id != null) return String(item._id);
        return null;
    };

    // Compute filter option sources
    const allMediaTypes = useMemo(() => {
        const s = new Set();
        (fundraisers || []).forEach((f) => { if (f?.media) s.add(String(f.media)); });
        return Array.from(s).sort();
    }, [fundraisers]);

    const allLocations = useMemo(() => {
        const s = new Set();
        (fundraisers || []).forEach((f) => { if (f?.location) s.add(String(f.location)); });
        return Array.from(s).sort();
    }, [fundraisers]);

    // Filter and search
    const filteredFundraisers = useMemo(() => {
        const term = query.toLowerCase().trim();
        const hasTerm = !!term;

        const mediaSet = new Set(filters.media);
        const minGoal = filters.goalMin === "" ? null : Number(filters.goalMin);
        const maxGoal = filters.goalMax === "" ? null : Number(filters.goalMax);

        return (fundraisers || []).filter((f) => {
            if (hasTerm) {
                const q = term;
                const matchesBase = (
                    (f.title && f.title.toLowerCase().includes(q)) ||
                    (f.description && f.description.toLowerCase().includes(q)) ||
                    (f.media && String(f.media).toLowerCase().includes(q)) ||
                    (f.location && String(f.location).toLowerCase().includes(q)) ||
                    (f.owner && String(f.owner).toLowerCase().includes(q))
                );
                if (!matchesBase) return false;
            }

            // Media filter
            if (mediaSet.size > 0) {
                const fundraiserMedia = String(f?.media || "");
                if (!mediaSet.has(fundraiserMedia)) return false;
            }

            // Location filter
            if (filters.location) {
                const fundraiserLocation = String(f?.location || "");
                if (!fundraiserLocation.includes(filters.location)) return false;
            }

            // Goal filter
            const goalNum = Number(f?.goal ?? NaN);
            if (!Number.isNaN(goalNum)) {
                if (minGoal !== null && goalNum < minGoal) return false;
                if (maxGoal !== null && goalNum > maxGoal) return false;
            } else {
                if (minGoal !== null || maxGoal !== null) return false;
            }

            return true;
        });
    }, [fundraisers, query, filters]);

    // Sort the filtered fundraisers
    const sortedFundraisers = useMemo(() => {
        const list = [...(filteredFundraisers || [])];
        const collator = new Intl.Collator(undefined, { sensitivity: "base" });

        const pledgesOf = (x) => {
            const pledges = Array.isArray(x?.pledges) ? x.pledges : [];
            return pledges.reduce((sum, p) => sum + Number(p?.amount ?? 0), 0);
        };
        const goalOf = (x) => Number(x?.goal ?? 0);
        const timeOf = (x) => {
            const raw = x?.date_created ?? x?.createdAt ?? x?.date ?? null;
            const parsed = raw ? Date.parse(raw) : NaN;
            if (!Number.isNaN(parsed)) return parsed;
            const idNum = Number(getId(x) ?? 0);
            return idNum;
        };

        switch (sortBy) {
            case "title":
                list.sort((a, b) => collator.compare(a?.title ?? "", b?.title ?? ""));
                break;
            case "goalAsc":
                list.sort((a, b) => goalOf(a) - goalOf(b));
                break;
            case "goalDesc":
                list.sort((a, b) => goalOf(b) - goalOf(a));
                break;
            case "pledgesDesc":
                list.sort((a, b) => pledgesOf(b) - pledgesOf(a));
                break;
            case "newest":
                list.sort((a, b) => timeOf(b) - timeOf(a));
                break;
            case "relevance":
            default:
                break;
        }

        return list;
    }, [filteredFundraisers, sortBy]);

    if (isLoading) return <p>loading...</p>;
    if (error) return <p>{error.message}</p>;

    return (
        <div className="home-container">
            <section className="all-courses-section">
                <h2>Live Fundraisers</h2>
                <div className="search-row">
                    <input
                        type="text"
                        className="search-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search title, location, media…"
                        aria-label="Search fundraisers"
                    />
                    {query && (
                        <button
                            type="button"
                            className="primary-btn"
                            onClick={() => setQuery("")}
                            aria-label="Clear search"
                        >
                            Clear
                        </button>
                    )}
                    <button
                        type="button"
                        className="filter-toggle-btn"
                        aria-expanded={showFilters}
                        aria-controls="filter-panel"
                        onClick={() => setShowFilters((v) => !v)}
                    >
                        {showFilters ? "Hide Filters" : "Filter"}
                    </button>
                    <label htmlFor="sort" className="visually-hidden">Sort by</label>
                    <select
                        id="sort"
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        aria-label="Sort fundraisers"
                    >
                        <option value="relevance">Sort: Relevance</option>
                        <option value="title">Sort: Title (A–Z)</option>
                        <option value="newest">Sort: Newest</option>
                        <option value="goalAsc">Sort: Goal (Low→High)</option>
                        <option value="goalDesc">Sort: Goal (High→Low)</option>
                        <option value="pledgesDesc">Sort: Most Pledged</option>
                    </select>
                </div>
                {showFilters && (
                    <div id="filter-panel" className="filter-panel" role="region" aria-label="Filters">
                        <div className="filter-section">
                            <div className="filter-label">Media Type</div>
                            <div className="filter-options">
                                {allMediaTypes.length === 0 && (
                                    <div className="filter-empty">No media types</div>
                                )}
                                {allMediaTypes.map((media) => (
                                    <label key={media} className="filter-option">
                                        <input
                                            type="checkbox"
                                            checked={filters.media.includes(media)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setFilters((f) => {
                                                    const next = new Set(f.media);
                                                    if (checked) next.add(media); else next.delete(media);
                                                    return { ...f, media: Array.from(next) };
                                                });
                                            }}
                                        />
                                        <span>{media}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section">
                            <div className="filter-label">Location</div>
                            <div className="filter-options">
                                {allLocations.length === 0 && (
                                    <div className="filter-empty">No locations</div>
                                )}
                                {allLocations.map((loc) => (
                                    <label key={loc} className="filter-option">
                                        <input
                                            type="checkbox"
                                            checked={filters.location === loc}
                                            onChange={(e) => {
                                                setFilters((f) => ({
                                                    ...f,
                                                    location: e.target.checked ? loc : "",
                                                }));
                                            }}
                                        />
                                        <span>{loc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section">
                            <div className="filter-label">Goal ($)</div>
                            <div className="filter-duration">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Min"
                                    value={filters.goalMin}
                                    onChange={(e) => setFilters((f) => ({ ...f, goalMin: e.target.value }))}
                                />
                                <span className="duration-sep">–</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Max"
                                    value={filters.goalMax}
                                    onChange={(e) => setFilters((f) => ({ ...f, goalMax: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="filter-actions">
                            <button type="button" className="btn btn-apply" onClick={() => setShowFilters(false)}>Apply</button>
                            <button
                                type="button"
                                className="btn btn-clear"
                                onClick={() => setFilters({ media: [], location: "", goalMin: "", goalMax: "" })}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}
                <div id="fundraiser-list" className="fundraiser-grid">
                    {sortedFundraisers.map((fundraiserData, key) => (
                        <FundraiserCard key={key} fundraiserData={fundraiserData} />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default BrowseFundraisersPage;