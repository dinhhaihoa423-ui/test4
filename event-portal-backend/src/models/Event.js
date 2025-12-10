// event-portal-backend/src/models/Event.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  
  // SỬA DÒNG NÀY THÀNH allowNull: true
  name: { type: DataTypes.STRING, allowNull: true },   // ← ĐÃ SỬA: true thay vì false
  
  description: { type: DataTypes.TEXT },
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false },
  registrationDeadline: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  registrationLink: { type: DataTypes.STRING, allowNull: false },
  coverImage: { type: DataTypes.STRING },
  organizationId: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM('created', 'pending', 'approved', 'rejected'),
    defaultValue: 'created'
  },
  channels: { type: DataTypes.JSON, defaultValue: ['web'] }
}, { 
  timestamps: true 
});

module.exports = Event;
