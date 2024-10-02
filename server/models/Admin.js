/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensures that the username is unique
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return Admin
}
