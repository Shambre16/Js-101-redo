//Book object constructor
var Book = function(args) {
  this.cover = args.cover;
  this.title = args.title;
  this.author = args.author;
  this.numberOfPages = args.numberOfPages;
  this.publishDate = new Date(args.publishDate);
  this.trashcan = args.trashcan;
};

Book.prototype.fullYear = function(){
 return this.publishDate.getYear();
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
  this.$btn = $("#buildTableButton"); //a hook to my button
  //Put all the things in here for added performance to it
  this.$alertBtn = $("button.alert");
  this.$changeBtn = $("button.change-text");
  this.$logBtn = $("button.log-hello");

  this._bindEvents(); //Set up a specific event handler for each event here
  return false;
};

Library.prototype._bindEvents = function() {
  $("body").on("updateLibrary", $.proxy(this._handleUpdateLibrary, this));
  // var self = this;
  // this.$btn.on("click", function(){this._buildtable(self)});
  this.$alertBtn.on("click", $.proxy(this._handleAlert, this)); //function(){}); //first and third this refer to same thing, this in here will refer to whatever I'm clicking off in this event, proxy replaces function and allows us to fill it in
  this.$changeBtn.on("click", $.proxy(this._handleText, this));
  this.$logBtn.on("click", $.proxy(this._handleLog, this));
  return false;
};

Library.prototype._handleDelete = function(){
  console.log(this);
};

Library.prototype._handleUpdateLibrary = function(){
  buildTable();
};

Library.prototype._handleClick = function() {
  alert("I'm finally working!");
  return false;
};

Library.prototype._handleAlert = function() { //what I want ot fire off once I actually click on it
  alert("fired!");
  return false;
};

Library.prototype._handleText = function() {
  this.$changeBtn.text("Text Changed!");
  return false;
};

Library.prototype._handleLog = function() {
  console.log("Hello World");
  return false;
};

Library.prototype._handleSearch = function() {
  console.log("Hello World");
  return false;
};

// Add a line to the HTML table
function addLineToHTMLTable(cover, title, author, numberOfPages, publishDate, trashcan) {
    // Get the body of the table using the selector API
    var tableBody = document.querySelector("#tableContactBody");

    // Add a new row at the end of the table
    var newRow   = tableBody.insertRow();

   // add  new cells to the row
   var coverCell  = newRow.insertCell();
   coverCell.innerHTML = "<img src="+ cover +">";

   var titleCell   = newRow.insertCell();
   titleCell.innerHTML = title;

   var authorCell   = newRow.insertCell();
   authorCell.innerHTML = author;

   var numberOfPagesCell   = newRow.insertCell();
   numberOfPagesCell.innerHTML = numberOfPages;

   var publishDateCell   = newRow.insertCell();
   publishDateCell.innerHTML = publishDate;

   var trashcanCell   = newRow.insertCell();
   trashcanCell.innerHTML = trashcan;
   var cell = $(trashcanCell).data("title",title);
   cell.on("click", this._handleDelete);
}

function buildTable () {
  $("#tableContactBody").empty();
  for (var i = 0; i < gLib.myBooksArray.length; i++) {
    var book = gLib.myBooksArray[i];
    addLineToHTMLTable(book.cover, book.title, book.author, book.numberOfPages, book.publishDate, book.trashcan);
  }
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
  window.gLib.init(); //I want this to fire off all the things I want it to do right away --> Set up bind events
  window.gIT = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/5/5a/It_cover.jpg",
    title: "IT",
    author: "Stephen King",
    numberOfPages: 1138,
    publishDate: "September 15, 1986 03:24:00",
  });
  // The below just allows me to test that even if I call another instance, it will be the same as the first one I created
  window.gIT2 = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/5/5a/It_cover.jpg",
    title: "IT",
    author: "Stephen King",
    numberOfPages: 800,
    publishDate: "December 17, 1995 03:24:00"
  });
  window.gCatcherInTheRye = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/3/32/Rye_catcher.jpg/220px-Rye_catcher.jpg",
    title: "The Catcher in the Rye",
    author: "JD Salinger",
    numberOfPages: 214,
    publishDate: "July 16, 1951 10:24:00"
  });
  window.gWrinkleInTime = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/WrinkleInTimePBA1.jpg/220px-WrinkleInTimePBA1.jpg",
    title: "A Wrinkle in Time",
    author: "Madeleine L'Engle",
    numberOfPages: 180,
    publishDate: "January 1, 1962 08:00:00"
  });
  window.gMistsOfAvalon = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Mists_of_Avalon-1st_ed.jpg/220px-Mists_of_Avalon-1st_ed.jpg",
    title: "Mists of Avalon",
    author: "Marion Zimmer Bradley",
    numberOfPages: 876,
    publishDate: "January 1, 1985 08:00:00"
  });
  window.gTheyAllSawACat = new Book({
    cover: "https://tse3.mm.bing.net/th?id=OIP.C4lc_6Iwlfd1Yz_DgRbSyAHaDY&pid=Api",
    title: "They All Saw a Cat",
    author: "Brendan Wenzel",
    numberOfPages: 44,
    publishDate: "August 30, 2016 08:00:00"
  });
  window.gTheBigRedBarn = new Book({
    cover: "https://tse2.mm.bing.net/th?id=OIP.JuibDYXLkb-5S6UaoskR4QHaIl&pid=Api",
    title: "The Big Red Barn",
    author: "Margaret Wise Brown",
    numberOfPages: 32,
    publishDate: "January 06, 1995 08:00:00"
  });
  window.gInterpreterOfMaladies = new Book({
    cover: "https://tse1.mm.bing.net/th?id=OIP.1C8YsAp4P4w5a9eJpGcQUAHaLJ&pid=Api",
    title: "Interpreter of Maladies",
    author: "Jhumpa Lahiri",
    numberOfPages: 198,
    publishDate: "January 11, 2013 08:00:00"
  });
  window.gUnaccustomedEarth = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Unaccustomed_Earth.jpg/220px-Unaccustomed_Earth.jpg",
    title: "Unaccustomed Earth",
    author: "Jhumpa Lahiri",
    numberOfPages: 331,
    publishDate: "April 13, 2008 08:00:00"
  });
  window.gTommyknockers = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/5/55/Tommyknockers.jpg",
    title: "Tommyknockers",
    author: "Stephen King",
    numberOfPages: 900,
    publishDate: "October 10, 1964 08:00:00"
  });
  window.gStephanie = new Book({
    cover: "",
    title: "Stephanie",
    author: "Mayim Balik",
    numberOfPages: 150,
    publishDate: "May 17, 2014 08:00:00"
  });
  window.gTheVelveteenRabbit = new Book({
    cover: "http://media-cache-ak0.pinimg.com/736x/33/85/ec/3385ec4f38046a3ff35c3a280786dcff.jpg",
    title: "The Velveteen Rabbit",
    author: "Margery Williams",
    numberOfPages: 50,
    publishDate: "May 16, 1922 08:00:00"
  });
  window.gTheMayanPrincess = new Book({
    cover: "",
    title: "The Mayan Princess",
    author: "Yesmina Itzel",
    numberOfPages: 215,
    publishDate: "April 24, 1968 08:00:00"
  })
  //AllBookInstances
  window.gAllBooks = [gIT, gIT2, gCatcherInTheRye, gWrinkleInTime, gMistsOfAvalon, gTheyAllSawACat, gTheBigRedBarn, gInterpreterOfMaladies, gUnaccustomedEarth, gTommyknockers, gStephanie, gTheVelveteenRabbit, gTheMayanPrincess];
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

   });

Library.prototype.addBook = function(book) {
  if (book.constructor === Array) {
    return false;
  }
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
  var searchResults = [];
  searchResults.push(this.getBookByTitle(string));
  searchResults.push(this.getBooksByAuthor(string));
  return searchResults;
};

Library.prototype.setObject = function(instanceKey) {
  localStorage.setItem(instanceKey, JSON.stringify(this.myBooksArray));
  return instanceKey + " is set!";
};

Library.prototype.getObject = function(instanceKey) {
  var localStorageBooks = JSON.parse(localStorage.getItem(instanceKey));

  for (var i = 0; i < localStorageBooks.length; i++) {
    var book = localStorageBooks[i];
    this.addBook(new Book(book));
  }

  return true;
};

Library.prototype.updateLibrary = function() {
  $("body").trigger("updateLibrary");
};
