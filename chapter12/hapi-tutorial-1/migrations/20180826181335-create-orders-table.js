module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'orders',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('0', '1'), // 0 未支付， 1 已支付
        defaultValue: '0',
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    },
  ),

  down: queryInterface => queryInterface.dropTable('orders'),
};
