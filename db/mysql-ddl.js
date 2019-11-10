module.exports = {
    select: {
        getUserDetailsByName: "select * from userdetails where name=?",
        isUserExists: "select count(*) as rowcount from userdetails where name=? and type = ? and favorite = ?",
        getUserById: "select * from userdetails where id=?",
        getUserByNameType: "select * from userdetails where name=? and type=?",
        updatedUser: "select * from userdetails where name = ? and type = ? and favorite = ?"
    },
    insert: {
        addUser: "insert into userdetails (name, type, favorite) values(?, ?, ?)"
    },
    update: {
        updateUser: "update userdetails set favorite = ? where name = ? and type = ?"
    },
    delete: {
        deleteUser: "delete from userdetails where name = ? and type = ? and favorite = ?"
    }
}