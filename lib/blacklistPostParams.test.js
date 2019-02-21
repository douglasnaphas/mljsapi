/* globals expect */
describe('blackListPostParams', () => {
  const blackListPostParams = require('./blacklistPostParams');
  const runTest = ({req, expect400, expectNext}) => {
    let statusToSend = 200;
    let sentStatus;
    let nextCalled = false;
    const res = {
      status: (s) => {
        statusToSend = s;
        return {
          send: () => {
            sentStatus = statusToSend;
          }
        }
      },
      sent: () => { sentStatus = statusToSend }
    };
    const next = () => {nextCalled = true};
    blackListPostParams(req, res, next);
    if(expect400) {
      expect(sentStatus).toEqual(400);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
  }
  test('bad room code', () => {
    const req = {
      body: {
        roomCode: 'R<script>src="alert(hacked);"</script>'
      }
    };
    runTest({req: req, expect400: true});
  });
  test('bad game name', () => {
    const req = {
      body: {
        gameName: 'R<script>src="alert(hacked);"</script>'
      }
    };
    runTest({req: req, expect400: true});
  });
  test('bad lib', () => {
    const req = {
      body: {
        libAnswer: 'R<script>src="alert(hacked);"</script>'
      }
    };
    runTest({req: req, expect400: true});
  });
  test('all valid characters', () => {
    const req = {
      body: {
        roomCode: 'ABCDEF',
        gameName: 'Ab-Me, the 33rd',
        libAnswer: 'Oh...so you\'re "Ab-Me the 33rd," eh?'
      }
    }
    runTest({req: req, expectNext: true});
  });
});