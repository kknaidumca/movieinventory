module.exports = {
    select: {
        listMovies: "select * from movies",
        listAvialableMovies: "select * from movies where isAvialable=1",
        isMovieExists: "select count(1) as moviecount from movies where name=?",
        movieDetails: "select * From movies where name=? and isAvialable = 1"
    },
    insert: {
        addMovie: "insert into movies(name, type, isAvialable, price) values(?, ?, ?, ?)",
        insertToCustomer: "insert into customerhistory(name, moviename, movietype, price, bonus) values(?,?,?,?,?)"
    },
    update: {
        updateMovieType: "update movies set type=?, price=? where name=?",
        updateRentStatus : "update movies set isAvialable=0 where name=?"
    },
    delete: {
        deleteMovie: "delete from movies where name=?"
    }
}