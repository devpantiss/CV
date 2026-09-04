const EVENT_IMAGES = {
  fair: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=82',
  openHouse: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=82',
  guidance: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=82',
};

const eventText = (event = {}) => `${event.title || ''} ${event.eventType || ''} ${event.programType || ''}`.toLowerCase();

export const getEventImage = (event) => {
  if (event?.image) return event.image;

  const text = eventText(event);
  if (/fair|expo|exhibition|conference|summit/.test(text)) return EVENT_IMAGES.fair;
  if (/open house|campus|college|university|undergraduate|postgraduate/.test(text)) return EVENT_IMAGES.openHouse;
  return EVENT_IMAGES.guidance;
};

export const getEventImageAlt = (event = {}) => {
  const title = event.title || 'Career Valley event';
  return `${title} event preview`;
};

export const defaultEventImage = EVENT_IMAGES.guidance;
