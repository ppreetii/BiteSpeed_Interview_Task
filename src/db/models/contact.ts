import { Sequelize, Model, DataTypes, Op } from "sequelize";

export enum LinkType {
  Primary = "primary",
  Secondary = "secondary",
}

interface ContactAttrs {
  id: number;
  phoneNumber?: string;
  email?: string;
  linkedIn?: number;
  linkPrecedence: LinkType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface identifyContactFilter {
  email?: string;
  phoneNumber?: string;
}

class Contact extends Model implements ContactAttrs {
  public id!: number;
  public phoneNumber!: string;
  public email!: string;
  public linkedIn!: number;
  public linkPrecedence!: LinkType;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;

  static initModel(sequelize: Sequelize): void {
    Contact.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.STRING,
        },
        email: {
          type: DataTypes.STRING,
        },
        linkedIn: {
          type: DataTypes.INTEGER,
        },
        linkPrecedence: {
          type: DataTypes.ENUM(...Object.values(LinkType)),
        },
        deletedAt: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        modelName: "contacts",
        timestamps: true,
      }
    );
  }

  static associateModel(): void {
    // add associations if any
  }

  static async identifyContact(email?: string, phoneNumber?: string): Promise<Contact[]> {
    const filterOptions : identifyContactFilter = {};
    if(email)filterOptions.email = email;
    if(phoneNumber)filterOptions.phoneNumber = phoneNumber;

    const contacts = await Contact.findAll({
      where: {
        [Op.or]:{
          ...filterOptions
        }
      },
      order: ["createdAt"]
    });

    return contacts;
  }
}

export default Contact;
