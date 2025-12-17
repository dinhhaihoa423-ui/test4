// models/Contact.js
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'contacts'
  });

  return Contact;
};
