(function() {
  class Book {
    constructor(args) {
      this._id = args._id;
      this.cover = args.cover;
      this.title = args.title;
      this.author = args.author;
      this.numPages = args.numPages;
      this.pubDate = new Date(args.pubDate);
      this.edit = args.edit;
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
      this.pEditAjax = $.proxy(this.successfulEditAjax, this);
      // this.pGetRandomBooksHandler = $.proxy(this.successfulRandomGet, this);
      library_instance = this;
    }

    init() { //Step 4) The browser will traverse the DOM once and gather all of these selectors to keep here so it doesn't have to keep going through every single time they are called in the app.  Here, we are setting the element selectors for various event targets that will happen later on.
      //cache down selectors here, use $ or j, put eveything that needs to initialized here
      this.$addBookBtn = $("#addBookBtn");
      this.$addBookTemplate = $(".form-div form").clone();
      this.$addAnotherBookBtn = $("#addAnotherBookBtn");
      this.$getAuthorsBtn = $("#getAuthors");
      this.$modalAuthors = $("#modalAuthors");
      this.$randomAuthorBtn = $("#randomAuthor");
      this.$randomBookBtn = $("#randomBook"); //a hook to my button
      this.$searchButton = $("#searchButton");
      this.$tableContactBody = $("#tableContactBody");
      this.$modalEdit = $("#modalEdit");
      //Put all things that traverse the DOM multiple times in here for added performance
      this._bindEvents(); //Step 5) Set up a specific event handler for each event here below, but call it here because you want it to bind the selectors from above to the actual Bind Events that will connect them to the appropriate handlers below.
      // this.addBookAjax();  //If placed anywhere in the init, the table will populate an empty field in the database and on the table on refresh because the handler that the request depends on (_handleAddBook) hasn't fired off yet (since it's not bound to anything) at this point.
      this.getBookAjax(); //Step 6) Make the Ajax Get request for all books in the database here. It seems to work fine before or after bindEvents, as long as it's in the init().  This ensures that it happens on page load.
      // this.$editBookButton = $("#editBook");
      return false;
    }

    _bindEvents() { //Step 7)This binds the identified target element selectors from the init to the event actions, buttons, and handlers that will house their functionality.  Many require proxies because the first argument is the target object of the event (the handler that the click refers to) and the second argument is the handler "this".
      // In this case, "this" is set equal to our entire library instance, so, our library instance/singleton is the object whose properties are functions which define the behavior of the proxy when an operation is performed on it.
      $("body").on("updateLibrary", $.proxy(this._handleUpdateLibrary, this)); //This says when the "update library" event is triggered on the body, to refer it to the handler to run the function that builds the table anew using the most up to date information from the database array.
      this.$addBookBtn.on("click", $.proxy(this._handleAddBook, this)); //This says that when the add book button is clicked, the event is triggered and it refers to the handler to run the function that adds a book.
      this.$addAnotherBookBtn.on("click", $.proxy(this._handleAddMoreBooks, this)); //This says that when the add another book button is clicked, the event is triggered and it refers to the handler to run the function that adds a blank form field.
      this.$getAuthorsBtn.on("click", $.proxy(this._handleGetAuthors, this)); //This says that when the get authors button is clicked, the event is triggered and it refers to the handler to run the function that pulls the authors up.
      this.$modalAuthors.on("click", "button.deleteAuthor", $.proxy(this._handleDeleteAuthor, this)); //This says that when the delete author button is clicked, the event is triggered and it refers to the handler to run the function that pulls the authors up in the modal div.
      this.$randomAuthorBtn.on("click", $.proxy(this._handleRandomAuthor, this)); //This says that when the get random author button is clicked, the event is triggered and it refers to the handler to run the function that pulls the authors up in the modal div.
      this.$randomBookBtn.on("click", $.proxy(this._handleRandomBook, this)); //This says that when the get random book button is clicked, the event is triggered and it refers to the handler to run the function that pulls the book card up in the modal div.
      this.$searchButton.on("click", $.proxy(this._handleSearch, this)); //This says that when the search button is clicked, the event is triggered and it refers to the handler to run the function that pulls the typed in input from the search input box and runs the functions to bring back a result.
      this.$tableContactBody.on("click", "button.deleteBook", $.proxy(this._handleDelete, this)); //This says that when the delete button is clicked on the table, the event is triggered and it refers to the handler to run the function that will delete that row inthe table and from the database.
      this.$tableContactBody.on("click", "button.editBook", $.proxy(this._handleEdit, this)); //This says that when the edit button is clicked on the table, the event is triggered and it refers to the handler to run the function that pulls the old input from the add book input boxes and runs the functions to replace those values with new ones.
      this.$tableContactBody.on("click", "button.saveButton", $.proxy(this._handleSave, this));
      this.$modalEdit.on("click", $.proxy(this._handleSave, this)); //This says that when the save button within the modal is clicked, the event is triggered and it refers to the handler to run the function to save the new values for that book and update the database and table.

      this.savebook = $.proxy(this.editBookAjax, this);
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
        newBook.numPages = pages[i].value;
        newBook.pubDate = dates[i].value;
        this.addBook(new Book(newBook));
        // this.addBookAjax - This results in an empty table...
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

    _handleEdit(e) {
      let row = $(e.currentTarget).parent().parent();
      let cover = $(".editFormWebsiteInput").attr("placeholder", row.children().children()[0].src);
      // console.log(row.children().children()[0].src);
      let title = $(".editFormTitleInput").attr("placeholder", row.children()[1].innerText);
      let author = $(".editFormAuthorInput").attr("placeholder", row.children()[2].innerText);
      let numPages = $(".editFormNumberOfPagesInput").attr("placeholder", row.children()[3].innerText);
      let pubDate = $(".editFormPublishDateInput").attr("placeholder", row.children()[4].innerText);

      this.bookToEdit = row.data("id");

      // console.log(this)
      // console.log(row);
    }

    _handleSave() {
        let book = {};
        // this.getBookAjax(book);
        book.cover = $(".editFormWebsiteInput").val();
        book.title = $(".editFormTitleInput").val();
        book.author = $(".editFormAuthorInput").val();
        book.numPages = $(".editFormNumberOfPagesInput").val();
        book.pubDate = $(".editFormPublishDateInput").val();
        this.savebook(book);
        // this.$tableContactBody.append(this.book.cover, this.book.title, this.book.author, this.book.numPages, this.book.pubDate);

    }




    // for (var i = 0; i < row.length; i++) {
    //   this.bookToEdit = book;
    //   newBook.cover = covers[i].value;
    //   newBook.title = titles[i].value;
    //   newBook.author = authors[i].value;
    //   newBook.numberOfPages = pages[i].value;
    //   newBook.publishDate = dates[i].value;
    //   this.addBook(new Book(newBook));
    // }

    // console.log(cover, title, author, numPages, pubDate);
    // var book = this.bookToEdit;

    // console.log(book);
    // $("#inputForm").contentEditable = true;
    // this.bookToEdit.title= newTitle;
    // this.bookToEdit.author = newAuthor;
    // this.bookToEdit.numberOfPages = newNumberOfPages;
    // this.bookToEdit.publishDate = newPublishDate;
    // }

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
      $(".numberOfPages-paragraph").text(bookObject.numPages);
      $(".publishDate-paragraph").text(bookObject.pubDate);
      // console.log(bookObject);
      this.getRandomBookAjax(bookObject);
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
      let searchResults = $("#searchBox").val();
      let arrayResult = this.search(searchResults);
      this._buildTable(arrayResult);
      return true;
    }

    // Add a line to the HTML table
    _addLineToHTMLTable(id, cover, title, author, numPages, pubDate, edit, trashcan) {
      // Get the body of the table using the selector API
      let tableBody = this.$tableContactBody[0];
      // Add a new row at the end of the table
      let newRow = tableBody.insertRow();
      // add  new cells to the row
      // let idCell = newRow.insertCell();
      // idCell.innerHTML = "";
      let coverCell = newRow.insertCell();
      coverCell.innerHTML = "<img src=" + cover + ">";
      let titleCell = newRow.insertCell();
      titleCell.innerHTML = title;
      let authorCell = newRow.insertCell();
      authorCell.innerHTML = author;
      let numPagesCell = newRow.insertCell();
      numPagesCell.innerHTML = numPages;
      let pubDateCell = newRow.insertCell();
      pubDateCell.innerHTML = pubDate.toLocaleDateString("en-us", {
        month: "numeric",
        day: "numeric",
        year: "numeric"
      });
      let editCell = newRow.insertCell();
      editCell.innerHTML = "<button class='btn btn-info editBook' data-toggle='modal' data-target='#editModalCard'>Edit</button>";
      let trashcanCell = newRow.insertCell();
      trashcanCell.innerHTML = "<button class='btn btn-info deleteBook'>X</button>";
      $(newRow).data("id", id);
    }

    _buildTable(books) {
      $("#tableContactBody").empty();
      for (let i = 0; i < books.length; i++) {
        let book = books[i];
        this._addLineToHTMLTable(book._id, book.cover, book.title, book.author, book.numPages, book.pubDate, book.edit, book.trashcan);
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
          this.deleteBookAjax(this.myBooksArray[i]);
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
          // this.addBookAjax();
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
          cover: $(".formWebsiteInput").val(),
          title: $(".formTitleInput").val(),
          author: $(".formAuthorInput").val(),
          pubDate: $(".formPublishDateInput").val(),
          numPages: $(".formNumberOfPagesInput").val()
        }
      }).done(function(response) {

      }).fail(function() {
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
        .fail(function() {
          console.log("Your GET request has failed");
        });
    }

    successfulGet(response) {
      let results = [];
      for (var i = 0; i < response.length; i++) {
        results.push(new Book(response[i]));
      }
      this.myBooksArray = results;
      // console.log(results)
      this.updateLibrary();
    }


    getRandomBookAjax(book) {
      $.ajax({
          dataType: 'json',
          type: "GET",
          url: "http://localhost:3000/library/" + book._id,
        })
        .done(function(response) {
          // console.log(response);
        })
        .fail(function() {
          console.log("Your GET request has failed");
        });
    }

    // successfulRandomGet(response) {
    //     return this.response[i];
    //     console.log(response[i]);
    //   }

    deleteBookAjax(book) {
      $.ajax({
        dataType: 'json',
        type: "DELETE",
        url: "http://localhost:3000/library/" + book._id,
      });
    }

    editBookAjax(book) {
      // this.getRandomBookAjax(book);
      let url = "http://localhost:3000/library/" + this.bookToEdit;
      // console.log(book)
      $.ajax({
          dataType: 'json',
          type: "PUT",
          url: url,
          data: {
            ...book
          }
        })
        .done(this.pEditAjax)
        .fail(function() {
          console.log("fail")
        });
        // this.updateLibrary();
    }

    successfulEditAjax(response) {
      console.log(response);
      var results = [];
      results.push(new Book(response));
      results.append(results);
      this.myBooksArray = results;
      this.updateLibrary();

      // response.cover = $(".editFormWebsiteInput").val(),
      // response.title = $(".editFormTitleInput").val(),
      // response.author = $(".editFormAuthorInput").val(),
      // response.numPages = $(".editFormNumberOfPagesInput").val(),
      // response.pubDate = $(".editFormPublishDateInput").val()

    }

    updateLibrary() {
      $("body").trigger("updateLibrary");
    }
  }

  //Library Instance:
  // Step 1) When the browser is opened, it will parse everything on my page and get ready to render it, but not actually do so.  The $(document).ready function calls the document itself, and assigns it to an event API called the ready() event.  $(document).ready() is the same as window.onload and signifies that the state of the page is about to change, and that all the contents have been loaded and are ready to be rendered, but before doing so, we have to walk through function.
  $(document).ready(function() { //Listen to the document and when you hear this, fire this off
    const gLib = new Library(); //Step 2) This tells the browser to create the Library instance and get ready to render it with the book instances created below (?).
    gLib.init(); //Step 3)  This method initializes, or starts up anything in my init() method call.  I want this to fire off all the things I want the page to do right away --> Like set up my bind events.
    // gLib.getObject("localLibraryStorage");
    $('#myTable').tablesorter({ //Not really a step, but ensures that upon page load, the method calls myTable tells it to apply the tablesorter method from my plug in.
      headers: {
        0: {
          sorter: false
        },
        5: {
          sorter: false
        }
        // 6: {
        //   sorter: false
        // }
      }
    })
    $("#formWebsiteInput").focus(); //Not really a step and I don't think it's doing anything.
    // gLib.addBooks(gAllBooks);
  });

  // Removing the following will break the site.  But why? Where do these fall in the process?
  const gIT = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/5/5a/It_cover.jpg",
    title: "IT",
    author: "Stephen King",
    numPages: 1138,
    pubDate: "September 15, 1986",
    trashcan: "<tr></tr>"
  });
  const gIT2 = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/5/5a/It_cover.jpg",
    title: "IT",
    author: "Stephen King",
    numPages: 800,
    pubDate: "December 17, 1995",
    trashcan: ""
  });
  const gCatcherInTheRye = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/3/32/Rye_catcher.jpg/220px-Rye_catcher.jpg",
    title: "The Catcher in the Rye",
    author: "JD Salinger",
    numPages: 214,
    pubDate: "July 16, 1951",
    trashcan: ""
  });
  const gWrinkleInTime = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/WrinkleInTimePBA1.jpg/220px-WrinkleInTimePBA1.jpg",
    title: "A Wrinkle in Time",
    author: "Madeleine L'Engle",
    numPages: 180,
    pubDate: "January 1, 1962",
    trashcan: ""
  });
  const gMistsOfAvalon = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Mists_of_Avalon-1st_ed.jpg/220px-Mists_of_Avalon-1st_ed.jpg",
    title: "Mists of Avalon",
    author: "Marion Zimmer Bradley",
    numPages: 876,
    pubDate: "January 1, 1985",
    trashcan: ""
  });
  const gTheyAllSawACat = new Book({
    cover: "https://images-na.ssl-images-amazon.com/images/I/41Qo1cquOSL._AC_US218_.jpg",
    title: "They All Saw a Cat",
    author: "Brendan Wenzel",
    numPages: 44,
    pubDate: "August 30, 2016",
    trashcan: ""
  });
  const gTheBigRedBarn = new Book({
    cover: "https://tse2.mm.bing.net/th?id=OIP.JuibDYXLkb-5S6UaoskR4QHaIl&pid=Api",
    title: "The Big Red Barn",
    author: "Margaret Wise Brown",
    numPages: 32,
    pubDate: "January 06, 1995",
    trashcan: ""
  });
  const gInterpreterOfMaladies = new Book({
    cover: "https://tse1.mm.bing.net/th?id=OIP.1C8YsAp4P4w5a9eJpGcQUAHaLJ&pid=Api",
    title: "Interpreter of Maladies",
    author: "Jhumpa Lahiri",
    numPages: 198,
    pubDate: "January 11, 2013",
    trashcan: ""
  });
  const gUnaccustomedEarth = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Unaccustomed_Earth.jpg/220px-Unaccustomed_Earth.jpg",
    title: "Unaccustomed Earth",
    author: "Jhumpa Lahiri",
    numPages: 331,
    pubDate: "April 13, 2008",
    trashcan: ""
  });
  const gTommyknockers = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/en/5/55/Tommyknockers.jpg",
    title: "Tommyknockers",
    author: "Stephen King",
    numPages: 900,
    pubDate: "October 10, 1964",
    trashcan: ""
  });
  const gStephanie = new Book({
    cover: "https://i.pinimg.com/originals/5a/25/e3/5a25e329f31e119e1b826d421c9513af.jpg",
    title: "Stephanie's Ponytail",
    author: "Robert Munsch",
    numPages: 24,
    pubDate: "May 17, 2014",
    trashcan: ""
  });
  const gTheVelveteenRabbit = new Book({
    cover: "http://media-cache-ak0.pinimg.com/736x/33/85/ec/3385ec4f38046a3ff35c3a280786dcff.jpg",
    title: "The Velveteen Rabbit",
    author: "Margery Williams",
    numPages: 50,
    pubDate: "May 16, 1922",
    trashcan: ""
  });
  const gDreamNovel = new Book({
    cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Traumnovelle-Titelbild.gif/440px-Traumnovelle-Titelbild.gif",
    title: "Dream Novel (Traumnovelle)",
    author: "Arthur Schnitzler",
    numPages: 128,
    pubDate: "April 24, 1968",
    trashcan: ""
  });

  //AllBookInstances
  const gAllBooks = [gIT, gIT2, gCatcherInTheRye, gWrinkleInTime, gMistsOfAvalon, gTheyAllSawACat, gTheBigRedBarn, gInterpreterOfMaladies, gUnaccustomedEarth, gTommyknockers, gStephanie, gTheVelveteenRabbit, gDreamNovel];
})();
