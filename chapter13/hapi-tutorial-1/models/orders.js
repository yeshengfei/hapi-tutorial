module.exports = (sequelize, DataTypes) => sequelize.define(
  'orders',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM('0', '1'), // 0 未支付， 1 已支付
      defaultValue: '0',
    },
  },
  {
    tableName: 'orders',
  },
);
