export function findTrailer(videos = []) {
    const youtube = (video) => video.site === 'YouTube';

    return videos.find((video) => video.type === 'Trailer' && video.official === true && youtube(video))
        ?? videos.find((video) => video.type === 'Trailer' && youtube(video))
        ?? videos.find((video) => video.type === 'Teaser' && youtube(video))
        ?? null;
}
