const { google } = require('googleapis');

const getAuthClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return oauth2Client;
};

const buildFormItems = (questions) => {
  return questions.map((q, index) => {
    const base = { title: `Q${index + 1}: ${q.questionText}`, questionItem: {} };
    if (q.questionType === 'multiple_choice') {
      base.questionItem = {
        question: {
          required: true,
          choiceQuestion: { type: 'RADIO', options: q.options.map(o => ({ value: o })), shuffle: false }
        }
      };
    } else if (q.questionType === 'true_false') {
      base.questionItem = {
        question: {
          required: true,
          choiceQuestion: { type: 'RADIO', options: [{ value: 'True' }, { value: 'False' }], shuffle: false }
        }
      };
    } else {
      base.questionItem = { question: { required: true, textQuestion: { paragraph: false } } };
    }
    return base;
  });
};

const createGoogleForm = async (quiz) => {
  const auth = getAuthClient();
  const forms = google.forms({ version: 'v1', auth });

  const createRes = await forms.forms.create({
    requestBody: { info: { title: quiz.title, documentTitle: quiz.title } }
  });

  const formId = createRes.data.formId;
  const formUrl = createRes.data.responderUri;

  const requests = [
    {
      updateFormInfo: {
        info: { description: `Pass mark: ${quiz.passMark}% | Time: ${quiz.timeLimitMinutes || 'No'} mins limit` },
        updateMask: 'description'
      }
    },
    ...buildFormItems(quiz.questions).map((item, i) => ({
      createItem: { item, location: { index: i } }
    }))
  ];

  await forms.forms.batchUpdate({ formId, requestBody: { requests } });
  return { formId, formUrl };
};

const getFormResponses = async (formId) => {
  const auth = getAuthClient();
  const forms = google.forms({ version: 'v1', auth });
  const res = await forms.forms.responses.list({ formId });
  return res.data.responses || [];
};

const getFormMetadata = async (formId) => {
  const auth = getAuthClient();
  const forms = google.forms({ version: 'v1', auth });
  const res = await forms.forms.get({ formId });
  return res.data;
};

module.exports = { createGoogleForm, getFormResponses, getFormMetadata };