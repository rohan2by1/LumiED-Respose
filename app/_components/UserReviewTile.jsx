//app\_components\UserReviewTile.jsx
const UserReviewTile = ({review}) => {
    return (
        <div key={review.id} className="review-card bg-white p-6 rounded shadow-brand">
            <div className="review-info">
                <div className="review-user-info flex items-center gap-4 mb-4">
                    <img
                        src={review.image}
                        alt={review.name}
                        className="w-12 h-12 object-cover rounded-full"
                    />
                    <div className="review">
                        <h3 className="text-lg font-medium text-brand.dark">{review.name}</h3>
                        <p className="flex items-center text-yellow-500">
                            <img
                                src="/images/star.svg"
                                alt="Star"
                                width={16}
                                height={16}
                            />{" "}
                            <span className="ml-1">{review.rating}</span>
                        </p>
                    </div>
                </div>
                <p className="text-primary">"{review.review}"</p>
            </div>
        </div>
    )
}

export default UserReviewTile