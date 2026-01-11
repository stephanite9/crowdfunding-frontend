import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import postCreateFundraiser from "../api/create-fundraiser.js";
import { useAuth } from "../hooks/use-auth.js";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function CreateFundraiserForm() {
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [fundraiserform, setFundraiserform] = useState({
        title: "",
        description: "",
        location: "",
        media: "",
        goal: "",
        imageUrl: ""
    });

    // Initialize Tiptap editor
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Start writing your fundraiser description...</p>',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setFundraiserform(prev => ({ ...prev, description: html }));
        },
    });

    useEffect(() => {
        if (!auth?.token) {
            navigate("/login");
        }
    }, [auth, navigate]);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFundraiserform(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        // basic validation
        if (!fundraiserform.title || !fundraiserform.description || !fundraiserform.goal) {
            setError("Title, description and goal are required.");
            return;
        }

        const newfundraiserpayload = {
            title: fundraiserform.title,
            description: fundraiserform.description,
            location: fundraiserform.location,
            media: fundraiserform.media,
            goal: Number(fundraiserform.goal),
            image: fundraiserform.imageUrl || "https://placehold.co/600x400",
            is_open: true
        };

        // DEBUG: Check what we're sending
        console.log("Description being sent:", newfundraiserpayload.description);
        console.log("First 100 chars:", newfundraiserpayload.description.substring(0, 100));

        setLoading(true);
        try {
            const created = await postCreateFundraiser(newfundraiserpayload, auth?.token);
            // navigate to created fundraiser page or home
            navigate(`/fundraisers/${created.id}`);
        } catch (err) {
            console.error(err);
            setError(err?.message || "Failed to create fundraiser");
        } finally {
            setLoading(false);
        }
    };

    return (
    <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="title">Title:</label>
            <input 
                type="text" 
                id="title" 
                placeholder="Enter title of fundraiser"
                value={fundraiserform.title}
                onChange={handleChange}
                required
            />

        </div>
        <div>
            <label htmlFor="description">Description:</label>
            {editor && (
                <div className="editor-toolbar">
                    <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>
                        Bold
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>
                        Italic
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                        H2
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                        H3
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                        Bullet List
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                        Numbered List
                    </button>
                </div>
            )}
            <EditorContent editor={editor} />
        </div>
        <div>
            <label htmlFor="location">Location:</label>
            <select 
                id="location"
                value={fundraiserform.location}
                onChange={handleChange}
                required
            >
                <option value="">--Please choose an option--</option>
                <option value="australia">Australia</option>
                <option value="newzealand">New Zealand</option>
                <option value="canada">Canada</option>
                <option value="japan">Japan</option>
            </select>
        </div>
        <div>
            <label htmlFor="media">Media type:</label>
            <select 
                id="media"
                value={fundraiserform.media}
                onChange={handleChange}
                required
            >
                <option value="">--Please choose an option--</option>
                <option value="film">Film</option>
                <option value="tv">Television</option>
            </select>
        </div>
        <div>
            <label htmlFor="goal">Goal:</label>
            <input 
                type="number" 
                id="goal" 
                placeholder="Enter fundraising goal amount"
                value={fundraiserform.goal}
                onChange={handleChange}
                required
            />
        </div>
        <div>
                <label htmlFor="imageUrl">Image URL (optional)</label>
                <input id="imageUrl" value={fundraiserform.imageUrl} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Submit New Fundraiser"}
        </button>
        {error && <div className="error" role="alert">{error}</div>}
    </form>
    );
}

export default CreateFundraiserForm;