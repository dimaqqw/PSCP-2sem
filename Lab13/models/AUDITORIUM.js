module.exports = (sequelize, DataTypes) => {
  const AUDITORIUM = sequelize.define(
    'AUDITORIUM',
    {
      AUDITORIUM: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      AUDITORIUM_NAME: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      AUDITORIUM_CAPACITY: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      AUDITORIUM_TYPE: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'AUDITORIUM',
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  )
  return AUDITORIUM
}
