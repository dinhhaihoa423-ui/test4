const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Organization = require('./Organization');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false },
  registrationDeadline: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  registrationLink: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING },
  status: {
    type: DataTypes.ENUM('created', 'pending', 'approved'),
    defaultValue: 'created'
  },
  channels: { type: DataTypes.JSON, defaultValue: ['web'] },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Cho phép null khi xóa tổ chức
    references: { model: Organization, key: 'id' }
  },
  organizationName: { // THÊM TRƯỜNG MỚI: Lưu tên tổ chức tại thời điểm tạo
    type: DataTypes.STRING,
    allowNull: true
  }
}, { timestamps: true });

// FIX: Khi xóa Organization → set organizationId = null trên Events liên quan
Event.belongsTo(Organization, { 
  foreignKey: 'organizationId', 
  onDelete: 'SET NULL' 
});
Organization.hasMany(Event, { foreignKey: 'organizationId' });

module.exports = Event;
