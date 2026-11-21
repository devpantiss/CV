import { useState } from 'react';
import { FiImage, FiHeadphones, FiPlay } from 'react-icons/fi';
import { youtubeVideo } from './media';

export default function MediaPreview({ item, controls = false }) {
  const [failed, setFailed] = useState(false);
  if (item.mediaType === 'podcast') {
    const video = youtubeVideo(item.youtubeUrl);
    return <div className="gallery-podcast-thumbnail">{video && !failed ? <img src={video.thumbnail} alt={`Thumbnail for ${item.title || 'podcast'}`} loading="lazy" onError={() => setFailed(true)} /> : <div className="gallery-media-placeholder"><FiHeadphones /><span>Podcast on YouTube</span></div>}<span className="gallery-play-icon"><FiPlay aria-hidden="true" /></span></div>;
  }
  if (item.mediaType === 'video') return controls ? <video src={item.url} controls preload="metadata" playsInline aria-label={item.title} /> : <div className="gallery-media-placeholder"><FiPlay /><span>Video file</span></div>;
  if (item.mediaType === 'audio') return <div className="gallery-audio-preview"><FiHeadphones />{controls ? <audio src={item.url} controls preload="metadata" aria-label={item.title} /> : <span>Audio file</span>}</div>;
  return item.url && !failed ? <img src={item.url} alt={item.title || 'Gallery image'} loading="lazy" onError={() => setFailed(true)} /> : <div className="gallery-media-placeholder"><FiImage /><span>{item.url ? 'Image unavailable' : 'Choose a file to preview'}</span></div>;
}
