// notification.js
export default function Notification(sequelize, DataTypes) {
    const Notification = sequelize.define(
      'Notification',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          unique: true,
        },
        fromId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        toId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        isRead: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        underscored: true,
        tableName: 'notifications',
      }
    );
    
  
   
  
    return Notification;
  }