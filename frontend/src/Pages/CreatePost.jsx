import CreatePostForm from "../components/posts/CreatePostForm";
import "./CreatePost.css";

const CreatePost = () => {
    return (
        <div className="create-post-page">
            <div className="create-post-header">
                <h1>Find Support, Share Support</h1>
                <p>
                    Every parent deserves a village. Share your story and connect with others who understand.
                </p>
            </div>
            <CreatePostForm />
        </div>  
    );
}

export default CreatePost;