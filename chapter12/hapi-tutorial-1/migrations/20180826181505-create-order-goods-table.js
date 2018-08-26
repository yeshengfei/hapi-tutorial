module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'order_goods',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      goods_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      single_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    },
  ),

  down: queryInterface => queryInterface.dropTable('order_goods'),
};
