populateMovieTable()

function populateMovieTable(){
    let moviesArray = [];


    $.getJSON("/movies", function(data) {
        let content;
        $.each(data, function(i,movie){
            let id = movie.id;
            let name = movie.name
            let releaseYear = movie.releaseYear
            let amountInStock = movie.amountInStock;
            let genre = movie.genre;

            content += `<tr><td>${id}</td><td><a href=\'/movies/${id}\'>${name}</td><td>${releaseYear}</td><td>${genre}</td><td>${amountInStock}</td></tr>`
        })
       $("#indexMovieTable").append(content);
    })

}