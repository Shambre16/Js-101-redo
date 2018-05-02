class Book {
  constructor(args) {
    this.cover = args.cover;
    this.title = args.title;
    this.author = args.author;
    this.numberOfPages = args.numberOfPages;
    this.publishDate = new Date(args.publishDate);
    this.trashcan = args.trashcan;
  }
}

// Singleton!!!!!!!!!!!!  Do not use var Singleton = before this.  It will break everything!!!

var library_instance;

class Library {
  constructor(instanceKey) {
    if (library_instance) {
      return library_instance;
    }
    this.myBooksArray = [];
    this.keyInstance = instanceKey;
    library_instance = this;
  }

  init() {
    //cache down selectors here, use $ or j, put eveything that needs to initialized here
    this.$randomBookBtn = $("#randomBook"); //a hook to my button
    this.$randomAuthorBtn = $("#randomAuthor");
    this.$searchButton = $("#searchButton");
    this.$getAuthorsBtn = $("#getAuthors");
    this.$addBookBtn = $("#addBookBtn");
    this.$deleteBookBtn = $("button.deleteBook");
    this.$deleteAuthorBtn = $("button.deleteAuthor");
    this.$addAnotherBookBtn = $("#addAnotherBookBtn");
    this.$addBookTemplate = $(".form-div form").clone();
    this.$modalAuthors = $("#modalAuthors");
    this.$tableContactBody = $("#tableContactBody");
    //Put all the things in here for added performance
    // this.$alertBtn = $("button.alert");
    // this.$changeBtn = $("button.change-text");
    // this.$logBtn = $("button.log-hello");
    this._bindEvents(); //Set up a specific event handler for each event here
    return false;
  }

  _bindEvents() {
    $("body").on("updateLibrary", $.proxy(this._handleUpdateLibrary, this));
    this.$addBookBtn.on("click", $.proxy(this._handleAddBook, this));
    this.$searchButton.on("click", $.proxy(this._handleSearch, this));
    this.$randomBookBtn.on("click", $.proxy(this._handleRandomBook, this));
    this.$randomAuthorBtn.on("click", $.proxy(this._handleRandomAuthor, this));
    this.$getAuthorsBtn.on("click", $.proxy(this._handleGetAuthors, this));
    this.$tableContactBody.on("click", "button.deleteBook", $.proxy(this._handleDelete, this));
    this.$modalAuthors.on("click", "button.deleteAuthor", $.proxy(this._handleDeleteAuthor, this));
    this.$addAnotherBookBtn.on("click", $.proxy(this._handleAddMoreBooks, this));
    return false;
  }
  _handleAddBook() {
    var covers = $(".formWebsiteInput");
    var titles = $(".formTitleInput");
    var authors = $(".formAuthorInput");
    var pages = $(".formNumberOfPagesInput");
    var dates = $(".formPublishDateInput");
    for (var i = 0; i < titles.length; i++) {
      var newBook = {};
      newBook.cover = covers[i].value;
      newBook.title = titles[i].value;
      newBook.author = authors[i].value;
      newBook.numberOfPages = pages[i].value;
      newBook.publishDate = dates[i].value;
      this.addBook(new Book(newBook));
    }
    $(".form-div").empty();
    $(".form-div").append(this.$addBookTemplate.clone());
    return true;
  }

  _handleAddMoreBooks() {
    $(".form-div").append(this.$addBookTemplate.clone());
  }

  _handleDelete(e) {
    var row = $(e.currentTarget).parent().parent();
    this.removeBookByTitle(row.children()[1].innerText);
    row.remove();
    return true;
  }

  _handleUpdateLibrary() {
    this._buildTable(this.myBooksArray);
    this.setObject("localLibraryStorage");
    return "Local storage has been updated!";
  }

  _handleRandomBook() {
    var bookObject = this.getRandomBook();
    $(".card-img-top").attr("src", bookObject.cover);
    $(".card-title").text(bookObject.title);
    $(".author-paragraph").text(bookObject.author);
    $(".numberOfPages-paragraph").text(bookObject.numberOfPages);
    $(".publishDate-paragraph").text(bookObject.publishDate);
  }

  _handleRandomAuthor() {
    $(".modal-body.author").text(this.getRandomAuthorName());
  }

  _handleGetAuthors() {
    var authorList = this.getAuthors();
    var authorListInput = "";
    for (var i = 0; i < authorList.length; i++) {
      authorListInput = authorListInput + "<li class=\"list-group-item\"><button class='deleteAuthor'>Delete this Author</button><span>" + authorList[i] + "</span></li>";
    }
    $(".list-group-item").remove();
    this.$modalAuthors.append(authorListInput);
  }

  _handleDeleteAuthor(e) {
    var author = e.currentTarget.nextElementSibling.innerText;
    this.removeBooksByAuthor(author);
    var authorList = this.getAuthors();
    var authorListInput = "";
    for (var i = 0; i < authorList.length; i++) {
      authorListInput = authorListInput + "<li class=\"list-group-item\"><button class='deleteAuthor'>Delete this Author</button><span>" + authorList[i] + "</span></li>";
    }
    $(".list-group-item").remove();
    $("#modalAuthors").append(authorListInput);
  }

  _handleSearch(e) {
    event.preventDefault();
    var searchResults = document.getElementById("searchBox").value;
    var arrayResult = this.search(searchResults);
    this._buildTable(arrayResult);
  }

  fullYear() {
    return this.publishDate.getYear();
  }

  // Add a line to the HTML table
  addLineToHTMLTable(cover, title, author, numberOfPages, publishDate, trashcan) {
    // Get the body of the table using the selector API
    var tableBody = this.$tableContactBody[0];
    // Add a new row at the end of the tablevar
    var newRow = tableBody.insertRow();
    // add  new cells to the row
    var coverCell = newRow.insertCell();
    coverCell.innerHTML = "<img src=" + cover + ">";
    var titleCell = newRow.insertCell();
    titleCell.innerHTML = title;
    var authorCell = newRow.insertCell();
    authorCell.innerHTML = author;
    var numberOfPagesCell = newRow.insertCell();
    numberOfPagesCell.innerHTML = numberOfPages;
    var publishDateCell = newRow.insertCell();
    publishDateCell.innerHTML = publishDate;
    var trashcanCell = newRow.insertCell();
    trashcanCell.innerHTML = "<button class='btn btn-info deleteBook'>X</button>";
  }

  _buildTable(books) {
    $("#tableContactBody").empty();
    for (var i = 0; i < books.length; i++) {
      var book = books[i];
      this.addLineToHTMLTable(book.cover, book.title, book.author, book.numberOfPages, book.publishDate, book.trashcan);
    }
  }
  // Run code
  addBook(book) {
    // if (book.constructor === Array) {
    //   return false;
    // }
    for (var i = 0; i < this.myBooksArray.length; i++) {
      var currentBook = this.myBooksArray[i];
      if (currentBook.title === book.title) {
        return false;
      }
    }
    this.myBooksArray.push(book);
    this.updateLibrary();
    return true;
  }

  removeBookByTitle(title) {
    for (var i = 0; i < this.myBooksArray.length; i++) {
      if (this.myBooksArray[i].title === title) {
        this.myBooksArray.splice(i, 1);
        this.updateLibrary();
        return true;
      }
    }
    return false;
  }

  removeBooksByAuthor(authorName) {
    var result = false;
    for (var i = this.myBooksArray.length - 1; i >= 0; i--) {
      if (this.myBooksArray[i].author === authorName) {
        this.myBooksArray.splice(i, 1);
        this.updateLibrary();
      }
    }
    return true;
  }

  getRandomBook() {
    if (this.myBooksArray.length == 0) {
      return null;
    }
    else {
      return this.myBooksArray[(Math.floor(Math.random() * this.myBooksArray.length))];
    }
    return true;
  }

  getBookByTitle(title) {
    var tempArray = [];
    var pattern = new RegExp(title, "i");
    for (var i = 0; i < this.myBooksArray.length; i++) {
      if (pattern.test(this.myBooksArray[i].title)) {
        tempArray.push(this.myBooksArray[i]);
      }
    }
    return tempArray;
  }

  getBooksByAuthor(authorName) {
    var tempArray = [];
    var pattern = new RegExp(authorName, "i");
    for (var i = 0; i < this.myBooksArray.length; i++) {
      if (pattern.test(this.myBooksArray[i].author)) {
        tempArray.push(this.myBooksArray[i]);
      }
    }
    return tempArray;
  }

  addBooks(books) {
    if (!books.constructor === Array) {
      return null;
    }
    var count = 0;
    for (var i = 0; i < books.length; i++) {
      if (this.addBook(books[i])) {
        count++;
      }
    }
    return count;
  }

  getAuthors() {
    var tempArray = [];
    for (var i = 0; i < this.myBooksArray.length; i++) {
      if (tempArray.indexOf(this.myBooksArray[i].author) === -1) {
        tempArray.push(this.myBooksArray[i].author);
      }
    }
    return tempArray;
  }

  getRandomAuthorName() {
    if (this.myBooksArray.length == 0) {
      return [];
    }
    else {
      return this.myBooksArray[(Math.floor(Math.random() * this.myBooksArray.length))].author;
    }
  }

  search(string) {
    return this.getBookByTitle(string).concat(this.getBooksByAuthor(string));
  }

  setObject(instanceKey) {
    localStorage.setItem(instanceKey, JSON.stringify(this.myBooksArray));
    return instanceKey + " is set!";
  }

  getObject(instanceKey) {
    var localStorageBooks = JSON.parse(localStorage.getItem(instanceKey));
    if (localStorageBooks) {
      for (var i = 0; i < localStorageBooks.length; i++) {
        var book = localStorageBooks[i];
        this.addBook(new Book(book));
      }
      return true;
    }
  }

  updateLibrary() {
    $("body").trigger("updateLibrary");
  }
}
















//Library Instance:
$(document).ready(function () { //Listen to the document and when you hear this, fire this off
  var gLib = new Library("localLibraryStorage");
  gLib.init(); //I want this to fire off all the things I want it to do right away --> Set up bind events
  gLib.getObject("localLibraryStorage");
  $(".table").tablesort({
    sortBy: ['nosort', 'text', 'text', 'numeric', 'numeric']
  });
  $("#formWebsiteInput").focus();
  gLib.addBooks(gAllBooks);
});

var gIT = new Book({
  cover: "https://upload.wikimedia.org/wikipedia/en/5/5a/It_cover.jpg",
  title: "IT",
  author: "Stephen King",
  numberOfPages: 1138,
  publishDate: "September 15, 1986",
  trashcan: "<tr></tr>"
});
// The below just allows me to test that even if I call another instance, it will be the same as the first one I created
var gIT2 = new Book({
  cover: "https://upload.wikimedia.org/wikipedia/en/5/5a/It_cover.jpg",
  title: "IT",
  author: "Stephen King",
  numberOfPages: 800,
  publishDate: "December 17, 1995",
  trashcan: ""
});
var gCatcherInTheRye = new Book({
  cover: "https://upload.wikimedia.org/wikipedia/en/thumb/3/32/Rye_catcher.jpg/220px-Rye_catcher.jpg",
  title: "The Catcher in the Rye",
  author: "JD Salinger",
  numberOfPages: 214,
  publishDate: "July 16, 1951",
  trashcan: ""
});
var gWrinkleInTime = new Book({
  cover: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/WrinkleInTimePBA1.jpg/220px-WrinkleInTimePBA1.jpg",
  title: "A Wrinkle in Time",
  author: "Madeleine L'Engle",
  numberOfPages: 180,
  publishDate: "January 1, 1962",
  trashcan: ""
});
var gMistsOfAvalon = new Book({
  cover: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Mists_of_Avalon-1st_ed.jpg/220px-Mists_of_Avalon-1st_ed.jpg",
  title: "Mists of Avalon",
  author: "Marion Zimmer Bradley",
  numberOfPages: 876,
  publishDate: "January 1, 1985",
  trashcan: ""
});
var gTheyAllSawACat = new Book({
  cover: "https://images-na.ssl-images-amazon.com/images/I/41Qo1cquOSL._AC_US218_.jpg",
  title: "They All Saw a Cat",
  author: "Brendan Wenzel",
  numberOfPages: 44,
  publishDate: "August 30, 2016",
  trashcan: ""
});
var gTheBigRedBarn = new Book({
  cover: "https://tse2.mm.bing.net/th?id=OIP.JuibDYXLkb-5S6UaoskR4QHaIl&pid=Api",
  title: "The Big Red Barn",
  author: "Margaret Wise Brown",
  numberOfPages: 32,
  publishDate: "January 06, 1995",
  trashcan: ""
});
var gInterpreterOfMaladies = new Book({
  cover: "https://tse1.mm.bing.net/th?id=OIP.1C8YsAp4P4w5a9eJpGcQUAHaLJ&pid=Api",
  title: "Interpreter of Maladies",
  author: "Jhumpa Lahiri",
  numberOfPages: 198,
  publishDate: "January 11, 2013",
  trashcan: ""
});
var gUnaccustomedEarth = new Book({
  cover: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Unaccustomed_Earth.jpg/220px-Unaccustomed_Earth.jpg",
  title: "Unaccustomed Earth",
  author: "Jhumpa Lahiri",
  numberOfPages: 331,
  publishDate: "April 13, 2008",
  trashcan: ""
});
var gTommyknockers = new Book({
  cover: "https://upload.wikimedia.org/wikipedia/en/5/55/Tommyknockers.jpg",
  title: "Tommyknockers",
  author: "Stephen King",
  numberOfPages: 900,
  publishDate: "October 10, 1964",
  trashcan: ""
});
var gStephanie = new Book({
  cover: "https://i.pinimg.com/originals/5a/25/e3/5a25e329f31e119e1b826d421c9513af.jpg",
  title: "Stephanie's Ponytail",
  author: "Robert Munsch",
  numberOfPages: 24,
  publishDate: "May 17, 2014",
  trashcan: ""
});
var gTheVelveteenRabbit = new Book({
  cover: "http://media-cache-ak0.pinimg.com/736x/33/85/ec/3385ec4f38046a3ff35c3a280786dcff.jpg",
  title: "The Velveteen Rabbit",
  author: "Margery Williams",
  numberOfPages: 50,
  publishDate: "May 16, 1922",
  trashcan: ""
});
var gDreamNovel = new Book({
  cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Traumnovelle-Titelbild.gif/440px-Traumnovelle-Titelbild.gif",
  title: "Dream Novel (Traumnovelle)",
  author: "Arthur Schnitzler",
  numberOfPages: 128,
  publishDate: "April 24, 1968",
  trashcan: ""
});

//AllBookInstances
window.gAllBooks = [gIT, gIT2, gCatcherInTheRye, gWrinkleInTime, gMistsOfAvalon, gTheyAllSawACat, gTheBigRedBarn, gInterpreterOfMaladies, gUnaccustomedEarth, gTommyknockers, gStephanie, gTheVelveteenRabbit, gDreamNovel];
