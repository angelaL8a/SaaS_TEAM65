import { gql } from "graphql-request";

const FRAGMENT_USER = gql`
  fragment UserDetails on UserInCompany {
    id
    role
    employeeColor
    user {
      id
      name
      firstName
      lastName
      username
      userImageUrl
    }
  }
`;

export const GetCompany = gql`
  query GetCompany($companyUrl: String!) {
    GetCompany(companyUrl: $companyUrl) {
      id
      name
      url
      role
      createdAt
      users {
        ...UserDetails
        birthDate
        email
        telephone
        position
        gender
        address
        paymentPerHour
      }
      shifts {
        id
        checkInTime
        checkOutTime
        date
        employee {
          ...UserDetails
        }
        appointments {
          id
          title
          description
          referencialImageUrl
          referencialImageId
          fee
          status
          startTime
          endTime
          date
          client {
            ...UserDetails
          }
        }
      }
    }
  }

  ${FRAGMENT_USER}
`;

export const Company_GetPayroll = gql`
  query Company_GetPayroll($companyId: String!, $filter: PayrollFilterInput!) {
    Company_GetPayroll(companyId: $companyId) {
      employee {
        id
      }
      hoursAndPayment(filter: $filter) {
        grossPay
        hoursWorked
        paymentPerHour
      }
    }
  }
`;