import { PrismaClient } from "@prisma/client";
import { RequestHandler, Request, Response } from "express";
import bcrypt from "bcrypt";
// import { createToken, verifyToken } from "../utils/jwt";
import verifyEmailTemplate from "../emails/verifyEmail";
// import sendMail from "../utils/sendMail";
import { cloudinaryUploadImage } from "../utils/uploadImage";
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

const AddStaff: RequestHandler = async (req, res) => {
  let { firstName, lastName, companyEmail, companyPassword, newStaffEmail, role } = req.body;
  companyEmail = companyEmail?.toLowerCase();
  newStaffEmail = newStaffEmail?.toLowerCase();

  try {
    if (!(firstName && lastName && companyEmail && companyPassword && newStaffEmail && role)) {
      throw Error("All credentials must be included");
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { email: companyEmail },
    });
    if (!company) {
      throw Error("Company does not exist");
    }

    // Verify the company password
    const isPasswordValid = await bcrypt.compare(companyPassword, company.password);
    if (!isPasswordValid) {
      throw Error("Invalid password");
    }

    // Check if the person adding the staff is a manager
    const manager = await prisma.staff.findFirst({
      where: {
        email: companyEmail,
        companyId: company.id,
        role: "manager",
      },
    });
    if (!manager) {
      throw Error("Only a manager can add new staff");
    }

    // Add the new staff to the company
    const hashedPassword = await bcrypt.hash(companyPassword, 10); // Assuming new staff will use the same password
    const staff = await prisma.staff.create({
      data: {
        firstName,
        lastName,
        email: newStaffEmail,
        company: {
          connect: {
            id: company.id,
          },
        },
        password: hashedPassword,
        role,
      },
    });

    res.status(200).json(staff);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const LogIn: RequestHandler = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  try {
    if (!(email && password)) {
      throw Error("All credentials must be included");
    }

    const staff = await prisma.staff.findUnique({ where: { email } });
    console.log(staff);


    if (!staff) {
      console.log(staff);

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

// Test login function
// const testLogin: RequestHandler = async (req, res) => {
//   interface CustomSessionData {
//     userId?: string;
//   }
//   let { email, password } = req.body;
//   email = email.toLowerCase();
//   console.log(email, password);
//   try {
//     if (!(email && password)) {
//       throw Error("All credentials must be included");
//     }

//     const user = await prisma.users.findUnique({ where: { email } });

//     if (!user) {
//       return res.status(401).json("No user found")

//     }

//     const correctPassword = await bcrypt.compare(password, user.password);
//     console.log(correctPassword);

//     if (!correctPassword) {
//       return res.status(401).json("Wrong password")
//     }

//     // initialize session
//     (req.session as CustomSessionData).userId = user.id;
//     console.log(user)

//     res.status(200).json(user);
//   } catch (error: any) {
//     console.log(error);
//     res.status(400).json(error.message);
//   }

// }

// Test sign up
// const testSignUp: RequestHandler = async (req, res) => {
//   let { name, email, password } = req.body;
//   email = email?.toLowerCase();

//   try {
//     if (!(name && email && password)) {
//       throw Error("All credentials must be included");
//     }

//     // check existing user
//     const existingUser = await prisma.users.findUnique({
//       where: { email },
//     });
//     if (existingUser) {
//       throw Error("User already exists, login instead");
//     }

//     // check password strength
//     if (password.length < 6) {
//       throw Error("Password must be at least 6 characters long");
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // create the user and save in the db
//     const user = await prisma.users.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//     });
//     res.status(200).json(user);
//   } catch (error: any) {
//     console.log(error);
//     res.status(400).json(error.message);
//   }
// };

// Test image upload
const uploadImageToCloudinary: RequestHandler = async (req: Request, res: Response) => {
  console.log('route hit');

  const image = req.body.blob;
  const id = Math.random() + '10'
  // console.log(image);

  // const imageBuffer: any = Buffer.from(req.body._data.blobId, 'base64');
  // console.log(imageBuffer);



  try {
    // if (!userId) {
    //   // res.status(500).json("user not authenticated");
    //   throw Error("user not authenticated");
    // }
    if (image) {
      const res = await cloudinaryUploadImage(image, id);
      if (res?.secure_url) {
        console.log(res.secure_url);

      } else {
        throw Error("Image upload failed");
      }
    } else {
      console.log('no image object passed');

    }

    res.status(201).json("information upgraded successfully");
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }


};


const testImage: RequestHandler = async (req, res) => {

}

export {
  SignUp,
  uploadImageToCloudinary,
  LogIn,
  VerifyEmail,
  UpdateCompanyProfile,
  SendPasswordLink,
  ChangePassword,
  AutoLogin,
  LogOut,
  getAllCompanies,
  getCompany,
  AddStaff
  // testLogin,
  // testSignUp,
};
