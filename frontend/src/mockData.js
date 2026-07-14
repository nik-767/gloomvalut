// Mock data matching the Django backend models (User, Destination, Review, Profile, Follow, Tag)

export const initialUsers = [
  { id: 1, username: 'castle_explorer', email: 'explorer@gloomvault.com', isCurrentUser: true },
  { id: 2, username: 'vlad_drac', email: 'vlad@transylvania.org', isCurrentUser: false },
  { id: 3, username: 'ludwig_ii', email: 'ludwig@neuschwanstein.de', isCurrentUser: false },
  { id: 4, username: 'king_arthur', email: 'arthur@camelot.org', isCurrentUser: false }
];

export const initialProfiles = [
  {
    id: 1,
    userId: 1,
    bio: 'Castle enthusiast & explorer. Traveling the world to discover forgotten fortresses and gothic architectural marvels.',
    picUrl: '', // Using styled initials placeholder
    created: '2026-01-15T10:00:00Z'
  },
  {
    id: 2,
    userId: 2,
    bio: 'Owner of Bran Castle. Prefers late-night tours. Fascinated by dark gothic aesthetics. Strictly no garlic allowed.',
    picUrl: '',
    created: '2026-02-10T14:30:00Z'
  },
  {
    id: 3,
    userId: 3,
    bio: 'The Dream King. Builder of fairytale palaces. Patron of the arts and romanticism. Living in my own imagination.',
    picUrl: '',
    created: '2026-03-01T09:15:00Z'
  },
  {
    id: 4,
    userId: 4,
    bio: 'Warden of Camelot. Guardian of chivalry and ancient fortresses. Looking for structural marvels and historic towers.',
    picUrl: '',
    created: '2026-04-12T16:45:00Z'
  }
];

export const initialTags = [
  { id: 1, name: 'Gothic' },
  { id: 2, name: 'Spooky' },
  { id: 3, name: 'Fairytale' },
  { id: 4, name: 'Cliffside' },
  { id: 5, name: 'Island' },
  { id: 6, name: 'Medieval' },
  { id: 7, name: 'Scenic' },
  { id: 8, name: 'Ruins' }
];

export const initialDestinations = [
  {
    id: 1,
    posted_by: 2, // vlad_drac
    castle: 'Bran Castle',
    country: 'Romania',
    description: 'Perched dramatically on a cliff in Transylvania, this legendary 14th-century fortress is famously linked to Dracula. Winding stone staircases, wood-carved chambers, and chilling medieval displays create an unmatched gothic atmosphere.',
    atmosphere: 4.9,
    tagIds: [1, 2, 4],
    imageUrl: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    posted_by: 3, // ludwig_ii
    castle: 'Neuschwanstein Castle',
    country: 'Germany',
    description: 'A masterpiece of Romanesque Revival architecture sitting high in the Bavarian Alps. Originally built as a retreat for the reclusive King Ludwig II, its dreamlike silhouette famously inspired the Disney Sleeping Beauty castle.',
    atmosphere: 4.8,
    tagIds: [3, 7],
    imageUrl: 'https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    posted_by: 1, // castle_explorer
    castle: 'Mont Saint-Michel',
    country: 'France',
    description: 'A spectacular medieval abbey-fortress rising from a tidal island off the coast of Normandy. Surrounded by shifting sands and dramatic tides, it appears as a floating castle twice a day.',
    atmosphere: 4.7,
    tagIds: [5, 6, 7],
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    posted_by: 4, // king_arthur
    castle: 'Tintagel Castle Ruins',
    country: 'United Kingdom',
    description: 'Set on the wild, windswept coastline of North Cornwall, these spectacular cliffside ruins are steeped in Arthurian legend and myth. Rich in history and dramatic coastal views.',
    atmosphere: 4.5,
    tagIds: [4, 6, 8],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  }
];

export const initialReviews = [
  {
    id: 1,
    comment: 'The twilight hours here are unmatched. Winding corridors feel like stepping back into Dracula\'s time. Highlight of Romania!',
    rating: 5,
    userId: 1, // castle_explorer
    destinationId: 1 // Bran Castle
  },
  {
    id: 2,
    comment: 'A bit drafty and dark. And the owner had some weird rules about not using garlic or mirrors. Great view though.',
    rating: 4,
    userId: 3, // ludwig_ii
    destinationId: 1 // Bran Castle
  },
  {
    id: 3,
    comment: 'Pure magic. The Alpine backdrop and detailed wood carvings inside are breathtaking. Feels like walking through a dream.',
    rating: 5,
    userId: 1, // castle_explorer
    destinationId: 2 // Neuschwanstein Castle
  },
  {
    id: 4,
    comment: 'Too cheerful and too many tourists. Needs more secret passages and damp dungeons. Needs a goth redesign.',
    rating: 3,
    userId: 2, // vlad_drac
    destinationId: 2 // Neuschwanstein Castle
  },
  {
    id: 5,
    comment: 'The way the tide completely isolates this medieval sanctuary from the mainland is spectacular. A marvel of engineering!',
    rating: 5,
    userId: 3, // ludwig_ii
    destinationId: 3 // Mont Saint-Michel
  },
  {
    id: 6,
    comment: 'Stunning cliff walks! The bridge connecting to the main island makes you feel like you are walking on the edge of the world.',
    rating: 5,
    userId: 1, // castle_explorer
    destinationId: 4 // Tintagel Castle Ruins
  }
];

export const initialFollows = [
  { id: 1, followerId: 1, followingId: 2 }, // explorer follows vlad_drac
  { id: 2, followerId: 1, followingId: 3 }, // explorer follows ludwig_ii
  { id: 3, followerId: 2, followingId: 1 }, // vlad_drac follows explorer
  { id: 4, followerId: 3, followingId: 1 }, // ludwig_ii follows explorer
  { id: 5, followerId: 4, followingId: 1 }  // king_arthur follows explorer
];
