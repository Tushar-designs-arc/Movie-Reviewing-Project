const movies = [
  {
    id: 1,
    title: "Dune: Part Two",
    year: 2024,
    runtime: "2h 46m",
    rating: 8.7,
    criticsScore: 92,
    audienceScore: 95,
    reviewCount: "312k ratings",
    genre: ["Sci-Fi", "Adventure", "Epic"],
    language: "English",
    certificate: "UA 13+",
    director: "Denis Villeneuve",
    cast: ["Timothee Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"],
    status: "Now Streaming",
    trendRank: "#1 This Week",
    releaseDate: "March 1, 2024",
    boxOffice: "$711M",
    availability: ["Cinemate Direct", "Apple TV", "Prime Video"],
    poster:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1600&q=80",
    logline: "Paul Atreides steps into prophecy as the desert war for Arrakis erupts.",
    overview:
      "A mythic sci-fi spectacle about power, revenge, and faith, Dune: Part Two balances colossal scale with intimate character stakes and relentless tension.",
    editorialNote:
      "The kind of event cinema that demands a giant screen and a full sound system.",
    keywords: ["Desert uprising", "Political intrigue", "IMAX spectacle"],
    reviews: [
      {
        author: "Aarav Mehta",
        role: "Senior Critic",
        text: "Massive in scale but still deeply personal. Every frame feels engineered for awe.",
      },
      {
        author: "Naina Sethi",
        role: "Community Curator",
        text: "The action hits hard, but the worldbuilding is what keeps you glued all the way through.",
      },
    ],
  },
  {
    id: 2,
    title: "Oppenheimer",
    year: 2023,
    runtime: "3h 0m",
    rating: 8.3,
    criticsScore: 93,
    audienceScore: 91,
    reviewCount: "420k ratings",
    genre: ["Drama", "Biography", "History"],
    language: "English",
    certificate: "A",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    status: "Top Rated",
    trendRank: "#2 This Week",
    releaseDate: "July 21, 2023",
    boxOffice: "$975M",
    availability: ["Cinemate Direct", "Prime Video", "BookMyShow Stream"],
    poster:
      "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=700&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1516849677043-ef67c9557e16?auto=format&fit=crop&w=1600&q=80",
    logline: "The mind behind the atomic bomb wrestles with ambition, guilt, and history.",
    overview:
      "A dense, propulsive character study that turns scientific obsession into courtroom tension and psychological thriller energy.",
    editorialNote:
      "Precision filmmaking with thunderous sound design and a career-best central performance.",
    keywords: ["Awards giant", "Moral conflict", "Biographical thriller"],
    reviews: [
      {
        author: "Rhea Kapur",
        role: "Awards Editor",
        text: "It moves like a thriller while carrying the weight of a national reckoning.",
      },
      {
        author: "Dev Arora",
        role: "Community Curator",
        text: "Even at three hours, the pacing never relaxes. The final hour is electric.",
      },
    ],
  },
  {
    id: 3,
    title: "Spider-Man: Across the Spider-Verse",
    year: 2023,
    runtime: "2h 20m",
    rating: 8.6,
    criticsScore: 95,
    audienceScore: 94,
    reviewCount: "286k ratings",
    genre: ["Animation", "Action", "Adventure"],
    language: "English",
    certificate: "U/A",
    director: "Joaquim Dos Santos",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Brian Tyree Henry"],
    status: "Fan Favorite",
    trendRank: "#3 This Week",
    releaseDate: "June 2, 2023",
    boxOffice: "$690M",
    availability: ["Cinemate Direct", "Netflix", "Apple TV"],
    poster:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1600&q=80",
    logline: "Miles Morales leaps across worlds where every decision rewrites the story.",
    overview:
      "A kaleidoscopic superhero adventure bursting with style, heart, and some of the most inventive animation in mainstream cinema.",
    editorialNote:
      "Restless, funny, emotional, and visually unlike anything else on the board.",
    keywords: ["Multiverse chaos", "Animated event", "Teen hero"],
    reviews: [
      {
        author: "Kabir Shah",
        role: "Animation Beat",
        text: "Every universe has its own visual language, and somehow it all sings together.",
      },
      {
        author: "Misha Rao",
        role: "Community Curator",
        text: "You leave wanting to rewind specific scenes just to study the craft.",
      },
    ],
  },
  {
    id: 4,
    title: "The Batman",
    year: 2022,
    runtime: "2h 56m",
    rating: 7.8,
    criticsScore: 85,
    audienceScore: 87,
    reviewCount: "354k ratings",
    genre: ["Action", "Crime", "Mystery"],
    language: "English",
    certificate: "UA 16+",
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoe Kravitz", "Paul Dano", "Jeffrey Wright"],
    status: "Dark Pick",
    trendRank: "#4 This Week",
    releaseDate: "March 4, 2022",
    boxOffice: "$772M",
    availability: ["Cinemate Direct", "Max", "Apple TV"],
    poster:
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=700&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80",
    logline: "A young Bruce Wayne hunts corruption in a rain-soaked Gotham under siege.",
    overview:
      "A noir-heavy detective thriller that strips Batman back to obsession, atmosphere, and bruising street-level danger.",
    editorialNote:
      "A moody crime procedural first, superhero movie second, and that is exactly why it works.",
    keywords: ["Neo-noir", "Serial killer case", "Gothic city"],
    reviews: [
      {
        author: "Yash Malhotra",
        role: "Crime Cinema Writer",
        text: "Rain, neon, and dread. Gotham has rarely felt this fully realized.",
      },
      {
        author: "Tara Menon",
        role: "Community Curator",
        text: "The detective angle makes it rewatchable in a way most comic-book movies are not.",
      },
    ],
  },
  {
    id: 5,
    title: "Past Lives",
    year: 2023,
    runtime: "1h 45m",
    rating: 8.0,
    criticsScore: 96,
    audienceScore: 89,
    reviewCount: "102k ratings",
    genre: ["Drama", "Romance"],
    language: "Korean / English",
    certificate: "UA 13+",
    director: "Celine Song",
    cast: ["Greta Lee", "Teo Yoo", "John Magaro", "Moon Seung-ah"],
    status: "Critics Pick",
    trendRank: "#5 This Week",
    releaseDate: "June 23, 2023",
    boxOffice: "$42M",
    availability: ["Cinemate Direct", "MUBI", "Prime Video"],
    poster:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=700&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
    logline: "Two childhood friends reconnect across decades, cities, and the lives they chose.",
    overview:
      "A quietly devastating romance about timing, migration, and the versions of ourselves that remain unfinished.",
    editorialNote:
      "Minimal on the surface, emotionally enormous underneath it.",
    keywords: ["Tender drama", "Longing", "Festival favorite"],
    reviews: [
      {
        author: "Ira Bansal",
        role: "Festival Editor",
        text: "Soft-spoken, specific, and absolutely crushing in the best way.",
      },
      {
        author: "Ritwik Sen",
        role: "Community Curator",
        text: "The final ten minutes land like a memory you thought you had moved past.",
      },
    ],
  },
  {
    id: 6,
    title: "Mad Max: Fury Road",
    year: 2015,
    runtime: "2h 0m",
    rating: 8.1,
    criticsScore: 97,
    audienceScore: 86,
    reviewCount: "510k ratings",
    genre: ["Action", "Adventure", "Thriller"],
    language: "English",
    certificate: "A",
    director: "George Miller",
    cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult", "Rosie Huntington-Whiteley"],
    status: "Action Canon",
    trendRank: "#6 This Week",
    releaseDate: "May 15, 2015",
    boxOffice: "$380M",
    availability: ["Cinemate Direct", "Netflix", "Apple TV"],
    poster:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=700&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
    logline: "A breakneck escape through the wasteland becomes a masterclass in cinematic momentum.",
    overview:
      "Practical stunt work, mythic imagery, and relentless pacing combine into one of the defining action films of the century.",
    editorialNote:
      "Pure velocity, zero filler, and an all-timer chase movie structure.",
    keywords: ["Practical stunts", "Wasteland opera", "Adrenaline rush"],
    reviews: [
      {
        author: "Aman Gulati",
        role: "Action Beat",
        text: "It barely lets you breathe, and that is part of the thrill.",
      },
      {
        author: "Shivangi Das",
        role: "Community Curator",
        text: "A movie that feels handmade at an impossible scale.",
      },
    ],
  },
  {
    id: 7,
    title: "Parasite",
    year: 2019,
    runtime: "2h 12m",
    rating: 8.6,
    criticsScore: 99,
    audienceScore: 93,
    reviewCount: "915k ratings",
    genre: ["Thriller", "Drama", "Dark Comedy"],
    language: "Korean",
    certificate: "A",
    director: "Bong Joon Ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong", "Park So-dam"],
    status: "Best Picture Winner",
    trendRank: "#7 This Week",
    releaseDate: "May 30, 2019",
    boxOffice: "$262M",
    availability: ["Cinemate Direct", "MUBI", "Prime Video"],
    poster:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=700&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    logline: "A sly class satire mutates into something sharper, stranger, and unforgettable.",
    overview:
      "Pitch-black humor, precision plotting, and devastating social commentary make Parasite both wildly entertaining and impossible to shake off.",
    editorialNote:
      "Still the benchmark for films that are both crowd-pleasing and critically untouchable.",
    keywords: ["Class satire", "Twist machine", "Oscar winner"],
    reviews: [
      {
        author: "Milan Dutta",
        role: "Global Cinema Editor",
        text: "Every scene seems simple until you realize three things are happening at once.",
      },
      {
        author: "Sonal Vyas",
        role: "Community Curator",
        text: "The tonal control is unreal. It is funny until it suddenly is not.",
      },
    ],
  },
  {
    id: 8,
    title: "Interstellar",
    year: 2014,
    runtime: "2h 49m",
    rating: 8.7,
    criticsScore: 73,
    audienceScore: 86,
    reviewCount: "2.1M ratings",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    language: "English",
    certificate: "U/A",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    status: "Evergreen Favorite",
    trendRank: "#8 This Week",
    releaseDate: "November 7, 2014",
    boxOffice: "$730M",
    availability: ["Cinemate Direct", "Prime Video", "Apple TV"],
    poster:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=700&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=80",
    logline: "A desperate space mission becomes a moving story about time, memory, and love.",
    overview:
      "Huge ideas and human emotion collide in a sci-fi odyssey that remains a reliable crowd favorite a decade later.",
    editorialNote:
      "The docking sequence alone keeps this in every serious sci-fi conversation.",
    keywords: ["Space odyssey", "Emotional sci-fi", "Hans Zimmer wave"],
    reviews: [
      {
        author: "Prisha Nayar",
        role: "Sci-Fi Editor",
        text: "Big-hearted and big-brained, with images that still feel genuinely cosmic.",
      },
      {
        author: "Samar Jain",
        role: "Community Curator",
        text: "One of those films people keep revisiting because the feeling does not fade.",
      },
    ],
  },
];

const homeStats = [
  { label: "Handpicked titles", value: "8+" },
  { label: "Average user score", value: "8.4" },
  { label: "Weekly reviews", value: "4.8k" },
  { label: "Saved watchlists", value: "26k" },
];

const releaseCalendar = [
  {
    day: "Fri",
    date: "05 Apr",
    title: "Festival Spotlight",
    detail: "New critic capsules and award-season updates land at 7 PM.",
  },
  {
    day: "Sat",
    date: "06 Apr",
    title: "Action Night",
    detail: "Backend-powered watch links now launch straight into the player.",
  },
  {
    day: "Sun",
    date: "07 Apr",
    title: "Director Deep Dive",
    detail: "Editorial boards refresh with Nolan, Villeneuve, and Bong highlights.",
  },
  {
    day: "Mon",
    date: "08 Apr",
    title: "Watchlist Refresh",
    detail: "Fresh recommendations based on your saved movies and favorite genres.",
  },
];

const editorialCollections = [
  {
    title: "Awards Circuit",
    description: "Prestige dramas, major festival titles, and Oscar conversation starters.",
    accent: "from-amber-400/30 via-orange-500/10 to-transparent",
    movieIds: [2, 5, 7],
  },
  {
    title: "Midnight Adrenaline",
    description: "Nitro-charged action films made for dark rooms and loud speakers.",
    accent: "from-cyan-400/30 via-sky-500/10 to-transparent",
    movieIds: [4, 6, 1],
  },
  {
    title: "Future Worlds",
    description: "Massive sci-fi canvases, strange futures, and unforgettable soundscapes.",
    accent: "from-fuchsia-400/20 via-indigo-500/10 to-transparent",
    movieIds: [1, 3, 8],
  },
];

module.exports = {
  featuredMovieId: 1,
  streamNote:
    "Demo stream is being served through the backend API. Replace the sample mp4 with real licensed files on the server to use movie-specific playback.",
  movies,
  homeStats,
  releaseCalendar,
  editorialCollections,
};
