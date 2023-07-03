import Contact, { LinkType } from "../db/models/contact";

const identifyContact = async (email?: string, phoneNumber?: string) => {
  try {
    const contacts = await Contact.identifyContact(email, phoneNumber);
    const contactList = await contactFound(contacts, email, phoneNumber);

    return contactList;
  } catch (error) {
    throw error;
  }
};

/**
 * Function that will return array of all contacts including new record created
 * @param contacts
 * @param email
 * @param phoneNumber
 * @returns Contact[]
 */

async function contactFound(
  contacts: Contact[],
  email?: string,
  phoneNumber?: string
) {
  let contactList: Contact[] = [];
  if (contacts.length === 1) {
    contactList = await foundOneRecord(contacts, email, phoneNumber);
  }

  if (contacts.length > 1) {
    contactList = await foundMultipleRecord(contacts, email, phoneNumber);
  }

  if (contacts.length === 0) {
    const contact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: LinkType.Primary,
    });
    contactList = [contact];
  }

  return transformContact(contactList);
}

/**
 * When there is only one existing account
 * @param contacts
 * @param email
 * @param phoneNumber
 * @returns Contact[]
 */
async function foundOneRecord(
  contacts: Contact[],
  email?: string,
  phoneNumber?: string
) {
  try {
    // if by chance there is problematic record, restore consistency
    let oldRecord = contacts[0];
    if (oldRecord.linkPrecedence === LinkType.Secondary) {
      oldRecord.linkPrecedence = LinkType.Primary;
      await oldRecord.save();
    }
    const newRecord = await Contact.create({
      email,
      phoneNumber,
      linkedIn: contacts[0].id,
      linkPrecedence: LinkType.Secondary,
    });
    return [oldRecord, newRecord];
  } catch (error) {
    throw error;
  }
}

/**
 * Function to return list of contacts when there are multiple user accounts
 * @param contacts
 * @param email
 * @param phoneNumber
 * @returns Contact[]
 */
async function foundMultipleRecord(
  contacts: Contact[],
  email?: string,
  phoneNumber?: string
): Promise<Contact[]> {
  try {
    let primaryRec = contacts[0];

    let promises: Promise<Contact>[] = [];

    contacts.forEach(async (contact, index) => {
      if (index === 0 && contact.linkPrecedence === LinkType.Secondary) {
        contact.linkPrecedence = LinkType.Primary;
        promises.push(contact.save());
      }
      if (
        index > 0 &&
        (contact.linkPrecedence !== LinkType.Secondary ||
          !contact.linkedIn ||
          contact.linkedIn !== primaryRec.id)
      ) {
        contact.linkPrecedence = LinkType.Secondary;
        contact.linkedIn = primaryRec.id;
        promises.push(contact.save());
      }
    });

    await Promise.all(promises);

    const newRecord = await Contact.create({
      email,
      phoneNumber,
      linkedIn: primaryRec.id,
      linkPrecedence: LinkType.Secondary,
    });

    return [...contacts, newRecord];
  } catch (error) {
    throw error;
  }
}

function transformContact(contacts: Contact[]) {
  const emails: string[] = [];
  const phoneNumbers: string[] = [];
  const secondaryContactIds: number[] = [];
  const primaryContatctId = contacts[0].id;

  contacts.forEach((contact, index) => {
    if (contact.email && !emails.includes(contact.email))
      emails.push(contact.email);
    if (contact.phoneNumber && !phoneNumbers.includes(contact.phoneNumber))
      phoneNumbers.push(contact.phoneNumber);
    if (index > 0) secondaryContactIds.push(contact.id);
  });

  return {
    contact: {
      primaryContatctId,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  };
}

export default {
  identifyContact,
};
