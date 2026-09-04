import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import PageHero from '../components/ui/PageHero';

Modal.setAppElement('#root');
const images = ['https://i.postimg.cc/qvtqJv1S/IMG-0946.jpg','https://i.postimg.cc/ZnT04PQx/IMG-1135.jpg','https://i.postimg.cc/Bn1ZWw6G/IMG-0895.jpg','https://i.postimg.cc/NjVymHyQ/IMG-1269.jpg','https://i.postimg.cc/5yny0Ydd/IMG-1133.jpg','https://i.postimg.cc/WpX10kKx/IMG-0911.jpg','https://i.postimg.cc/P5BxPncx/IMG-0944.jpg','https://i.postimg.cc/sDg1Lc7V/IMG-1180.jpg','https://i.postimg.cc/CMNzJtZP/IMG-1227.jpg'];

const GalleryPage = () => {
  const [selected, setSelected] = useState(null);
  return <><PageHero variant="gallery" eyebrow="Gallery" title="Moments of learning, conversation and possibility." description="A look back at Career Valley events and student experiences." /><section className="section"><div className="site-container columns-1 gap-4 sm:columns-2 lg:columns-3">{images.map((image, index) => <button key={image} type="button" className="group mb-4 block w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface-muted)]" onClick={() => setSelected({ image, index })} aria-label={`Open gallery image ${index + 1}`}><img src={image} alt={`Students and educators at a Career Valley event, image ${index + 1}`} width="600" height="450" loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-[1.03]" /></button>)}</div></section><Modal isOpen={Boolean(selected)} onRequestClose={() => setSelected(null)} contentLabel="Gallery image" className="modal-content2 !w-[min(960px,100%)] !bg-[#102c27] !p-3" overlayClassName="modal-overlay"><button type="button" onClick={() => setSelected(null)} className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/60 text-white" aria-label="Close image"><FiX /></button>{selected && <img src={selected.image} alt={`Career Valley event, enlarged image ${selected.index + 1}`} className="max-h-[82vh] w-full rounded-xl object-contain" />}</Modal></>;
};
export default GalleryPage;
