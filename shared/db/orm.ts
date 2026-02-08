import { MikroORM } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'

export const orm = await MikroORM.init({
  entities: ['dist/models/**/*.entity.js'],
  entitiesTs: ['src/models/**/*.entity.ts'],
  dbName: 'BD_FAST_leafkeepas', 
  type: 'mysql',
  clientUrl: 'mysql://BD_FAST_leafkeepas:9f8030dfbe6a150bb9ddf69e40f5126bafac171e@9azaqr.h.filess.io:3306/BD_FAST_leafkeepas', // falta agregar el url correspondiente
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    //nunca en produccion
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
})

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator()

  //await generator.dropSchema()
  //await generator.createSchema() // correrlo por primera ves para que cargue las tablas

  await generator.updateSchema()
}