import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from "react-router-dom"
import { utilService } from "../services/util.service"
import { postService } from "../services/post.service"
import { setCurrPost } from "../store/actions/post.actions"

export function PostDetails({ lastPath }) {
    const navigate = useNavigate()

    const post = useSelector((storeState) => storeState.postModule.currPost)

    const [likesCount, setLikesCount] = useState(post ? post.likedBy.length : null);
    const likedByIndex = post ? post.likedBy.findIndex(user => user._id === "u101") : null;
    const currentUser = useSelector((storeState) => storeState.userModule.loggedinUser)
    const [hoveredComment, setHoveredComment] = useState(null)
    const [commentToDelete, setCommentToDelete] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEmojis, setShowEmojis] = useState(false)
    const [newCommentText, setNewCommentText] = useState("")
    const [commentTimestamp, setCommentTimestamp] = useState(Date.now())
    const [isEmptyComment, setIsEmptyComment] = useState(true)
    const [isLiked, setIsLiked] = useState(false)

    const emojis = ['😀', '😍', '👍', '❤️', '😂', '🎉', '🔥', '😊', '🙌', '😎']
    const { postId } = useParams()

    useEffect(() => {
        if (likedByIndex !== -1) {
            setIsLiked(true);
        }
    }, [likedByIndex]);

    useEffect(() => {
        setCurrPost(postId)
    }, [])

    const handleLikeClick = () => {
        setIsLiked(!isLiked);

        const updatedPost = { ...post };

        if (!isLiked) {
            const likedUser = {
                _id: "u101",
                fullname: "John Johnson",
                imgUrl: "https://res.cloudinary.com/dmhaze3tc/image/upload/v1712178735/instagram-posts/bob_uaojqj.jpg",
            };

            updatedPost.likedBy.push(likedUser);
        } else {
            const index = updatedPost.likedBy.findIndex(user => user._id === "u101"); // Recherchez l'utilisateur démo
            if (index !== -1) {
                updatedPost.likedBy.splice(index, 1);
            }
        }

        postService.save(updatedPost);
    }

    function generateId() {
        return utilService.makeId()
    }

    const handleCommentMouseEnter = (commentId) => {
        setHoveredComment(commentId);
    }

    const handleCommentMouseLeave = () => {
        setHoveredComment(null);
    }

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const commentDate = new Date(timestamp);
        const diff = now - commentDate;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) return `${years}y`;
        if (months > 0) return `${months}m`;
        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
        if (seconds > 0) return 'Just now';
        // if (seconds > 0) return `${seconds}s`;

        return 'Just now';
    }

    const handleDeleteComment = (commentId) => {
        setCommentToDelete(commentId);
        setShowDeleteModal(true);
    }

    function toggleDeleteModal() {
        setShowDeleteModal(false)
    }

    const confirmDeleteComment = async () => {
        if (commentToDelete) {
            const updatedPost = { ...post };
            const commentIndex = updatedPost.comments.findIndex(comment => comment._id === commentToDelete);

            if (commentIndex !== -1) {
                updatedPost.comments.splice(commentIndex, 1);
                await postService.save(updatedPost);
                setShowDeleteModal(false);
            }
        }
    }

    const cancelDeleteComment = () => {
        setShowDeleteModal(false);
        setCommentToDelete(null);
    }

    const toggleEmojis = () => {
        setShowEmojis(!showEmojis);
    }

    const addEmojiToComment = (emoji) => {
        setNewCommentText((prevText) => prevText + emoji);
        toggleEmojis();
    }

    const handleCommentChange = (e) => {
        const comment = e.target.value
        setNewCommentText(comment);
        setCommentTimestamp(Date.now());
        if (comment.length) {
            setIsEmptyComment(false)
        }
        else {
            setIsEmptyComment(true)
        }
    }

    const handleCommentSubmit = async () => {
        if (newCommentText.trim() === "") {
            return;
        }

        const newComment = {
            _id: utilService.makeId(),
            by: {
                _id: currentUser._id,
                fullname: currentUser.fullname,
                username: currentUser.username,
                imgUrl: currentUser.imgUrl
            },
            txt: newCommentText,
            timestamp: Date.now()
        };

        post.comments.push(newComment)
        setNewCommentText("");
        setIsEmptyComment(true)

        await postService.save(post)
    }

    async function handleWraperClicked() {
        try {
            await setCurrPost()
            navigate(`${lastPath}`)
            // navigate('/')
        }
        catch (err) {
            console.log('had a problem setting currPost to null')
            throw err
        }

    }

    if (!post) return (
        <span></span>
    )

    return (
        <div className="details-container">

            <div className="modal-overlay" onClick={handleWraperClicked}>
                <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>

                    <img className="modal-post-img" src={post.imgUrl} alt="post-img" />

                    <div className="comments-section">

                        <section className="post-modal-header flex align-center">
                            <img className="modal-user-avatar" src={post.by.imgUrl} />
                            <Link className="clean-link fw600 fg1">{post.by.username}</Link>
                            <i className="fa-solid fa-ellipsis "></i>
                        </section>
                        <ul className="comments-list">
                            <li key={generateId} className="comment-item first-comment">
                                <img src={post.by.imgUrl} alt={post.by.fullname} className="user-avatar comment-avatar" />
                                <div className="comment-content">
                                    <div className="username-txt">
                                        <Link className="clean-link fw600 mr05">{post.by.username}</Link>
                                        <span className="comment-text">{post.txt}</span>
                                    </div>
                                    <div className="comment-actions">
                                        <span className="comment-time">1h</span>
                                    </div>
                                </div>
                            </li>
                            {post.comments.map(comment => (
                                <li
                                    key={comment._id}
                                    className="comment-item"
                                    onMouseEnter={() => handleCommentMouseEnter(comment._id)}
                                    onMouseLeave={handleCommentMouseLeave}
                                >
                                    <img src={comment.by.imgUrl} alt={comment.by.fullname} className="user-avatar comment-avatar" />
                                    <div className="comment-content">
                                        <div className="username-txt">
                                            <Link className="clean-link fw600 mr05">{comment.by.username}</Link>
                                            <span className="comment-text">{comment.txt}</span>
                                        </div>
                                        <div className="comment-actions">

                                            <span className="comment-time">{getTimeAgo(comment.timestamp)}</span>
                                            {hoveredComment === comment._id && (
                                                <i className="fa-solid fa-ellipsis comment-delete-btn" onClick={() => handleDeleteComment(comment._id)}></i>
                                            )}
                                        </div>
                                    </div>
                                    <i className="fa-regular fa-heart comment-like-btn"></i>
                                </li>
                            ))}

                        </ul>
                        <div className="details-footer-container">
                            <div className="btn-container flex align-center">
                                <div className="like" onClick={handleLikeClick} style={{ color: isLiked ? 'red' : 'black' }}>
                                    {!isLiked ? <i className="fa-regular fa-heart"></i> : <i className="fa-solid fa-heart like"></i>}
                                </div>
                                <i className="fa-regular fa-comment"></i>
                                <i className="fa-regular fa-paper-plane share-post-btn"></i>
                                <i className="fa-regular fa-bookmark save-btn" ></i>
                            </div>
                            <div className="likes-time">
                                {post.likedBy.length ?
                                    <a className="clean-link fw600">
                                        {post.likedBy.length} {post.likedBy.length > 1 ? 'likes' : 'like'}
                                    </a> :
                                    <span>be the first to <span className="fw600 cp" onClick={handleLikeClick}>like this</span></span>
                                }
                                <span>1 hour ago</span>
                            </div>
                        </div>
                        {showDeleteModal && (
                            <div className="modal-overlay" onClick={toggleDeleteModal}>
                                <div className="modal-content delete-comment-modal">
                                    <button className="delete-definitivly-comments-btn clean-btn" onClick={confirmDeleteComment}>Delete</button>
                                    <button className="cancel-delete-comments-btn clean-btn" onClick={cancelDeleteComment}>Cancel</button>
                                </div>
                            </div>
                        )}
                        <div className="comment-input-container">
                            <div className="emojis">
                                <i className="fa-regular fa-face-smile" onClick={toggleEmojis}></i>
                                {showEmojis && (
                                    <div className="emoji-list">
                                        {emojis.map((emoji, index) => (
                                            <span key={index} onClick={() => addEmojiToComment(emoji)}>
                                                {emoji}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="comment-input"
                                value={newCommentText}
                                onChange={handleCommentChange}
                            />
                            <button className={`comment-btn ${isEmptyComment ? '' : 'comment-btn-full'}`} onClick={handleCommentSubmit}>Post</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}