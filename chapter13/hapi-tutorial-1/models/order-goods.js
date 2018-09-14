module.exports = (sequelize, DataTypes) => sequelize.define(
  'order_goods',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    single_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'order_goods',
  },
);
