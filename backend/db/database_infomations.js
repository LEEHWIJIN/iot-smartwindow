module.exports = (function () {
  return {
    local: { // localhost
      host: '13.125.156.236',
      port: '3306',
      user: 'root',
      password: ' ',
      database: 'iot_smartwindow'
    },
    real: { // real server db info
      host: '',
      port: '',
      user: '',
      password: '!',
      database: ''
    },
    dev: { // dev server db info
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    }
  }
})();