(function() {
  class Book {
    constructor(args) {
      this._id = args._id;
      this.cover = args.cover;
      this.title = args.title;
      this.author = args.author;
      this.numberOfPages = args.numPages;
      this.publishDate = new Date(args.publishDate);
      this.trashcan = args.trashcan;
    }
  }

  let library_instance;

  class Library {
    constructor(instanceKey) {
      if (library_instance) {
        return library_instance;
      }
      this.myBooksArray = [];
      this.keyInstance = instanceKey;
      this.pGetBooksHandler = $.proxy(this.successfulGet, this);
      library_instance = this;
    }

    init() {
      //cache down selectors here, use $ or j, put eveything that needs to initialized here
      this.$addBookBtn = $("#addBookBtn");
      this.$addBookTemplate = $(".form-div form").clone();
      this.$addAnotherBookBtn = $("#addAnotherBookBtn");
      this.$getAuthorsBtn = $("#getAuthors");
      this.$modalAuthors = $("#modalAuthors");
      this.$deleteAuthorBtn = $("button.deleteAuthor");
      this.$randomAuthorBtn = $("#randomAuthor");
      this.$randomBookBtn = $("#randomBook"); //a hook to my button
      this.$searchButton = $("#searchButton");
      this.$deleteBookBtn = $("button.deleteBook");
      this.$tableContactBody = $("#tableContactBody");
      //Put all things that traverse the DOM multiple times in here for added performance
      this._bindEvents(); //Set up a specific event handler for each event here
      // this.addBookAjax();
      this.getBookAjax();
      return false;
    }

    _bindEvents() {
      $("body").on("updateLibrary", $.proxy(this._handleUpdateLibrary, this));
      this.$addBookBtn.on("click", $.proxy(this._handleAddBook, this));
      this.$addAnotherBookBtn.on("click", $.proxy(this._handleAddMoreBooks, this));
      this.$getAuthorsBtn.on("click", $.proxy(this._handleGetAuthors, this));
      this.$modalAuthors.on("click", "button.deleteAuthor", $.proxy(this._handleDeleteAuthor, this));
      this.$randomAuthorBtn.on("click", $.proxy(this._handleRandomAuthor, this));
      this.$randomBookBtn.on("click", $.proxy(this._handleRandomBook, this));
      this.$searchButton.on("click", $.proxy(this._handleSearch, this));
      this.$tableContactBody.on("click", "button.deleteBook", $.proxy(this._handleDelete, this));

      return false;
    }

    _handleAddBook() {
      let covers = $(".formWebsiteInput");
      let titles = $(".formTitleInput");
      let authors = $(".formAuthorInput");
      let pages = $(".formNumberOfPagesInput");
      let dates = $(".formPublishDateInput");
      for (let i = 0; i < titles.length; i++) {
        let newBook = {};
        newBook.cover = covers[i].value;
        newBook.title = titles[i].value;
        newBook.author = authors[i].value;
        newBook.numberOfPages = pages[i].value;
        newBook.publishDate = dates[i].value;
        this.addBook(new Book(newBook));
        // this.addBookAjax();
      }
      $(".form-div").empty();
      $(".form-div").append(this.$addBookTemplate.clone());
      return true;
    }

    _handleAddMoreBooks() {
      $(".form-div").append(this.$addBookTemplate.clone());
    }

    _handleDelete(e) {
      let row = $(e.currentTarget).parent().parent();
      this.removeBookByTitle(row.children()[1].innerText);
      row.remove();
      // this.deleteBookAjax();
      return true;
    }

    _handleUpdateLibrary() {
      this._buildTable(this.myBooksArray);
      // this.setObject("localLibraryStorage");
      // return "Local storage has been updated!";
    }

    _handleRandomBook() {
      let bookObject = this.getRandomBook();
      $(".card-img-top").attr("src", bookObject.cover);
      $(".card-title").text(bookObject.title);
      $(".author-paragraph").text(bookObject.author);
      $(".numberOfPages-paragraph").text(bookObject.numberOfPages);
      $(".publishDate-paragraph").text(bookObject.publishDate);
      return true;
    }

    _handleRandomAuthor() {
      $(".modal-body.author").text(this.getRandomAuthorName());
      return true;
    }

    _handleGetAuthors() {
      let authorList = this.getAuthors();
      let authorListInput = "";
      for (let i = 0; i < authorList.length; i++) {
        authorListInput = authorListInput + "<li class=\"list-group-item\"><button class='deleteAuthor'>Delete this Author</button><span>" + authorList[i] + "</span></li>";
      }
      $(".list-group-item").remove();
      this.$modalAuthors.append(authorListInput);
      return true;
    }

    _handleDeleteAuthor(e) {
      let author = e.currentTarget.nextElementSibling.innerText;
      this.removeBooksByAuthor(author);
      let authorList = this.getAuthors();
      let authorListInput = "";
      for (let i = 0; i < authorList.length; i++) {
        authorListInput = authorListInput + "<li class=\"list-group-item\"><button class='deleteAuthor'>Delete this Author</button><span>" + authorList[i] + "</span></li>";
      }
      $(".list-group-item").remove();
      $("#modalAuthors").append(authorListInput);
      return true;
    }

    _handleSearch(e) {
      event.preventDefault();
      let searchResults = document.getElementById("searchBox").value;
      let arrayResult = this.search(searchResults);
      this._buildTable(arrayResult);
      return true;
    }

    // Add a line to the HTML table
    _addLineToHTMLTable(cover, title, author, numberOfPages, publishDate, trashcan) {
      // Get the body of the table using the selector API
      let tableBody = this.$tableContactBody[0];
      // Add a new row at the end of the table
      let newRow = tableBody.insertRow();
      // add  new cells to the row
      let coverCell = newRow.insertCell();
      coverCell.innerHTML = "<img src=" + cover + ">";
      let titleCell = newRow.insertCell();
      titleCell.innerHTML = title;
      let authorCell = newRow.insertCell();
      authorCell.innerHTML = author;
      let numberOfPagesCell = newRow.insertCell();
      numberOfPagesCell.innerHTML = numberOfPages;
      let publishDateCell = newRow.insertCell();
      publishDateCell.innerHTML = publishDate.toLocaleDateString("en-us", {
        month: "numeric",
        day: "numeric",
        year: "numeric"
      });
      let trashcanCell = newRow.insertCell();
      trashcanCell.innerHTML = "<button class='btn btn-info deleteBook'>X</button>";
    }

    _buildTable(books) {
      $("#tableContactBody").empty();
      for (let i = 0; i < books.length; i++) {
        let book = books[i];
        this._addLineToHTMLTable(book.cover, book.title, book.author, book.numberOfPages, book.publishDate, book.trashcan);
      }
    }


    // Run code
    addBook(book) {
      // this.addBookAjax();
      for (let i = 0; i < this.myBooksArray.length; i++) {
        let currentBook = this.myBooksArray[i];
        if (currentBook.title === book.title) {
          return false;
        }
      }

      this.myBooksArray.push(book);
      this.addBookAjax();
      this.updateLibrary();
      return true;
    }

    removeBookByTitle(title) {
      for (let i = 0; i < this.myBooksArray.length; i++) {
        if (this.myBooksArray[i].title === title) {
          this.deleteBookAjax(this.myBooksArray[i]);
          this.myBooksArray.splice(i, 1);
          this.updateLibrary();
          return true;
        }
      }
      return false;
    }

    removeBooksByAuthor(authorName) {
      let result = false;
      for (let i = this.myBooksArray.length - 1; i >= 0; i--) {
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
      } else {
        return this.myBooksArray[(Math.floor(Math.random() * this.myBooksArray.length))];
      }
      return true;
    }

    getBookByTitle(title) {
      let tempArray = [];
      let pattern = new RegExp(title, "i");
      for (let i = 0; i < this.myBooksArray.length; i++) {
        if (pattern.test(this.myBooksArray[i].title)) {
          tempArray.push(this.myBooksArray[i]);
        }
      }
      return tempArray;
    }

    getBooksByAuthor(authorName) {
      let tempArray = [];
      let pattern = new RegExp(authorName, "i");
      for (let i = 0; i < this.myBooksArray.length; i++) {
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
      let count = 0;
      for (let i = 0; i < books.length; i++) {
        if (this.addBook(books[i])) {
          count++;
        }
      }
      return count;
    }

    getAuthors() {
      let tempArray = [];
      for (let i = 0; i < this.myBooksArray.length; i++) {
        if (tempArray.indexOf(this.myBooksArray[i].author) === -1) {
          tempArray.push(this.myBooksArray[i].author);
        }
      }
      return tempArray;
    }

    getRandomAuthorName() {
      if (this.myBooksArray.length == 0) {
        return [];
      } else {
        return this.myBooksArray[(Math.floor(Math.random() * this.myBooksArray.length))].author;
      }
    }

    search(string) {
      return this.getBookByTitle(string).concat(this.getBooksByAuthor(string));
    }

    // setObject(instanceKey) {
    //   localStorage.setItem(instanceKey, JSON.stringify(this.myBooksArray));
    //   return instanceKey + " is set!";
    // }
    //
    // getObject(instanceKey) {
    //   let localStorageBooks = JSON.parse(localStorage.getItem(instanceKey));
    //   if (localStorageBooks) {
    //     for (let i = 0; i < localStorageBooks.length; i++) {
    //       let book = localStorageBooks[i];
    //       this.addBook(new Book(book));
    //     }
    //     return true;
    //   }

    addBookAjax() {
      $.ajax({
        dataType: 'json',
        type: "POST",
        url: "http://localhost:3000/library/",
        // path: "/",
        data: {
          cover : $(".formWebsiteInput").val(),
          title : $(".formTitleInput").val(),
          author : $(".formAuthorInput").val(),
          pubDate : $(".formPublishDateInput").val(),
          numPages : $(".formNumberOfPagesInput").val()
        }
      }).done(function(response){
        console.log(response)}).fail(function(){
        console.log("Your POST request has failed");
      });
    }

    getBookAjax() {
      $.ajax({
        dataType: 'json',
        type: "GET",
        url: "http://localhost:3000/library/"
      })
      .done(this.pGetBooksHandler)
      .fail(function(){
        console.log("Your GET request has failed");
      });
    }

    successfulGet(response) {
    let results=[];
      for (var i = 0; i < response.length; i++) {
        results.push(new Book(response[i]));
      }
      this.myBooksArray = results;
      console.log(results);
      this.updateLibrary();
  }

    deleteBookAjax(book) {
      $.ajax({
        dataType: 'json',
        type: "DELETE",
        url: "http://localhost:3000/library/" + book._id,
        path: "/:id"
      });
    }

    updateLibrary() {
      $("body").trigger("updateLibrary");
    }
  }

  //Library Instance:
  $(document).ready(function() { //Listen to the document and when you hear this, fire this off
    const gLib = new Library("localLibraryStorage");
    gLib.init(); //I want this to fire off all the things I want it to do right away --> Set up bind events
    // gLib.getObject("localLibraryStorage");
    $('#myTable').tablesorter({
      headers: {
        0: {
          sorter: false
        },
        5: {
          sorter: false
        }
      }
    });
    $("#formWebsiteInput").focus();
    // gLib.addBooks(gAllBooks);
  });

  const gIT = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/5/5a/It_cover.jpg",
    title: "IT",
    author: "Stephen King",
    numberOfPages: 1138,
    publishDate: "September 15, 1986",
    trashcan: "<tr></tr>"
  });
  const gIT2 = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/5/5a/It_cover.jpg",
    title: "IT",
    author: "Stephen King",
    numberOfPages: 800,
    publishDate: "December 17, 1995",
    trashcan: ""
  });
  const gCatcherInTheRye = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/3/32/Rye_catcher.jpg/220px-Rye_catcher.jpg",
    title: "The Catcher in the Rye",
    author: "JD Salinger",
    numberOfPages: 214,
    publishDate: "July 16, 1951",
    trashcan: ""
  });
  const gWrinkleInTime = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/WrinkleInTimePBA1.jpg/220px-WrinkleInTimePBA1.jpg",
    title: "A Wrinkle in Time",
    author: "Madeleine L'Engle",
    numberOfPages: 180,
    publishDate: "January 1, 1962",
    trashcan: ""
  });
  const gMistsOfAvalon = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Mists_of_Avalon-1st_ed.jpg/220px-Mists_of_Avalon-1st_ed.jpg",
    title: "Mists of Avalon",
    author: "Marion Zimmer Bradley",
    numberOfPages: 876,
    publishDate: "January 1, 1985",
    trashcan: ""
  });
  const gTheyAllSawACat = new Book({
    cover: "https://images-na.ssl-images-amazon.com/images/I/41Qo1cquOSL._AC_US218_.jpg",
    title: "They All Saw a Cat",
    author: "Brendan Wenzel",
    numberOfPages: 44,
    publishDate: "August 30, 2016",
    trashcan: ""
  });
  const gTheBigRedBarn = new Book({
    cover: "https://tse2.mm.bing.net/th?id=OIP.JuibDYXLkb-5S6UaoskR4QHaIl&pid=Api",
    title: "The Big Red Barn",
    author: "Margaret Wise Brown",
    numberOfPages: 32,
    publishDate: "January 06, 1995",
    trashcan: ""
  });
  const gInterpreterOfMaladies = new Book({
    cover: "https://tse1.mm.bing.net/th?id=OIP.1C8YsAp4P4w5a9eJpGcQUAHaLJ&pid=Api",
    title: "Interpreter of Maladies",
    author: "Jhumpa Lahiri",
    numberOfPages: 198,
    publishDate: "January 11, 2013",
    trashcan: ""
  });
  const gUnaccustomedEarth = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Unaccustomed_Earth.jpg/220px-Unaccustomed_Earth.jpg",
    title: "Unaccustomed Earth",
    author: "Jhumpa Lahiri",
    numberOfPages: 331,
    publishDate: "April 13, 2008",
    trashcan: ""
  });
  const gTommyknockers = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/5/55/Tommyknockers.jpg",
    title: "Tommyknockers",
    author: "Stephen King",
    numberOfPages: 900,
    publishDate: "October 10, 1964",
    trashcan: ""
  });
  const gStephanie = new Book({
    cover: "https://i.pinimg.com/originals/5a/25/e3/5a25e329f31e119e1b826d421c9513af.jpg",
    title: "Stephanie's Ponytail",
    author: "Robert Munsch",
    numberOfPages: 24,
    publishDate: "May 17, 2014",
    trashcan: ""
  });
  const gTheVelveteenRabbit = new Book({
    cover: "http://media-cache-ak0.pinimg.com/736x/33/85/ec/3385ec4f38046a3ff35c3a280786dcff.jpg",
    title: "The Velveteen Rabbit",
    author: "Margery Williams",
    numberOfPages: 50,
    publishDate: "May 16, 1922",
    trashcan: ""
  });
  const gDreamNovel = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Traumnovelle-Titelbild.gif/440px-Traumnovelle-Titelbild.gif",
    title: "Dream Novel (Traumnovelle)",
    author: "Arthur Schnitzler",
    numberOfPages: 128,
    publishDate: "April 24, 1968",
    trashcan: ""
  });

  //AllBookInstances
  const gAllBooks = [gIT, gIT2, gCatcherInTheRye, gWrinkleInTime, gMistsOfAvalon, gTheyAllSawACat, gTheBigRedBarn, gInterpreterOfMaladies, gUnaccustomedEarth, gTommyknockers, gStephanie, gTheVelveteenRabbit, gDreamNovel];
})();
