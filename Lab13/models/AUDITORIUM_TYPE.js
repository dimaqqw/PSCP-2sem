module.exports = (sequelize, DataTypes) => {
  const AUDITORIUM_TYPE = sequelize.define(
    'AUDITORIUM_TYPE',
    {
      AUDITORIUM_TYPE: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      AUDITORIUM_TYPENAME: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'AUDITORIUM_TYPE',
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  )
  return AUDITORIUM_TYPE
}
