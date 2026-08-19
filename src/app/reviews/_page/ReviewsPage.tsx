import { Marquee } from '@/components/Marquee';
import { IReview, Review } from '@/components/Review';
import { fiveStarReviews } from './five-star-reviews';
import styles from './ReviewsPage.module.css';

export default function ReviewsPage() {
	return (
		<div className={styles.container}>
			<h1>Отзывы</h1>
			<h2>Впечатления наших гостей</h2>
			<p>
				Отзывы - способ передать другим людям свои эмоции о заведении и
				блюдах
			</p>
			<Marquee<IReview>
				className={styles.marquee}
				data={fiveStarReviews}
				rowsCount={4}
				style={{ animationDuration: '300s' }}
			>
				{Review}
			</Marquee>
			<div className={styles.reviews}>
				{fiveStarReviews.map(review => (
					<Review key={review.name} {...review} />
				))}
			</div>
		</div>
	);
}
