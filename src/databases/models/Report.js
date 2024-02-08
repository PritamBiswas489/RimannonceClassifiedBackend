// notification.js
export default function Report(sequelize, DataTypes) {
    const Report = sequelize.define(
      'Report',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        announcementId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        reason: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        
      },
      {
        underscored: true,
        tableName: 'reports',
      }
    );
    
  
   
  
    return Report;
  }