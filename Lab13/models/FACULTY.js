module.exports = (sequelize, DataTypes) => {
  const FACULTY = sequelize.define(
    'FACULTY',
    {
      FACULTY: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      FACULTY_NAME: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'FACULTY',
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  )
  return FACULTY
}
