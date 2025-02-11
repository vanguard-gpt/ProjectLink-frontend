import React from 'react';
import BoardCard from './boardcard/BoardCard';

const BoardCardList = ({ boards, onLikeToggle, likedBoards, onViewBoard }) => {
    return (
        <div className="board-list">
            {boards.map((board) => (
                <BoardCard
                    key={board.id}
                    boardName={board.boardName} 
                    board={board}
                    onLikeToggle={onLikeToggle}
                    liked={likedBoards.includes(board.id)}
                    onViewBoard={onViewBoard}
                />
            ))}
        </div>
    );
};

export default BoardCardList;
