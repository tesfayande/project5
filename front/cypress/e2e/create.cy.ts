/// <reference types="cypress" />

describe("Create spec", () => {
    it("Creates session", () => {
        // Login mock
        cy.visit('/login');

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: "yoga@studio.com",
                firstName: 'Admin',
                lastName: 'Admin',
                admin: true
            }
        });

        let sessions = [
            {
                id: 1,
                name: "session 1",
                description: "my description",
                date: "2012-01-01 01:00:00",
                teacher_id: 1,
                users: [],
                createdAt: "2023-09-08 18:45:03",
                updatedAt: "2023-09-12 23:23:22",
            },
            {
                id: 2,
                name: "Session",
                description: "description",
                date: "2023-09-12 02:00:00",
                teacher_id: 2,
                users: [],
                createdAt: "2023-09-12 23:13:47",
                updatedAt: "2023-09-12 23:13:47",
            }
        ]

        cy.intercept("GET", '/api/session', {
            body: sessions,
        });

        const teachers = [
            {
                id: 1,
                lastName: "DELAHAYE",
                firstName: "Margot",
                createdAt: "2023-08-29 18:57:01",
                updatedAt: "2023-08-29 18:57:01",
            },
            {
                id: 2,
                lastName: "THIERCELIN",
                firstName: "Hélène",
                createdAt: "2023-08-29 18:57:01",
                updatedAt: "2023-08-29 18:57:01",
            },
        ]

        cy.intercept('GET', '/api/teacher', teachers);

        cy.get('input[formControlName=email]').type("yoga@studio.com");
        cy.get('input[formControlName=password]').type(`${"test!12345"}{enter}{enter}`);

        cy.get('.mat-raised-button').should("be.enabled");
        cy.url().should('include', '/sessions');

        cy.contains('Create').click();

        cy.url().should('include', '/sessions/create');

        const selectedTeacher = teachers[0];
        const sessionForm = {
            id:sessions[sessions.length-1].id + 1,
            name:"Une session",
            date:"2023-09-15",
            teacher:`${selectedTeacher.firstName} ${selectedTeacher.lastName}`,
            description:"Une description",
        }

        cy.get("input[formControlName=name]").type(sessionForm.name);
        cy.get("input[formControlName=date]").type(sessionForm.date);
        // Select a teacher
        const teacher_input = cy.get("mat-select[formControlName=teacher_id]");
        teacher_input.click();
        teacher_input.get("mat-option");
        teacher_input.contains(sessionForm.teacher).click();

        cy.get("textarea[formControlName=description]").type(sessionForm.description);

        const session = {
            id:sessionForm.id,
            name:sessionForm.name,
            description: sessionForm.description,
            date: sessionForm.date,
            teacher_id:selectedTeacher.id,
            users: [],
            createdAt: new Date().toDateString(),
            updatedAt: new Date().toDateString(),
        }
        cy.intercept("POST", "/api/session", {
            body: session
        });
        
        const sessionsList = [...sessions, session]

        cy.intercept("GET", '/api/session', {
            body: sessionsList,
        });

        cy.get("button[type=submit]").click();

    });

    it("No creation, empty form fields, disabled submit button", () => {
        // Login mock
        cy.visit('/login');

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: "yoga@studio.com",
                firstName: 'Admin',
                lastName: 'Admin',
                admin: true
            }
        });

        let sessions = [
            {
                id: 1,
                name: "session 1",
                description: "my description",
                date: "2012-01-01 01:00:00",
                teacher_id: 1,
                users: [],
                createdAt: "2023-09-08 18:45:03",
                updatedAt: "2023-09-12 23:23:22",
            },
            {
                id: 2,
                name: "Session",
                description: "description",
                date: "2023-09-12 02:00:00",
                teacher_id: 2,
                users: [],
                createdAt: "2023-09-12 23:13:47",
                updatedAt: "2023-09-12 23:13:47",
            }
        ]

        cy.intercept("GET", '/api/session', {
            body: sessions,
        });

        const teachers = [
            {
                id: 1,
                lastName: "DELAHAYE",
                firstName: "Margot",
                createdAt: "2023-08-29 18:57:01",
                updatedAt: "2023-08-29 18:57:01",
            },
            {
                id: 2,
                lastName: "THIERCELIN",
                firstName: "Hélène",
                createdAt: "2023-08-29 18:57:01",
                updatedAt: "2023-08-29 18:57:01",
            },
        ];

        cy.intercept('GET', '/api/teacher', teachers);

        cy.get('input[formControlName=email]').type("yoga@studio.com");
        cy.get('input[formControlName=password]').type(`${"test!12345"}{enter}{enter}`);

        cy.get('.mat-raised-button').should("be.enabled");
        cy.url().should('include', '/sessions');

        cy.contains('Create').click();

        cy.url().should('include', '/sessions/create');

        const sessionForm = {
            name:"",
            date:"",
            teacher:"",
            description:"",
        }

        cy.get("input[formControlName=name]").should("have.value",sessionForm.name);
        cy.get("input[formControlName=date]").should("have.value",sessionForm.date);

        cy.get("textarea[formControlName=description]").should("have.value",sessionForm.description);
        cy.get("button[type=submit]").should("be.disabled")
    })
})