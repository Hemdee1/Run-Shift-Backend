import { PrismaClient } from "@prisma/client";
import { RequestHandler, Request, Response } from "express";
import bcrypt from "bcrypt";
// import { createToken, verifyToken } from "../utils/jwt";
import verifyEmailTemplate from "../emails/verifyEmail";
// import sendMail from "../utils/sendMail";
import { cloudinaryDeleteImage, cloudinaryUploadImage } from "../utils/uploadImage";
import resetPasswordEmailTemplate from "../emails/resetPasswordEmail";

const url =
  process.env.NODE_ENV === "production" ? "https://" : "http://localhost:3000";
const prisma = new PrismaClient();

const SignUp: RequestHandler = async (req, res) => {
  let { managersFirstName, managersLastName, email, companyName, password } = req.body;
  email = email?.toLowerCase();

  try {
    if (!(managersFirstName && managersLastName && email && password && companyName)) {
      throw Error("All credentials must be included");
    }

    // check existing company
    const existingCompany = await prisma.company.findUnique({
      where: { email },
    });
    if (existingCompany) {
      throw Error("Company already exists, login instead");
    }

    // check password strength
    if (password.length < 8) {
      throw Error("Password must be at least 8 characters long");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create the company and save in the db
    const company = await prisma.company.create({
      data: {
        managersFirstName,
        managersLastName,
        email,
        companyName,
        password: hashedPassword,
      },
    });

    const manager = await prisma.staff.create({
      data: {
        firstName: managersFirstName,
        lastName: managersLastName,
        email,
        company: {
          connect: {
            id: company.id,
          },
        },
        password: hashedPassword,
        role: "manager",
      }
    })

    // send a link to verify email
    // const token = createToken(company.id);
    const token = 'createToken(company.id);'
    const link = `${url}/verify-email?token=${token}`;

    const data = {
      email: company.email,
      subject: "Verify your account",
      html: verifyEmailTemplate({ firstName: company.companyName, link }),
    };

    // await sendMail(data);

    res.status(200).json(company);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};



const LogIn: RequestHandler = async (req, res) => {
  console.log('request hit');
  
  let { email, password } = req.body;
  email = email.toLowerCase();

  try {
    if (!(email && password)) {
      throw Error("All credentials must be included");
    }

    const staff = await prisma.staff.findUnique({ where: { email } });


    if (!staff) {

      throw Error("Incorrect credentials");
    }

    const correctPassword = await bcrypt.compare(password, staff.password);

    if (!correctPassword) {
      throw Error("Incorrect credentials");
    }

    // Check role, if manager send verification email again
    // if (!company.verified) {
    //   // send a link to verify email
    //   const token = 'createToken(company.id);'
    //   const link = `${url}/verify-email?token=${token}`;

    //   const data = {
    //     email: company.email,
    //     subject: "Verify your account",
    //     html: verifyEmailTemplate({ firstName: company.companyName, link }),
    //   };

    //   // await sendMail(data);

    //   throw Error("Email is not verified!");
    // }

    // initialize session
    // req.session.id = staff.id;

    res.status(200).json(staff);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const VerifyEmail: RequestHandler = async (req, res) => {
  const token = req.params.token;

  try {
    const id = 'verifyToken(token);'

    if (!id) {
      throw Error(
        "The link has expired or invalid, please generate another link"
      );
    }

    await prisma.company.update({ data: { verified: true }, where: { id } });

    res.status(200).json("email verified successfully");
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const UpdateCompanyProfile: RequestHandler = async (req, res) => {
  const id = req.session.id;
  const body = req.body;
  const profilePicture = body?.profilePicture;

  // try {
  //   if (profilePicture) {
  //     const res = await cloudinaryUploadImage(body.profilePicture, id);
  //     if (res?.secure_url) {
  //       await prisma.company.update({
  //         data: { profilePicture: res.secure_url },
  //         where: { id },
  //       });
  //     } else {
  //       throw Error("could not upload avatar");
  //     }
  //   } else {
  //   }

  //   await prisma.company.update({ data: { ...body }, where: { id } });

  //   res.status(201).json("information updated successfully");
  // } catch (error: any) {
  //   console.log(error);
  //   res.status(400).json(error.message);
  // }
};

const SendPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw Error("Email is required");
    }

    const company = await prisma.company.findUnique({ where: { email } });

    if (!company) {
      throw Error("Company not found!");
    }

    const token = 'createToken(company.id);'
    const link = `${url}/reset-password?token=${token}`;

    const data = {
      email: company.email,
      subject: "Reset Your Password",
      html: resetPasswordEmailTemplate({
        firstName: company.companyName,
        link,
      }),
    };

    // await sendMail(data);

    // res.status(200).json(token);
    res.status(200).json("link sent successfully");
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const ChangePassword: RequestHandler = async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;

  try {
    if (!password) {
      throw Error("Password is required!");
    }

    // check password strength
    if (password.length < 8) {
      throw Error("Password must be at least 8 characters long");
    }

    const id = ' verifyToken(token)';

    if (!id) {
      throw Error(
        "The link is expired or invalid, please generate another link"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.company.update({
      data: { password: hashedPassword },
      where: { id },
    });

    res.status(201).json("password changed successfully");
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const AutoLogin: RequestHandler = async (req, res) => {
  const companyId = req.session.id;

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw Error("Company not found");
    }

    res.status(200).json(company);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const LogOut: RequestHandler = async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
};

// #####
// #####
// #####
// #####

const getCompany: RequestHandler = async (req, res) => {
  const id = req.params.id;

  try {
    const company = await prisma.company.findUnique({ where: { id } });

    res.status(200).json(company);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getAllCompanies: RequestHandler = async (req, res) => {
  try {
    const companys = await prisma.company.findMany();

    res.status(200).json(companys);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};


const SaveCloudinaryUrl: RequestHandler = async (req: Request, res: Response) => {
  console.log('route hit');
  let { url, created_at, bytes, companyId, publicId, company } = req.body;

  console.log(companyId);
  

  try {
    if (!(url && created_at && bytes && companyId && publicId)) {
      throw Error("All credentials must be included");
    }

    // check existing company
    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!existingCompany) {
      throw Error("Company doesn't exists");
    }

    // create the url and save in the db
    const imageUrl = await prisma.imageUrl.create({
      data: {
        url, created_at, bytes, publicId,  company: {
                    connect: {
                        id: companyId,
                    },
                },
      },
    });

    res.status(200).json(imageUrl);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
}

const deleteImage: RequestHandler = async (req: Request, res: Response) => {
  console.log('delete image route hit');
  const { publicId } = req.body;

  try {
    // Check if the image exists in the Prisma database
    const existingImage = await prisma.imageUrl.findUnique({
      where: { publicId },
    });

    if (!existingImage) {
      return res.status(404).json({ message: 'Image not found in the database' });
    }

    // Delete the image from Cloudinary
    const result = await cloudinaryDeleteImage(publicId);

    // Delete the image from the Prisma database
    await prisma.imageUrl.delete({
      where: { publicId },
    });

    res.status(200).json({ message: 'Image deleted successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete image', error });
  }
}


const getCloudinaryUrl: RequestHandler = async (req: Request, res: Response) => {
  console.log('Route hit');
  const { id } = req.params;

  console.log(req.params);
  

  try {
    if (!id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if the company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    console.log(existingCompany);
    

    if (!existingCompany) {
      return res.status(404).json({ error: "Company doesn't exist" });
    }

    // Fetch all images associated with the company email
    const images = await prisma.imageUrl.findMany({
      where: {companyId:id },
    });

    res.status(200).json(images);
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



export {
  SignUp,
  SaveCloudinaryUrl,
  getCloudinaryUrl,
  LogIn,
  VerifyEmail,
  UpdateCompanyProfile,
  SendPasswordLink,
  ChangePassword,
  AutoLogin,
  LogOut,
  getAllCompanies,
  getCompany,
deleteImage,

};
