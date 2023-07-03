import { Sequelize, Model, DataTypes } from "sequelize";

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
}

export const identifyContact = async function(email?: string, phone?: string){

  let promises = [];
  if(email){
    promises.push(
      Contact.findAll({
        where : {
          email
        }
       })
    )
  }
  if(phone){
    promises.push(
      Contact.findAll({
        where : {
          phoneNumber: phone
        }
       })
    )
  }

  const result = await Promise.all(promises);

  

}


export default Contact;
