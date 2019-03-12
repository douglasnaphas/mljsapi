/* globals expect */
describe('lib/assignLibsMiddleware/assignments', () => {
  const assignments = require('./assignments');
  const responses = require('../../responses');
  const runTest = ({locals, expectedParticipants, expectNext, expectedStatus,
    expectedData}) => {
      const middleware = assignments();
      const req = {};
      let statusToSend = 200;
      let sentStatus;
      let nextCalled = false;
      const next = () => {nextCalled = true};
      let sentData;
      const res = {
        locals: locals,
        status: s => {
          statusToSend = s;
          return {
            send: d => {sentData = d; sentStatus = statusToSend}
          };
        },
        send: d => {sentData = d; sentStatus = statusToSend}
      };
    };
  test('...', () => {});
});