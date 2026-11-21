export const catalystEvents = [
 ['2026-12-02','Hyderabad','Hotel Hyatt'],
 ['2026-12-04','Vijayawada','Quality Hotel DV Manor'],
 ['2026-12-08','Vizag','Novotel Visakhapatnam'],
 ['2026-12-11','Bangalore','Fortune Select JP Cosmos'],
 ['2026-12-15','Mysuru','Grand Mercure'],
 ['2026-12-18','Kochi','Abad Plaza'],
 ['2027-01-07','Pune','Lemon Tree Premier, Pune'],
 ['2027-01-19','Jabalpur','Hotel Narmada Jackson'],
 ['2027-01-22','Bhopal','Hotel Centre Park'],
 ['2027-01-29','Jaipur','Leisure Inn Grand Chanakya'],
 ['2027-02-02','Delhi','Hotel The Park'],
 ['2027-02-05','Chandigarh','Hotel Hyatt'],
 ['2027-02-12','Ahmedabad','Fortune Landmark'],
].map(([date,city,venue])=>({id:`catalyst-${date}`,date,city,venue,title:'Career Catalyst 4.0',image:'/events/career-catalyst-4-calendar.jpeg',time:'Time to be announced'}));
export const calendarDate = date => new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`));
export const calendarDay = date => new Intl.DateTimeFormat('en-IN',{weekday:'long',timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`));
