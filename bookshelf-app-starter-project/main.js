// Data storage key
const STORAGE_KEY = "BOOKSHELF_APPS";

// Initialize books array
let books = [];

// DOM Elements
const bookForm = document.getElementById("bookForm");
const searchForm = document.getElementById("searchBook");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");

// Fungsi Load books from localStorage
function loadBooks() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  books = JSON.parse(serializedData) || [];
  renderBooks();
}

// Menyimpan buku di localStorage
function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  renderBooks();
}

// Fungsi Generate unique ID
function generateId() {
  return +new Date();
}

// Create book object
function createBook(title, author, year, isComplete) {
  return {
    id: generateId(),
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

// Render single book
function createBookElement(book) {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">
        ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
      </button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  // Add event listeners
  const toggleButton = bookItem.querySelector(
    '[data-testid="bookItemIsCompleteButton"]'
  );
  const deleteButton = bookItem.querySelector(
    '[data-testid="bookItemDeleteButton"]'
  );
  const editButton = bookItem.querySelector(
    '[data-testid="bookItemEditButton"]'
  );

  toggleButton.onclick = () => toggleBookStatus(book.id);
  deleteButton.onclick = () => deleteBook(book.id);
  editButton.onclick = () => editBook(book.id);

  return bookItem;
}

// Fungsi Render all books
function renderBooks(filteredBooks = null) {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  const booksToRender = filteredBooks || books;

  booksToRender.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  });
}

// Fungsi Menambahkan buku baru
function addBook(e) {
  e.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const book = createBook(title, author, year, isComplete);
  books.push(book);
  saveBooks();
  bookForm.reset();
}

// Toggle book status
function toggleBookStatus(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  books[bookIndex].isComplete = !books[bookIndex].isComplete;
  saveBooks();
}

// Fungsi Hapus buku
function deleteBook(bookId) {
  if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
    books = books.filter((book) => book.id !== bookId);
    saveBooks();
  }
}

// Fungsi Edit buku
function editBook(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;

    // Remove the old book
    books = books.filter((b) => b.id !== bookId);
    saveBooks();
  }
}

// Fungsi Cari Buku
function searchBooks(e) {
  e.preventDefault();
  const searchTerm = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  if (searchTerm) {
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm)
    );
    renderBooks(filteredBooks);
  } else {
    renderBooks();
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", loadBooks);
bookForm.addEventListener("submit", addBook);
searchForm.addEventListener("submit", searchBooks);
