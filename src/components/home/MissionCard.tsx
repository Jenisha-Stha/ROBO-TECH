import './MissionCard.css';

interface MissionCardProps {
    image: string;
    badge?: string;
    category: string;
    title: string;
    description: string;
    tags: string[];
}

const MissionCard = ({
    image,
    badge = 'Free',
    category,
    title,
    description,
    tags,
}: MissionCardProps) => {
    return (
        <article className="mission-card">
            <div className="card-image-wrapper">
                <img src={image} alt={title} className="card-image" />
                {badge && <span className="card-badge">{badge}</span>}
            </div>
            <div className="card-content">
                <p className="card-category">{category}</p>
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
                <div className="card-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
                <button className="card-button">
                    Join Mission <span>→</span>
                </button>
            </div>
        </article>
    );
};

export default MissionCard;
