export const teamDefaults = [
 { name: 'Divya Rupainwar', role: 'Founder & CEO', photo: 'https://res.cloudinary.com/du3i8e0se/image/upload/v1721847900/qkvrjqtsook5wjnzbzwb.jpg', bio: 'Divya founded Career Valley in 2013 to give students more context, confidence and ownership when choosing their educational direction.', email: 'divya@thecareervalley.com' },
  { name: 'Sonali Mulay', photo: 'https://i.postimg.cc/nVjg34sd/Sonali-Mulay-expert-1.jpg' },
  { name: 'Ishita Kundu', photo: 'https://i.postimg.cc/vBjjQBKL/Ishita-Kundu-expert-1.jpg' },
  { name: 'Prof. Satya Kiran Sastry', photo: 'https://i.postimg.cc/43fjPjtt/Prof-Satya-Kiran-Sastry-expert-1.jpg' },
  { name: 'Pranab Kumar', photo: 'https://i.postimg.cc/PrZG5WTL/Pranab-kumar-Misra-expert-1.jpg' },
].map((member) => ({ ...member, role: member.role || 'Education expert' }));
export const testimonialDefaults = [
  { name: 'Saurav Singh', stage: 'Undergraduate decision', image: 'https://res.cloudinary.com/du3i8e0se/image/upload/v1723024885/saurav_nhznqm.png', challenge: 'Needed clarity on undergraduate programmes and a college choice.', support: 'Programme guidance, scholarship support and help navigating an education loan.', result: 'Moved forward with confidence at his preferred college.' },
  { name: 'Sneha Singh', stage: 'Management pathway', image: 'https://res.cloudinary.com/du3i8e0se/image/upload/v1723024924/sneha_n4jhjf.png', challenge: 'Was uncertain about the right B-school after completing her undergraduate degree.', support: 'Campus immersion, application guidance, scholarship support and education-loan assistance.', result: 'Joined Welingkar Institute of Management, Bangalore.' },
  { name: 'Abhishek', stage: 'College selection', image: 'https://res.cloudinary.com/du3i8e0se/image/upload/v1723024960/Abhisek_ib0xuw.png', challenge: 'Needed help choosing a management programme and understanding the practical trade-offs.', support: 'College guidance plus scholarship and education-loan support.', result: 'Joined Badruka School of Management with a clearer plan.' },
];
