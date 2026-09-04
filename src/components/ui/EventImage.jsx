import { defaultEventImage, getEventImage, getEventImageAlt } from '../../utils/eventImages';

const EventImage = ({ event, className = '', width = 640, height = 400, loading = 'lazy' }) => {
  const handleError = (imageEvent) => {
    const image = imageEvent.currentTarget;
    if (image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = 'true';
    image.src = defaultEventImage;
  };

  return (
    <img
      src={getEventImage(event)}
      alt={getEventImageAlt(event)}
      width={width}
      height={height}
      loading={loading}
      className={className}
      onError={handleError}
    />
  );
};

export default EventImage;
