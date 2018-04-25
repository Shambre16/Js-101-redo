//Book object constructor
var Book = function(args) {
  this.cover = args.cover;
  this.title = args.title;
  this.author = args.author;
  this.numberOfPages = args.numberOfPages;
  this.publishDate = new Date(args.publishDate);
  this.trashcan = args.trashcan;
};

// Singleton!!!!!!!!!!!!  Do not use var Singleton = before this.  It will break everything!!!
(function() {
  var library_instance;

  window.Library = function(instanceKey) {
    if (library_instance) {
      return library_instance;
    }
    this.myBooksArray = [];
    this.keyInstance = instanceKey;
    library_instance = this;
  };
})();

Library.prototype.init = function() {
  //cache down selectors here, use $ or j, put eveything that needs to initialized here (how do I know?)
  this.$randomBookBtn = $("#randomBook"); //a hook to my button
  this.$randomAuthorBtn = $("#randomAuthor");
  this.$searchButton = $("#searchButton");
  this.$getAuthorsBtn = $("#getAuthors");
  this.$addBookBtn = $("#addBookBtn");
  this.$formWebsiteInput = $("#formWebsiteInput");
  this.$formTitleInput = $("#formTitleInput");
  this.$formAuthorInput = $("#formAuthorInput");
  this.$formNumberOfPagesInput = $("#formNumberOfPagesInput");
  this.$formPublishDateInput = $("#formPublishDateInput");
  this.$deleteBookBtn = $("button.deleteBook");
  //Put all the things in here for added performance to it
  // this.$alertBtn = $("button.alert");
  // this.$changeBtn = $("button.change-text");
  // this.$logBtn = $("button.log-hello");

  this._bindEvents(); //Set up a specific event handler for each event here
  return false;
};

Library.prototype._bindEvents = function() {
  $("body").on("updateLibrary", $.proxy(this._handleUpdateLibrary, this));
  this.$addBookBtn.on("click", $.proxy(this._handleAddBook, this));
  this.$formWebsiteInput.on("click", $.proxy(this._handleAddBook, this));
  this.$formTitleInput.on("click", $.proxy(this._handleAddBook, this));
  this.$formAuthorInput.on("click", $.proxy(this._handleAddBook, this));
  this.$formNumberOfPagesInput.on("click", $.proxy(this._handleAddBook, this));
  this.$formPublishDateInput.on("click", $.proxy(this._handleAddBook, this));
  this.$searchButton.on("click", $.proxy(this._handleSearch, this));
  this.$randomBookBtn.on("click", $.proxy(this._handleRandomBook, this));
  this.$randomAuthorBtn.on("click", $.proxy(this._handleRandomAuthor, this));
  this.$getAuthorsBtn.on("click", $.proxy(this._handleGetAuthors, this));
  this.$deleteBookBtn.on("click", $.proxy(this._handleDelete, this));


  // var self = this;
  // this.$btn.on("click", function(){this._buildtable(self)});
  // this.$alertBtn.on("click", $.proxy(this._handleAlert, this)); //function(){}); //first and third this refer to same thing, this in here will refer to whatever I'm clicking off in this event, proxy replaces function and allows us to fill it in
  // this.$changeBtn.on("click", $.proxy(this._handleText, this));
  // this.$logBtn.on("click", $.proxy(this._handleLog, this));
  return false;
};

Library.prototype._handleAddBook = function() {
  var bookObjectInput = [document.getElementById("formWebsiteInput").value, document.getElementById("formTitleInput").value, document.getElementById("formAuthorInput").value, document.getElementById("formNumberOfPagesInput").value, document.getElementById("formPublishDateInput").value, ];
  var newBook = {};
  newBook["cover"] = bookObjectInput[0];
  newBook["title"] = bookObjectInput[1];
  newBook["author"] = bookObjectInput[2];
  newBook["numberOfPages"] = bookObjectInput[3];
  newBook["publishDate"] = bookObjectInput[4];
  newBook["trashcan"] = bookObjectInput[5];
  this.addBook(newBook);
};
// this.addBook(new Book(book));

Library.prototype._handleDelete = function() {
  // var $tr = $(e.currentTarget).parent("tr");
  // this.myBooksArray.splice($tr.attr("data-id"), 1);
  // $tr.remove();
  alert("I work!!");
};

Library.prototype._handleUpdateLibrary = function() {
  this.buildTable(this.myBooksArray);
};

Library.prototype._handleRandomBook = function() {
  var bookObject = this.getRandomBook();
  console.log(bookObject);
  $(".card-img-top").attr("src", bookObject.cover);
  $(".card-title").text(bookObject.title);
  $(".author-paragraph").text(bookObject.author);
  $(".numberOfPages-paragraph").text(bookObject.numberOfPages);
  $(".publishDate-paragraph").text(bookObject.publishDate);
};

Library.prototype._handleRandomAuthor = function() {
  console.log(this.getRandomAuthorName());
  this.getRandomAuthorName();
};

Library.prototype._handleGetAuthors = function() {
  var authorList = this.getAuthors();
  var authorListInput = "";
  for (var i = 0; i < authorList.length; i++) {
    authorListInput = authorListInput + "<li class=\"list-group-item\">" + authorList[i] + "</li>"
  }
  $("#modalAuthors").empty();
  $("#modalAuthors").after(authorListInput);
};

Library.prototype._handleSearch = function() {
  var searchResults = document.getElementById("searchBox").value;
  var arrayResult = this.search(searchResults);
  this.buildTable(arrayResult);
};

// Add a line to the HTML table
Library.prototype.addLineToHTMLTable = function(cover, title, author, numberOfPages, publishDate, trashcan) {
  // Get the body of the table using the selector API
  var tableBody = document.querySelector("#tableContactBody");
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
  // var cell = $(trashcanCell).data("title", title);
  // cell.on("click", $.proxy(this._handleDelete, this));
};

Library.prototype.buildTable = function(books) {
  $("#tableContactBody").empty();
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    this.addLineToHTMLTable(book.cover, book.title, book.author, book.numberOfPages, book.publishDate, book.trashcan);
  }
  this.$deleteBookBtn = $("button.deleteBook");
  this._bindEvents();

  // $("#tableContactBody").full();
  // for (var i = 0; i < searchResults.length; i++) {
  //   var book = searchResults[i];
  //   addLineToHTMLTable(book.cover, book.title, book.author, book.numberOfPages, book.publishDate, book.trashcan);
  // }
};

// function addCover() {
//   var x = document.createElement("IMG");
//   x.setAttribute("src", "https://upload.wikimedia.org/wikipedia/en/5/5a/It_cover.jpg");
//   x.setAttribute("width", "304");
//   x.setAttribute("height", "228");
//   x.setAttribute("alt", "IT book cover");
//   document.body.appendChild(x);
// }
//
// Library.prototype._addLinetoHTMLTable = function (title, author, numberOfPages, publishDate, trashcan) {
//   var tableBody = document.querySelector("#tableContactBody");
//
//   var newRow = tableBody.insertRow();
//
//   var titleCell = newRow.insertCell();
//   titleCell.innerHTML = title;
//
//   var authorCell = newRow.insertCell();
//   authorCell.innerHTML = author;
//
//   var numberOfPagesCell = newRow.insertCell();
//   numberOfPagesCell.innerHTML = numberOfPages;
//
//   var publishDateCell = newRow.insertCell();
//   publishDateCell.innerHTML = publishDate;
//
//   var trashcan = newRow.insertCell();
//   trashcanCell.innerHTML = "trashcan";
// };

//Library Instance:
$(document).ready(function() { //Listen to the document and when you hear this, fire this off
  window.gLib = new Library("localLibraryStorage");
  var gLib = window.gLib;
  gLib.init(); //I want this to fire off all the things I want it to do right away --> Set up bind events
  var gIT = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/5/5a/It_cover.jpg",
    title: "IT",
    author: "Stephen King",
    numberOfPages: 1138,
    publishDate: "September 15, 1986",
    trashcan: ""
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
  // Run code
  gLib.getObject("localLibraryStorage");
  $(".table").tablesort();
});
// var tableBody = $('#tableContactBody').DataTable(){ for DataTables example
//   data: gLib.myBooksArray,
//   columns: [{
//     data: "",
//     data: "title",
//     data: "author",
//     data: "numberOfPages",
//     data: "publishDate",
//     data: ""
//   }]
// }

// buildData();
// $("th").each(function(i) {
//   var header = $(this);
//   header.data();
// });


Library.prototype.addBook = function(book) {
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
};

Library.prototype.removeBookByTitle = function(title) {
  for (var i = 0; i < this.myBooksArray.length; i++) {
    if (this.myBooksArray[i].title === title) {
      this.myBooksArray.splice(i, 1);
      this.updateLibrary();
      return true;
    }
  }
  return false;
};

Library.prototype.removeBooksByAuthor = function(authorName) {
  var result = false;
  for (var i = this.myBooksArray.length - 1; i >= 0; i--) {
    if (this.myBooksArray[i].author === authorName) {
      this.myBooksArray.splice(i, 1);
      this.updateLibrary();
    }
  }
  return true;
};

Library.prototype.getRandomBook = function() {
  if (this.myBooksArray.length == 0) {
    return null;
  } else {
    return this.myBooksArray[(Math.floor(Math.random() * this.myBooksArray.length))];
  }
};

Library.prototype.getBookByTitle = function(title) {
  var tempArray = [];
  var pattern = new RegExp(title, "i");
  for (var i = 0; i < this.myBooksArray.length; i++) {
    if (pattern.test(this.myBooksArray[i].title)) {
      tempArray.push(this.myBooksArray[i]);
    }
  }
  return tempArray;
};

Library.prototype.getBooksByAuthor = function(authorName) {
  var tempArray = [];
  var pattern = new RegExp(authorName, "i");
  for (var i = 0; i < this.myBooksArray.length; i++) {
    if (pattern.test(this.myBooksArray[i].author)) {
      tempArray.push(this.myBooksArray[i]);
    }
  }
  return tempArray;
};

Library.prototype.addBooks = function(books) {
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
};

Library.prototype.getAuthors = function() {
  var tempArray = [];
  for (var i = 0; i < this.myBooksArray.length; i++) {
    if (tempArray.indexOf(this.myBooksArray[i].author) === -1) {
      tempArray.push(this.myBooksArray[i].author);
    }
  }
  return tempArray;
};

Library.prototype.getRandomAuthorName = function() {
  if (this.myBooksArray.length == 0) {
    return [];
  } else {
    return this.myBooksArray[(Math.floor(Math.random() * this.myBooksArray.length))].author;
  }
};

Library.prototype.search = function(string) {
  return this.getBookByTitle(string).concat(this.getBooksByAuthor(string));
};

Library.prototype.setObject = function(instanceKey) {
  localStorage.setItem(instanceKey, JSON.stringify(this.myBooksArray));
  return instanceKey + " is set!";
};

Library.prototype.getObject = function(instanceKey) {
  var localStorageBooks = JSON.parse(localStorage.getItem(instanceKey));
  if(localStorageBooks) {
    for (var i = 0; i < localStorageBooks.length; i++) {
      var book = localStorageBooks[i];
      this.addBook(new Book(book));
    }
  return true;
  }
};

Library.prototype.updateLibrary = function() {
  $("body").trigger("updateLibrary");
};

Book.prototype.fullYear = function() {
  return this.publishDate.getYear();
};
