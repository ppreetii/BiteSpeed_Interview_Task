import request from "supertest";

import { app } from "../../app";
import Contact from "../../db/models/contact";
import { API } from "../../constants/api";
import { LinkType } from "../../db/models/contact";

const url = `${API.BASE_URL}${API.CONTACT}${API.IDENTIFY}`;

interface ContactCreationAttrs {
  phoneNumber?: string;
  email?: string;
  linkedIn?: number;
  linkPrecedence: LinkType;
}

const createContact = async (
  data: ContactCreationAttrs,
  days: number
): Promise<Contact> => {
  const today = new Date();
  const contact = await Contact.create({
    phoneNumber: data?.phoneNumber,
    email: data?.email,
    linkedIn: data?.linkedIn,
    linkPrecedence: data.linkPrecedence,
    createdAt: new Date(today.setDate(today.getDate() + days)),
    updatedAt: new Date(today.setDate(today.getDate() + days)),
  });
  return contact;
};

it("Return 400 for invalid email", async () => {
  await request(app)
    .post(url)
    .send({
      email: "abc",
    })
    .expect(400);
});
it("Return 404 for invalid phoneNumber", async () => {
  await request(app)
    .post(url)
    .send({
      phoneNumber: 123,
    })
    .expect(400);
});
it("Return 404 for empty request body", async () => {
  await request(app).post(url).send({}).expect(400);
});

it("create primary record if no existing record", async () => {
  const email= "test@test.com";
  const phoneNumber ="123456";
  const response = await request(app)
    .post(url)
    .send({
      email,
      phoneNumber
    })
    .expect(200);
    expect(response.body.contact.primaryContatctId).toBe(1);
    expect(response.body.contact.emails).toHaveLength(1);
    expect(response.body.contact.emails[0]).toEqual(email);
    expect(response.body.contact.phoneNumbers).toHaveLength(1);
    expect(response.body.contact.phoneNumbers[0]).toEqual(phoneNumber);
    expect(response.body.contact.secondaryContactIds).toHaveLength(0);
});
it("create secondary record if one existing record exists", async () => {
  const email = "test@test.com";
  const phoneNumber = "123456";
  //create a record 
  await createContact({
    phoneNumber,
    email,
    linkPrecedence: LinkType.Primary,
  }, 0);

  const response = await request(app)
    .post(url)
    .send({
      email,
      phoneNumber,
    })
    .expect(200);

  expect(response.body.contact.primaryContatctId).toBe(1);
  expect(response.body.contact.emails).toHaveLength(1);
  expect(response.body.contact.emails[0]).toEqual(email);
  expect(response.body.contact.phoneNumbers).toHaveLength(1);
  expect(response.body.contact.phoneNumbers[0]).toEqual(phoneNumber);
  expect(response.body.contact.secondaryContactIds[0]).toBe(2);

});

it("Updates linkedPrecendence to Primary for problematic records where oldest record is secondary", async () => {
  const email = "test@test.com";
  const phoneNumber = "123456";
  //create a record
  await createContact(
    {
      phoneNumber,
      email,
      linkPrecedence: LinkType.Secondary,
    },
    0
  );

  const response = await request(app)
    .post(url)
    .send({
      email,
      phoneNumber,
    })
    .expect(200);
  expect(response.body.contact.primaryContatctId).toBe(1);
  expect(response.body.contact.emails).toHaveLength(1);
  expect(response.body.contact.emails[0]).toEqual(email);
  expect(response.body.contact.phoneNumbers).toHaveLength(1);
  expect(response.body.contact.phoneNumbers[0]).toEqual(phoneNumber);
  expect(response.body.contact.secondaryContactIds).toHaveLength(1);
  expect(response.body.contact.secondaryContactIds[0]).toEqual(2);
});

it("Creates new secondary for multiple existing record for same email", async () => {
  const email = "test@test.com";
  const phoneNumber = "123456";
  //create a record
  await createContact(
    {
      phoneNumber,
      email,
      linkPrecedence: LinkType.Primary,
    },
    0
  );
  await createContact(
    {
      email,
      linkPrecedence: LinkType.Secondary,
    },
    1
  );

  const response = await request(app)
    .post(url)
    .send({
      email
    })
    .expect(200);
  expect(response.body.contact.primaryContatctId).toBe(1);
  expect(response.body.contact.emails).toHaveLength(1);
  expect(response.body.contact.emails[0]).toEqual(email);
  expect(response.body.contact.phoneNumbers).toHaveLength(1);
  expect(response.body.contact.phoneNumbers[0]).toEqual(phoneNumber);
  expect(response.body.contact.secondaryContactIds).toHaveLength(2);
  expect(response.body.contact.secondaryContactIds[0]).toEqual(2);
  expect(response.body.contact.secondaryContactIds[1]).toEqual(3);
});
it("Creates new secondary for multiple existing record for same phone", async () => {
  const email = "test@test.com";
  const phoneNumber = "123456";
  //create a record
  await createContact(
    {
      phoneNumber,
      email,
      linkPrecedence: LinkType.Primary,
    },
    0
  );
  await createContact(
    {
      phoneNumber,
      linkPrecedence: LinkType.Secondary,
    },
    1
  );

  const response = await request(app)
    .post(url)
    .send({
      phoneNumber,
    })
    .expect(200);
  expect(response.body.contact.primaryContatctId).toBe(1);
  expect(response.body.contact.emails).toHaveLength(1);
  expect(response.body.contact.emails[0]).toEqual(email);
  expect(response.body.contact.phoneNumbers).toHaveLength(1);
  expect(response.body.contact.phoneNumbers[0]).toEqual(phoneNumber);
  expect(response.body.contact.secondaryContactIds).toHaveLength(2);
  expect(response.body.contact.secondaryContactIds[0]).toEqual(2);
  expect(response.body.contact.secondaryContactIds[1]).toEqual(3);
});

it("updates a primary record to secondary if email and phone refers to two different primary records", async () => {
  const email1 = "test1@test.com";
  const email2 = "test2@test.com";
  const phoneNumber1 = "123456";
  const phoneNumber2 = "654321";

  const primary = await createContact(
    {
      email: email1,
      phoneNumber: phoneNumber1,
      linkPrecedence: LinkType.Primary,
    },
    1
  );
  const primaryToSec = await createContact(
    {
      email: email2,
      phoneNumber: phoneNumber2,
      linkPrecedence: LinkType.Primary,
    },
    3
  );

  let response = await request(app)
    .post(url)
    .send({
      email: email1,
      phoneNumber: phoneNumber2,
    })
    .expect(200);
  expect(response.body.contact.primaryContatctId).toBe(primary.id);
  expect(response.body.contact.emails).toHaveLength(2);
  expect(response.body.contact.emails[0]).toEqual(email1);
  expect(response.body.contact.phoneNumbers).toHaveLength(2);
  expect(response.body.contact.phoneNumbers[0]).toEqual(primary.phoneNumber);
  expect(response.body.contact.secondaryContactIds).toHaveLength(2);
  expect(response.body.contact.secondaryContactIds[0]).toEqual(2);
  expect(response.body.contact.secondaryContactIds[1]).toEqual(3);

  //find linkedPrecendence of primaryToSec
   const result = await Contact.findByPk(primaryToSec.id);
   expect(result?.linkPrecedence).toEqual(LinkType.Secondary);

});
it("updates linkedIn to primary if secondary records referring to each other instead of primary record", async () => {
  const email = "test1@test.com";
  const phoneNumber = "123456";

  const primary = await createContact(
    {
      email: email,
      phoneNumber: phoneNumber,
      linkPrecedence: LinkType.Primary,
    },
    1
  );
  const sec1 = await createContact(
    {
      email: email,
      linkPrecedence: LinkType.Secondary,
      linkedIn: primary.id
    },
    2
  );
  const sec2 = await createContact(
    {
      email: email,
      linkPrecedence: LinkType.Secondary,
      linkedIn: sec1.id
    },
    3
  );
  const sec3 = await createContact(
    {
      email: email,
      linkPrecedence: LinkType.Secondary,
      linkedIn: sec2.id,
    },
    4
  );

  let response = await request(app)
    .post(url)
    .send({
      email: email,
      phoneNumber: phoneNumber + "654321",
    })
    .expect(200);
  expect(response.body.contact.primaryContatctId).toBe(primary.id);
  expect(response.body.contact.emails).toHaveLength(1);
  expect(response.body.contact.emails[0]).toEqual(primary.email);
  expect(response.body.contact.phoneNumbers).toHaveLength(2);
  expect(response.body.contact.phoneNumbers[0]).toEqual(primary.phoneNumber);
  expect(response.body.contact.secondaryContactIds).toHaveLength(4);
  expect(response.body.contact.secondaryContactIds[0]).toEqual(sec1.id);
  expect(response.body.contact.secondaryContactIds[1]).toEqual(sec2.id);
  expect(response.body.contact.secondaryContactIds[2]).toEqual(sec3.id);

  //find linkedIn of sec2 and sec3
  let result = await Contact.findByPk(sec2.id);
  expect(result?.linkedIn).toEqual(primary.id);
  result = await Contact.findByPk(sec3.id);
  expect(result?.linkedIn).toEqual(primary.id);
});
