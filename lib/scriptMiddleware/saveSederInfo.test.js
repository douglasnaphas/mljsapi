/* globals expect */
describe('scriptMiddleware/saveSederInfo', () => {
  const responses = require('../../responses');
  const runTest = ({dbData, expectedPath, expectedVersion, expectedAnswers,
    expectNext, expectedStatus, expectedData}) => {
    const saveSederInfo = require('./saveSederInfo');
    const req = {};
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    const res = {
      locals: {
        dbData: dbData
      },
      status: s => {
        statusToSend = s;
        return {
          send: d => {sentData = d; sentStatus = statusToSend}
        };
      },
      send: d => {sentData = d; sentStatus = statusToSend}
    };
    let nextCalled = false;
    const next = () => {nextCalled = true};
    const middleware = saveSederInfo();
    middleware(req, res, next);
    if(expectedPath) {
      expect(res.locals.path).toEqual(expectedPath);
    }
    if(expectedVersion) {
      expect(res.locals.version).toEqual(expectedVersion);
    }
    if(expectedAnswers) {
      expect(res.locals.answers).toEqual(expectedAnswers);
    }
    if(expectedStatus) {
      expect(sentStatus).toEqual(expectedStatus);
    }
    if(expectedData) {
      expect(sentData).toEqual(expectedData);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
  };
  test('no dbData', () => {
    runTest({dbData: undefined, expectedStatus: 500, expectedData: 
      responses.SERVER_ERROR});
  });
  test('no Items', () => {
    const dbData = {
      noItems: 'Items missing'
    };
    runTest({dbData: dbData, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('Items not an Array', () => {
    const dbData = {
      Items: 'not an array'
    };
    runTest({dbData: dbData, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('Items array length < 2', () => {
    const dbData = {
      Items: [
        {
          path: "madliberation-scripts/004-Practice_Script",
          script_version: "lhMEdJDP1ItMXPIb2wWUjDRCtUL3.Daa"
        }
      ]
    };
    runTest({dbData: dbData, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('Items lacks an item with path and version', () => {
    const dbData = {
      Items: [
        {
          script_version: "lhMEdJDP1ItMXPIb2wWUjDRCtUL3.Daa"
        },
        {
          assignments: [
            {
              id: 1,
              defaultAnswer: 'path is missing from the seder item',
              prompt: 'should get 500'
            }
          ]
        }
      ]
    };
    runTest({dbData: dbData, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('Items lacks an item with an assignments array', () => {});
  test('1 participant, no answers', () => {
    const dbData = {
      Items: [
        {
          path: "madliberation-scripts/004-Practice_Script",
          script_version: "lhMEdJDP1ItMXPIb2wWUjDRCtUL3.Daa"
        },
        {
          assignments: [
            {
              id: 1,
              defaultAnswer: 'this is totally',
              prompt: 'valid'
            }
          ]
        }
      ]
    };
    const expectedVersion = dbData.Items[0].script_version;
    const expectedPath = dbData.Items[0].path;
    const expectedAnswers = [{id: 1, answer: 'this is totally'}];
    runTest({dbData: dbData, expectedVersion: expectedVersion,
      expectedPath: expectedPath, expectedAnswers: expectedAnswers,
      expectNext: true});
  });
  test('1 participant, 2 assignments, no answers', () => {
    const dbData = {
      Items: [
        {
          path: "madliberation-scripts/006-Unwritten_Script",
          script_version: "uuuuunwDP1ItMXPIb2wWUjDRCtUL3.Daa"
        },
        {
          assignments: [
            {
              id: 2,
              prompt: '2 comes',
              defaultAnswer: 'before 1'
            },
            {
              id: 1,
              defaultAnswer: 'this is totally',
              prompt: 'valid'
            }
          ]
        }
      ]
    };
    const expectedVersion = dbData.Items[0].script_version;
    const expectedPath = dbData.Items[0].path;
    const expectedAnswers = [
      {id: 1, answer: 'this is totally'},
      {id: 2, answer: 'before 1'}
    ];
    runTest({dbData: dbData, expectedVersion: expectedVersion,
      expectedPath: expectedPath, expectedAnswers: expectedAnswers,
      expectNext: true});
  });
  test('2 participants, 1 assignment each, no answers', () => {
    const dbData = {
      Items: [
        {
          path: "madliberation-scripts/006-Unwritten_Script",
          script_version: "uuuuunwDP1ItMXPIb2wWUjDRCtUL3.Daa"
        },
        {
          assignments: [
            {
              id: 2,
              prompt: 'from',
              defaultAnswer: 'someone'
            }
          ]
        },
        {
          assignments: [
            {
              id: 1,
              defaultAnswer: 'from a second',
              prompt: 'participant'
            }
          ]
        }
      ]
    };
    const expectedVersion = dbData.Items[0].script_version;
    const expectedPath = dbData.Items[0].path;
    const expectedAnswers = [
      {id: 1, answer: 'from a second'},
      {id: 2, answer: 'someone'}
    ];
    runTest({dbData: dbData, expectedVersion: expectedVersion,
      expectedPath: expectedPath, expectedAnswers: expectedAnswers,
      expectNext: true});
  });
});