export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  formats: string[];
  tags: string[];
  isbn: string;
  color: string;
  cover: { bg: string; fg: string; accent: string; style: 'bands' | 'circle' | 'lines' | 'dots' | 'arc' | 'grid' | 'sun' | 'wave' };
  badge?: string;
  description: string;
  chapters: string[];
  hidden?: boolean;
};

export type Collection = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  ids: string[];
  count: string;
};

export const categories = [
  'All books',
  'Fiction',
  'Self-Growth',
  'Poetry',
  'Academic',
  'African Literature',
  'Rare Finds',
];

export const categoryIcons: Record<string, string> = {
  'All books': 'grid-outline',
  Fiction: 'book-outline',
  'Self-Growth': 'leaf-outline',
  Poetry: 'pencil-outline',
  Academic: 'school-outline',
  'African Literature': 'earth-outline',
  'Rare Finds': 'diamond-outline',
};

export const books: Book[] = [
  {
    id: 'atomic',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Growth',
    price: 12.99,
    originalPrice: 18.99,
    rating: 4.9,
    reviews: 2840,
    formats: ['ePub', 'PDF', 'Audiobook'],
    tags: ['habits', 'productivity', 'goals', 'focus'],
    isbn: '9780735211292',
    color: '#f0eee6',
    cover: { bg: '#f6f1e6', fg: '#1f2420', accent: '#d66945', style: 'dots' },
    badge: 'Bestseller',
    description:
      'Remarkable results begin with remarkably small changes. Discover a practical framework for getting one percent better every day, building good habits, and making time for what matters most.',
    chapters: [
      'The surprising power of tiny habits',
      'Forget about goals. Build a system.',
      'Make it obvious',
      'Make it attractive',
      'Make it easy',
      'Make it satisfying',
    ],
  },
  {
    id: 'midnight',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    category: 'Fiction',
    price: 10.99,
    originalPrice: 15.99,
    rating: 4.8,
    reviews: 1926,
    formats: ['ePub', 'PDF', 'Audiobook'],
    tags: ['hope', 'possibility', 'comfort', 'life', 'escape'],
    isbn: '9780525559474',
    color: '#e9e8f0',
    cover: { bg: '#1d2340', fg: '#f3efe4', accent: '#e8c56d', style: 'circle' },
    badge: 'Most loved',
    description:
      'Between life and death there is a library, and within that library, the shelves go on forever. Nora Seed finds herself with the chance to try the lives she might have lived in this moving exploration of possibility and what makes a life worth living.',
    chapters: [
      'A library of possibilities',
      'The weight of regret',
      'A different kind of life',
      'Finding your way back',
      'The life that is yours',
    ],
  },
  {
    id: 'creative',
    title: 'The Creative Act',
    author: 'Rick Rubin',
    category: 'Self-Growth',
    price: 14.99,
    originalPrice: 22,
    rating: 4.9,
    reviews: 1438,
    formats: ['ePub', 'PDF', 'Audiobook'],
    tags: ['creativity', 'art', 'inspiration', 'mindfulness', 'curiosity'],
    isbn: '9780593652886',
    color: '#eeeee5',
    cover: { bg: '#fbfaf6', fg: '#161616', accent: '#161616', style: 'lines' },
    badge: "Editor's pick",
    description:
      'Creativity is not a rare ability. It is a way of being. Rick Rubin invites us into a thoughtful, generous exploration of the creative process—and shows us how to make a little more room for possibility in our everyday lives.',
    chapters: [
      'Everyone is a creator',
      'Tuning in',
      'Awareness and the vessel',
      'The source of creativity',
      'Nothing is static',
      'The art of noticing',
    ],
  },
  {
    id: 'things',
    title: 'Things Fall Apart',
    author: 'Chinua Achebe',
    category: 'African Literature',
    price: 8.99,
    rating: 4.8,
    reviews: 2184,
    formats: ['ePub', 'PDF'],
    tags: ['classics', 'africa', 'culture', 'history', 'identity'],
    isbn: '9780385474542',
    color: '#f2e7db',
    cover: { bg: '#b4512f', fg: '#fbf1e4', accent: '#f1c27d', style: 'bands' },
    description:
      'A landmark of African literature, this powerful novel follows Okonkwo, a respected Igbo warrior, as the world he knows begins to change. A deeply human story of community, tradition, and the complex legacy of colonialism.',
    chapters: [
      'A world in balance',
      'The rhythms of Umuofia',
      'Tradition and belonging',
      'A changing world',
      'Reading the legacy',
    ],
  },
  {
    id: 'ikigai',
    title: 'Ikigai',
    author: 'Héctor García & Francesc Miralles',
    category: 'Self-Growth',
    price: 9.99,
    originalPrice: 14.99,
    rating: 4.7,
    reviews: 1652,
    formats: ['ePub', 'PDF', 'Audiobook'],
    tags: ['purpose', 'mindfulness', 'wellbeing', 'calm', 'goals'],
    isbn: '9780143130727',
    color: '#e3edf0',
    cover: { bg: '#dfe9ec', fg: '#223640', accent: '#d9564a', style: 'sun' },
    description:
      'What is your reason for getting up in the morning? Explore the Japanese concept of ikigai through simple insights into purpose, connection, gentle movement, and the everyday joy of a life well lived.',
    chapters: [
      'Finding your reason for being',
      'The art of staying young',
      'Flow in everyday life',
      'Lessons from the longest-lived',
      'A gentle daily practice',
    ],
  },
  {
    id: 'milk',
    title: 'Milk and Honey',
    author: 'Rupi Kaur',
    category: 'Poetry',
    price: 7.99,
    rating: 4.7,
    reviews: 1279,
    formats: ['ePub', 'PDF'],
    tags: ['poetry', 'healing', 'love', 'emotions', 'comfort'],
    isbn: '9781449474256',
    color: '#ece9e5',
    cover: { bg: '#1b1b1b', fg: '#f4efe8', accent: '#f4efe8', style: 'arc' },
    badge: 'A little soul food',
    description:
      'A collection of poetry and prose about survival, tenderness, and finding beauty in unexpected places. Four intimate movements explore the experience of hurting, loving, breaking, and healing.',
    chapters: ['The hurting', 'The loving', 'The breaking', 'The healing', 'A space for reflection'],
  },
  {
    id: 'body',
    title: 'The Body Keeps the Score',
    author: 'Bessel van der Kolk',
    category: 'Academic',
    price: 13.99,
    rating: 4.8,
    reviews: 967,
    formats: ['ePub', 'PDF', 'Audiobook'],
    tags: ['psychology', 'science', 'healing', 'research'],
    isbn: '9780143127741',
    color: '#e4eae9',
    cover: { bg: '#2f4f55', fg: '#eef4f2', accent: '#9fc4bd', style: 'wave' },
    description:
      'An accessible exploration of how difficult experiences can affect the body and mind, and the many approaches people use to find a path toward recovery. An illuminating read for the curious, with ideas to discuss with qualified professionals.',
    chapters: [
      'The body and the mind',
      'Understanding our responses',
      'Connection and memory',
      'Pathways to recovery',
      'Further reading',
    ],
  },
  {
    id: 'alchemist',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Rare Finds',
    price: 8.99,
    originalPrice: 12.99,
    rating: 4.8,
    reviews: 3026,
    formats: ['ePub', 'PDF', 'Audiobook'],
    tags: ['adventure', 'purpose', 'dreams', 'classics', 'inspiration'],
    isbn: '9780061122415',
    color: '#f2e5d8',
    cover: { bg: '#e9c78a', fg: '#3a2a16', accent: '#c25d3a', style: 'grid' },
    description:
      'Follow Santiago, an Andalusian shepherd, on a journey in search of a worldly treasure. Along the way, he discovers that the most extraordinary things can only be understood by listening closely to the heart.',
    chapters: [
      'A dream worth following',
      'Setting out',
      'Learning from the journey',
      'Listening to the heart',
      'The treasure within',
    ],
  },
];

export const collections: Collection[] = [
  {
    id: 'quiet',
    title: 'A quieter kind of living',
    subtitle: 'Slow down. Find your center.',
    color: '#e7eee4',
    icon: 'leaf-outline',
    ids: ['ikigai', 'creative', 'milk'],
    count: '3 thoughtful reads',
  },
  {
    id: 'possibility',
    title: 'Lives you haven’t lived',
    subtitle: 'Escape into a little possibility.',
    color: '#e8e6f1',
    icon: 'moon-outline',
    ids: ['midnight', 'alchemist'],
    count: '2 unforgettable journeys',
  },
  {
    id: 'africa',
    title: 'Stories that stay with you',
    subtitle: 'New perspectives. Lasting impressions.',
    color: '#f0e3d7',
    icon: 'earth-outline',
    ids: ['things', 'body', 'milk'],
    count: '3 perspective-shifting reads',
  },
  {
    id: 'becoming',
    title: 'The art of becoming',
    subtitle: 'Small steps, beautiful beginnings.',
    color: '#e9ecd8',
    icon: 'sparkles-outline',
    ids: ['atomic', 'creative', 'ikigai'],
    count: '3 books for your next chapter',
  },
];

export const money = (n: number) => '$' + n.toFixed(2);

export const samplePages = (b: Book) => [
  {
    title: 'Before you begin',
    body: `${b.title}\nA Lumière reading companion\n\nEvery good book begins a conversation. This original editorial guide is an invitation to slow down, notice what resonates, and make the reading experience your own.\n\n${b.description}\n\nThis five-page companion is written by Lumière. It is not an excerpt from the book and does not contain the author's original text.`,
  },
  {
    title: 'A little context',
    body: `${b.author} invites readers to explore ${b.tags.slice(0, 3).join(', ')}. As you settle into this book, consider what drew you to it. A question? A recommendation? A feeling that it arrived at just the right moment?\n\nThere is no perfect way to read. You might move quickly through the story or stay with a single idea for a while. Both are worthwhile.\n\nKeep a notebook nearby. Write down your questions before trying to answer them.`,
  },
  {
    title: 'Things to notice',
    body: 'Pay attention to the small details: the patterns, the contrasts, the ideas that repeat.\n\n• What surprised you in your first encounter with the book?\n\n• Which of its themes feels closest to your own life?\n\n• What perspective is different from your own?\n\n• Where do you find yourself agreeing—or disagreeing?\n\nCuriosity is more useful than certainty. Give yourself permission to change your mind.',
  },
  {
    title: 'Make it personal',
    body: 'A reading ritual can be beautifully simple. Choose a comfortable place. Set your phone aside. Give the book fifteen uninterrupted minutes.\n\nAfter reading, write one sentence that captures what stayed with you. Not a summary, but a feeling, an image, or a possibility.\n\nIf you are reading with a friend, exchange questions instead of conclusions. Start with: “What did you notice that I might have missed?”\n\nLet the conversation take its own shape.',
  },
  {
    title: 'Your next chapter',
    body: `Take a moment to return to the question you started with. Has it changed?\n\nBooks do not always offer answers. Sometimes they give us better questions, a little company, or a new way of seeing an ordinary day.\n\nExplore more ${b.category.toLowerCase()} on your Lumière shelf, or ask The Book Curator to help you find your next read.\n\nThank you for reading with us.\n\nLumière — A little light. A whole new world.`,
  },
];
