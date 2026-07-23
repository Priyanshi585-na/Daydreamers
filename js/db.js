const DB_STORAGE_KEY = "daydreamers_campus_shelf_v1";

const SAMPLE_CAMPUS_LISTINGS = [
  {
    id: "campus-101",
    openLibraryId: "OL27479W",
    isbn: "9780007525546",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "fiction",
    listerName: "Rohan",
    listerYear: "3rd yr",
    condition: "Good condition",
    type: "Lend",
    price: "Free",
    status: "Available",
    phone: "919876543210"
  },
  {
    id: "campus-102",
    openLibraryId: "OL82586W",
    isbn: "9780061120084",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "fiction",
    listerName: "Meera",
    listerYear: "1st yr",
    condition: "Like new",
    type: "Sell",
    price: "₹180",
    status: "Available",
    phone: "919876543211"
  },
  {
    id: "campus-103",
    openLibraryId: "OL21172081M",
    isbn: "9780132350884",
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "textbooks",
    listerName: "Aisha",
    listerYear: "2nd yr",
    condition: "Well-loved",
    type: "Lend",
    price: "Free",
    status: "Reserved", // Filtered out from public shelf
    phone: "919876543212"
  },
  {
    id: "campus-104",
    openLibraryId: "OL262758W",
    isbn: "9780441172719",
    title: "Dune",
    author: "Frank Herbert",
    genre: "science",
    listerName: "Arjun",
    listerYear: "4th yr",
    condition: "Like new",
    type: "Sell",
    price: "₹220",
    status: "Available",
    phone: "919876543213"
  }
];

const CampusDB = {
  getAll() {
    try {
      const data = localStorage.getItem(DB_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(SAMPLE_CAMPUS_LISTINGS));
        return SAMPLE_CAMPUS_LISTINGS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading from CampusDB:", e);
      return SAMPLE_CAMPUS_LISTINGS;
    }
  },


  getAvailable() {
    return this.getAll().filter(item => item.status === "Available");
  },

 

  addListing(newBook) {
    const listings = this.getAll();
    const formattedListing = {
      id: `campus-${Date.now()}`,
      status: "Available",
      createdAt: new Date().toISOString(),
      ...newBook
    };

    listings.unshift(formattedListing); 
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(listings));
    return formattedListing;
  },


  query({ text = "", genre = null, condition = null, type = null }) {
    let results = this.getAvailable();

    if (text.trim()) {
      const queryStr = text.toLowerCase();
      results = results.filter(b => 
        (b.title && b.title.toLowerCase().includes(queryStr)) ||
        (b.author && b.author.toLowerCase().includes(queryStr)) ||
        (b.listerName && b.listerName.toLowerCase().includes(queryStr))
      );
    }

    if (genre) {
      results = results.filter(b => b.genre === genre);
    }

    if (condition) {
      results = results.filter(b => b.condition === condition);
    }

    if (type) {
      results = results.filter(b => b.type === type);
    }

    return results;
  },


  reset() {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(SAMPLE_CAMPUS_LISTINGS));
    return SAMPLE_CAMPUS_LISTINGS;
  }
};