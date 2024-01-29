// notification.js
export default function Settings(sequelize, DataTypes) {
    const Settings = sequelize.define(
      'Settings',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        keyValue: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        dataValue: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
      },
      {
        underscored: true,
        tableName: 'settings',
      }
    );
    
  
   
  
    return Settings;
  }