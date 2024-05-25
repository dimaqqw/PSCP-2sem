module.exports = (sequelize, DataTypes) => {
  const TEACHER = sequelize.define(
    'TEACHER',
    {
      TEACHER: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      TEACHER_NAME: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PULPIT: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'TEACHER',
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  )
  return TEACHER
}
