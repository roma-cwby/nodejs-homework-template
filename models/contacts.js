const fs = require('fs/promises');
const path = require('node:path');

const contactsPath = path.resolve('./models/contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async contactId => {
  const data = await listContacts();
  return data.find(item => Number(item.id) === Number(contactId));
};

const removeContact = async contactId => {
  let data = await listContacts();
  const contact = await getContactById(contactId);
  if (!contact) return 0;
  data = data.filter(item => Number(item.id) !== Number(contactId));

  await fs.writeFile(contactsPath, JSON.stringify(data));
  return 1;
};

const addContact = async body => {
  let data = await listContacts();

  let newId = 0;
  data.map(item => {
    if (Number(item.id) > newId) newId = Number(item.id);
  });

  body = {
    id: `${newId + 1}`,
    ...body,
  };

  data = [...data, body];

  await fs.writeFile(contactsPath, JSON.stringify(data));

  return body;
};

const updateContact = async (contactId, body) => {
  let data = await listContacts();
  const item = data.findIndex(i => Number(i.id) === Number(contactId));

  if (item === -1) return 0;

  const res = {
    id: data[item].id,
    ...body,
  };

  data[item] = res;
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return res;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
