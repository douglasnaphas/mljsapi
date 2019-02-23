const responses = {
  BAD_REQUEST: {err: 'bad request'},
  SERVER_ERROR: {err: 'server error'},
  success: (data) => {return {...data, result: 'success'}}
}

module.exports = responses;