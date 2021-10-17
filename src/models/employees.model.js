module.exports = (sequelize, DataTypes) => {

    const Employees = sequelize.define("employees", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        national_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: () => {
                var val = Math.floor(1000 + Math.random() * 9000);
                return "EMP" + val;
            },
            unique:true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false
        },
        verified: {
            type:DataTypes.BOOLEAN,
            allowNull: true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:true
        },
        created_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },{
        timestamps: false,
    });
    
    
    return Employees;
    
    };