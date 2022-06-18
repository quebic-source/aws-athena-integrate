class QuizResponse {
    constructor({
                    id, title, description,  thumbnailImage, image, publishedAt, published, status,
                }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.thumbnailImage = thumbnailImage;
        this.image = image;
    }
}

module.exports = {
    QuizResponse
};