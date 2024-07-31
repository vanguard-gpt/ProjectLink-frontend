import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { Trash2, Calendar } from "react-feather";
import './ListCard.css';
import Modal from '../page/boardList/BoardListModal';
import Comment from '../page/comment/Comment';
import CommentModule from '../page/comment/CommentModule';

const ListCard = ({ card, step, handleDeleteCard, updateCardInList }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [description, setDescription] = useState(card.description);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const commentModuleRef = useRef(null);
    const createdDate = card.created ? moment(card.created).format("YYYY년 MM월 DD일") : "";

    useEffect(() => {
        const fetchComments = async () => {
            if (commentModuleRef.current) {
                try {
                    const cardComments = await commentModuleRef.current.getCommentsByCardId(card.id);
                    setComments(cardComments);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                }
            }
        };

        if (isModalOpen) {
            fetchComments();
        }
    }, [isModalOpen, card.id]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateComment = async (cardId, newComment) => {
        if (commentModuleRef.current) {
            await commentModuleRef.current.createComment(cardId, newComment);
            const cardComments = await commentModuleRef.current.getCommentsByCardId(cardId);
            setComments(cardComments);
        }
    };

    const handleUpdateComment = async (commentId, updatedComment) => {
        if (commentModuleRef.current) {
            await commentModuleRef.current.updateComment(commentId, updatedComment);
            const cardComments = await commentModuleRef.current.getCommentsByCardId(card.id);
            setComments(cardComments);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (commentModuleRef.current) {
            await commentModuleRef.current.deleteComment(commentId);
            const cardComments = await commentModuleRef.current.getCommentsByCardId(card.id);
            setComments(cardComments);
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSaveDescription = async () => {
        await updateCardInList(card.id, { description });
        setIsEditingDescription(false);
    };

    return (
        <>
            <div className="list-card" onClick={handleOpenModal}>
                <div className="list-card-label">low priority</div> {/* label 기능 구현 후 로직 수정 요망 */}
                <div className="list-card-title">{card.title}</div>
                <div className="list-card-footer">
                    <Calendar size={16} />
                    <span className="list-card-date">{createdDate}</span>
                </div>
                <button className="delete-card-button" onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }}>
                    <Trash2 size={16} />
                </button>
            </div>

            {isModalOpen && (
                <Modal onClose={handleCloseModal}>
                    <div className="modal-content">
                        <h1>{card.title}</h1>
                        <p>Created: {createdDate}</p>
                        <div className="description-top">
                            <span className="description-font">Description {card.description}</span>
                            <button onClick={handleSaveDescription} className="save-description-button">Save</button>
                        </div>
                        {isEditingDescription ? (
                            <>
                                <textarea
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    className="description-textarea"
                                />
                            </>
                        ) : (
                            <p className="description-text" onClick={() => setIsEditingDescription(true)}>{description || "Add a more detailed description..."}</p>
                        )}
                        <CommentModule ref={commentModuleRef} />
                        <Comment
                            cardId={card.id}
                            comments={comments}
                            createComment={handleCreateComment}
                            updateComment={handleUpdateComment}
                            deleteComment={handleDeleteComment}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default ListCard;




/* <h1>{card.title}</h1>
        <Labels type={step} dateDiff={dateDiff}>
        <Clock />
        {deadline}
      </Labels> */