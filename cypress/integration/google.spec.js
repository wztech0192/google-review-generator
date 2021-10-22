import faker from "faker";

Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
});
it("Create google account and write reviews!", () => {
    cy.server();

    cy.intercept("POST", "https://accounts.google.com/_/signup/accountdetails*").as(
        "postAccountDetail"
    );
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const userID = firstName + lastName + faker.datatype.number();
    const password = "firstNameLastName1920";

    cy.visit(
        "https://accounts.google.com/signup/v2/webcreateaccount?continue=https%3A%2F%2Fwww.google.com%2F&hl=en&biz=false&flowName=GlifWebSignIn&flowEntry=SignUp"
    );

    cy.get("input[name='firstName']").type(firstName);
    cy.get("input[name='lastName']").type(lastName);
    cy.get("input[name='Username']").type(userID);
    cy.get("input[name='Passwd']").type(password);
    cy.get("input[name='ConfirmPasswd']").type(password);
    cy.contains("button", "Next").click();
    cy.wait("@postAccountDetail");
    cy.get("[role='progressbar']").should("have.css", "opacity", "0");

    cy.get("#phoneNumberId").should("not.exist");
});
