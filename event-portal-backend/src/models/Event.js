const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.TEXT, // Cho URL ảnh dài
    allowNull: true // Optional
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'archived'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  tableName: 'Events'
});

module.exports = Event;
