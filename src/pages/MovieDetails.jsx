import { useParams } from 'react-router-dom';
import MediaDetails from '../components/MediaDetails';

function MovieDetails() {
  const { id } = useParams();

  return <MediaDetails key={id} type="movie" />;
}

export default MovieDetails;
