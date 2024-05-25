module.exports = (sequelize, DataTypes) => {
  const PULPIT = sequelize.define(
    'PULPIT',
    {
      PULPIT: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      PULPIT_NAME: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      FACULTY: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'PULPIT',
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  )

  return PULPIT
}
