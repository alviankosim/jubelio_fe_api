const { Pool } = require('pg')
const { PG_UNIQUE_EXIST } = require('../config/constants')
const pool = new Pool()

module.exports = {
  async query (text, params) {
    // invocation timestamp for the query method for basic logging
    const start = Date.now()
    try {
      const res = await pool.query(text, params)
      // time elapsed since invocation to execution
      const duration = Date.now() - start
      console.log(
        'executed query',
        { text, duration, rows: res.rowCount }
      )
      return res
    } catch (error) {
      console.log('error in query', { text })
      throw error
    }
  },
  getErrorMessage (code) {
    switch (code) {
      // unique error response from postgres
      case PG_UNIQUE_EXIST:
        return 'Data already exist!'
        break
      default:
    }
  }
}
