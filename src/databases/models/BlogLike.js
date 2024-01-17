// notification.js
export default function BlogLike(sequelize, DataTypes) {
    const BlogLike = sequelize.define(
      'BlogLike',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        blogId: {
           type: DataTypes.INTEGER,
           allowNull: true,
        },
        userId: {
           type: DataTypes.INTEGER,
           allowNull: false,
        },
      },
      {
        underscored: true,
        tableName: 'blog_likes',
      }
    );
    return BlogLike;
  }