import { useParams } from 'react-router-dom';
import MediaDetails from '../components/MediaDetails';

function SerieDetails() {
  const { id } = useParams();

  return <MediaDetails key={id} type="tv" />;
}

export default SerieDetails;
