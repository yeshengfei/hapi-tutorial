module.exports = (sequelize, DataTypes) => sequelize.define(
  'goods',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumb_url: DataTypes.STRING,
  },
  {
    tableName: 'goods',
  },
);
