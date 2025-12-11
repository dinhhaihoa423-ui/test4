// models/SocialMedia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialMedia = sequelize.define('SocialMedia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'SocialMedias'
});

module.exports = SocialMedia;
