import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import { db } from "../../db/index.js";
import { FORBIDDEN_ERROR_CODE, NOT_FOUND_CODE } from "../error-codes.js";
import { saltRounds } from "../../config/saltRounds.js";
import { generateRandomPassword } from "../../utils/generate-random-password.js";
import { generateRandomUsername } from "../../utils/generate-random-username.js";

export const companyResolvers = {
  Company: {
    role: async (_, __, context) => {
      if (!context.user) return null;

      try {
        const userCompany = await db.userInCompany.findFirstOrThrow({
          where: { userId: context.user.id },
        });

        return userCompany.role;
      } catch (error) {
        return null;
      }
    },

    users: async (company, _, context) => {
      if (!context.isAdmin)
        throw new GraphQLError("You must be an admin!", {
          extensions: { code: FORBIDDEN_ERROR_CODE },
        });

      const users = await db.userInCompany.findMany({
        where: { companyId: company.id },
      });

      return users;
    },

    shifts: async (company, _, context) => {
      if (!context.isAdmin)
        throw new GraphQLError("You must be an admin!", {
          extensions: { code: FORBIDDEN_ERROR_CODE },
        });

      const shifts = await db.shift.findMany({
        where: { companyId: company.id },
      });

      return shifts;
    },
  },

  UserInCompany: {
    user: async (userInCompany) => {
      const user = await db.user.findUnique({
        where: { id: userInCompany.userId },
      });

      return user;
    },

    email: async (userInCompany, _, context) => {
      if (!context.isAdmin) return null;

      const user = await db.user.findUnique({
        where: { id: userInCompany.userId },
      });

      if (!user) return null;

      return user.email;
    },
  },

  PayrollEmployee: {
    hoursAndPayment: async (payrollEmployee, args) => {
      const { fromMonth, toMonth, fromYear, toYear, startDay, endDay } =
        args.filter;
      const { companyId } = args;

      const filteredShifts = await db.shift.findMany({
        where: {
          date: {
            gte: new Date(
              new Date(Date.UTC(fromYear, fromMonth, startDay ?? 1, 0, 0, 0))
            ),
            lte: new Date(
              new Date(Date.UTC(toYear, toMonth, endDay ?? 31, 0, 0, 0))
            ),
          },
          companyId: companyId,
          employeeId: payrollEmployee.employee.id,
        },
        include: { appointments: true },
      });

      let totalHours = 0;

      filteredShifts.map((shift) => {
        const checkInTime = shift.checkInTime.getUTCHours();
        const checkOutTime = shift.checkOutTime.getUTCHours();

        totalHours += checkOutTime - checkInTime;
      });

      return {
        hoursWorked: totalHours,
        grossPay: totalHours * payrollEmployee.employee.paymentPerHour,
        paymentPerHour: payrollEmployee.employee.paymentPerHour,
      };
    },
  },

  Query: {
    GetCompany: async (_, args, context) => {
      if (!context.isCompanyMember)
        throw new GraphQLError("You must be a member of the company!", {
          extensions: { code: FORBIDDEN_ERROR_CODE },
        });

      const company = await db.company.findUnique({
        where: { url: args.companyUrl },
      });

      if (!company)
        throw new GraphQLError("Company not found!", {
          extensions: { code: NOT_FOUND_CODE },
        });

      return company;
    },

    Company_GetPayroll: async (_, args, context) => {
      if (!context.isAdmin)
        throw new GraphQLError("You must be a member of the company!", {
          extensions: { code: FORBIDDEN_ERROR_CODE },
        });

      const employees = await db.userInCompany.findMany({
        where: {
          role: "Employee",
          companyId: args.companyId,
        },
      });

      return employees.map((employee) => {
        return {
          employee,
        };
      });
    },
  },

  Mutation: {
    Company_AddEmployee: async (_, args, context) => {
      if (!context.isAdmin)
        throw new GraphQLError("You must be an admin!", {
          extensions: { code: FORBIDDEN_ERROR_CODE },
        });

      const {
        firstName,
        lastName,
        birthDate,
        gender,
        startingDate,
        position,
        city,
        state,
        zip,
        address,
        email,
        telephone,
        paymentPerHour,
        userImageUrl,
        userImageId,
        employeeColor,
      } = args.employeeDto;

      const password = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const username = await generateRandomUsername(
        args.companyId,
        firstName,
        lastName
      );

      const user = await db.user.create({
        data: {
          firstName,
          lastName,
          email,
          username,
          password: hashedPassword,
          userImageId,
          userImageUrl,
        },
      });

      // TODO: Send email to new employee
      // email.send(email, password);

      // Add the user as employee to the company
      const employee = await db.userInCompany.create({
        data: {
          user: { connect: { id: user.id } },
          company: { connect: { id: args.companyId } },
          role: "Employee",
          birthDate,
          gender,
          startingDate,
          position,
          city,
          state,
          zip,
          address,
          telephone,
          paymentPerHour,
          employeeColor,
        },
      });

      return employee;
    },

    Company_AddClient: async (_, args, context) => {
      if (!context.isAdmin)
        throw new GraphQLError("You must be an admin!", {
          extensions: { code: FORBIDDEN_ERROR_CODE },
        });

      const {
        firstName,
        lastName,
        birthDate,
        gender,
        email,
        telephone,
        userImageUrl,
        userImageId,
      } = args.clientDto;

      const password = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const username = await generateRandomUsername(
        args.companyId,
        firstName,
        lastName
      );

      const user = await db.user.create({
        data: {
          firstName,
          lastName,
          email,
          username,
          password: hashedPassword,
          userImageId,
          userImageUrl,
        },
      });

      // TODO: Send email to new client
      // email.send(email, password);

      // Add the user as employee to the company
      const client = await db.userInCompany.create({
        data: {
          user: { connect: { id: user.id } },
          company: { connect: { id: args.companyId } },
          role: "Client",
          birthDate,
          gender,
          telephone,
        },
      });

      return client;
    },

    Company_DeleteEmployee: async (_, args, context) => {
      if (!context.isAdmin)
        throw new GraphQLError("You must be an admin!", {
          extensions: { code: FORBIDDEN_ERROR_CODE },
        });

      const { employeeId } = args;

      // const employee = await db.userInCompany.findUnique({
      //   where: { id: employeeId },
      // });
      // if (!employee)
      //   throw new GraphQLError("Employee not found.", {
      //     extensions: { code: NOT_FOUND_CODE },
      //   });

      const deletedEmployee = await db.userInCompany.delete({
        where: { id: employeeId },
      });

      return deletedEmployee;
    },

    Company_DeleteClient: async (_, args, context) => {
      if (!context.isAdmin)
        throw new GraphQLError("You must be an admin!", {
          extensions: { code: FORBIDDEN_ERROR_CODE },
        });

      const { clientId } = args;

      // const client = await db.userInCompany.findUnique({
      //   where: { id: clientId },
      // });
      // if (!client)
      //   throw new GraphQLError("Client not found.", {
      //     extensions: { code: NOT_FOUND_CODE },
      //   });

      const deletedClient = await db.userInCompany.delete({
        where: { id: clientId },
      });

      return deletedClient;
    },
  },
};