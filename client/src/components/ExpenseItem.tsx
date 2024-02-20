import React from 'react';

interface Expense {
  title: string;
  amount: number;
  imageUrl: string;
}

interface ExpenseItemProps {
  expense: Expense;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  const { title, amount, imageUrl } = expense;

  const handleLike = () => {
    // Handle like functionality
  };

  const handleComment = () => {
    // Handle comment functionality
  };

  const handleShare = () => {
    // Handle share functionality
  };

  return (
    <div className="expense-item">
      <img src={imageUrl} alt={title} className="expense-item-image" />
      <div className="expense-item-details">
        <h3 className="expense-item-title">{title}</h3>
        <p className="expense-item-amount">${amount}</p>
        <div className="expense-item-actions">
          <button onClick={handleLike} className="expense-item-like-button">
            Like
          </button>
          <button onClick={handleComment} className="expense-item-comment-button">
            Comment
          </button>
          <button onClick={handleShare} className="expense-item-share-button">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
