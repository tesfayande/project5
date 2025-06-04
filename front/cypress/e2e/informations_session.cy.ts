/// <reference types="cypress" />

import { getMonthName } from "../services/month";
import { toTitleCase } from "../services/toTitleCase";

describe("Information session spec", () => {
    it("Shows session informations", () => {
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

        const session = {
            id: 1,
            name: "session 1",
            description: "my description",
            date: "2012-01-01 01:00:00",
            teacher_id: 1,
            users: [],
            createdAt: "2023-09-08 18:45:03",
            updatedAt: "2023-09-12 23:23:22",
        }

        cy.intercept('GET', '/api/session/1', {body:session});

        const sessions = [
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

        const teacher = {
            id: 1,
            lastName: "DELAHAYE",
            firstName: "Margot",
            createdAt: "2023-08-29 18:57:01",
            updatedAt: "2023-08-29 18:57:01",
        }

        cy.intercept('GET', '/api/teacher/1', teacher);

        cy.get('input[formControlName=email]').type("yoga@studio.com");
        cy.get('input[formControlName=password]').type(`${"test!12345"}{enter}{enter}`);

        cy.get('.mat-raised-button').should("be.enabled");
        cy.url().should('include', '/sessions');
        
        // Show all sessions informations
        cy.contains("Rentals available").should("be.visible");
        sessions.forEach((session) => {
            cy.contains(session.name).should('be.visible');
            cy.contains(session.description).should('be.visible');
            const picture = cy.get('img.picture');
            picture.should('have.attr','src', 'assets/sessions.png');
            picture.should('have.attr','alt', 'Yoga session');
            const year = session.date.slice(0,10).split('-')[0];
            const month = getMonthName(parseInt(session.date.slice(0,10).split('-')[1]));
            const day = parseInt(session.date.slice(0,10).split('-')[2]);
            const date = `Session on ${month} ${day}, ${year}`;
            cy.contains(date).should('be.visible');
            cy.contains("Detail").should("be.visible");
        })        

        cy.contains('Detail').click();

        cy.url().should("include", "/sessions/detail/1");

        // Show session informations
        cy.contains(toTitleCase(session.name)).should("be.visible");
        cy.contains(`${teacher.firstName} ${teacher.lastName}`).should("be.visible");
        
        // Picture
        const picture = cy.get('img.picture');
        picture.should('have.attr','src', 'assets/sessions.png');
        picture.should('have.attr','alt', 'Yoga session');
        cy.contains(`${session.users.length} attendees`).should("be.visible");
        
        // Session date
        const year = session.date.slice(0,10).split('-')[0];
        const month = getMonthName(parseInt(session.date.slice(0,10).split('-')[1]));
        const day = parseInt(session.date.slice(0,10).split('-')[2]);
        cy.contains(`${month} ${day}, ${year}`).should("be.visible");
        
        // Session description
        cy.contains("Description:").should("be.visible");
        cy.contains(session.description).should("be.visible");
        
        // Session created at & updated at
        const createYear = session.createdAt.slice(0,10).split('-')[0];
        const createMonth = getMonthName(parseInt(session.createdAt.slice(0,10).split('-')[1]));
        const createDay = parseInt(session.createdAt.slice(0,10).split('-')[2]);
        const updateYear = session.updatedAt.slice(0,10).split('-')[0];
        const updateMonth = getMonthName(parseInt(session.updatedAt.slice(0,10).split('-')[1]));
        const updateDay = parseInt(session.updatedAt.slice(0,10).split('-')[2]);

        cy.contains(`${createMonth} ${createDay}, ${createYear}`).should("be.visible");
        cy.contains(`${updateMonth} ${updateDay}, ${updateYear}`).should("be.visible");
    })
    
    it("Shows delete button for admin user", () => {
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

        const session = {
            id: 1,
            name: "session 1",
            description: "my description",
            date: "2012-01-01 01:00:00",
            teacher_id: 1,
            users: [],
            createdAt: "2023-09-08 18:45:03",
            updatedAt: "2023-09-12 23:23:22",
        }

        cy.intercept('GET', '/api/session/1', {body:session});

        const sessions = [
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

        const teacher = {
            id: 1,
            lastName: "DELAHAYE",
            firstName: "Margot",
            createdAt: "2023-08-29 18:57:01",
            updatedAt: "2023-08-29 18:57:01",
        }

        cy.intercept('GET', '/api/teacher/1', teacher);

        cy.get('input[formControlName=email]').type("yoga@studio.com");
        cy.get('input[formControlName=password]').type(`${"test!12345"}{enter}{enter}`);

        cy.get('.mat-raised-button').should("be.enabled");
        cy.url().should('include', '/sessions');

        // Show all sessions informations
        cy.contains("Rentals available").should("be.visible");
        sessions.forEach((session) => {
            cy.contains(session.name).should('be.visible');
            cy.contains(session.description).should('be.visible');
            const picture = cy.get('img.picture');
            picture.should('have.attr','src', 'assets/sessions.png');
            picture.should('have.attr','alt', 'Yoga session');
            const year = session.date.slice(0,10).split('-')[0];
            const month = getMonthName(parseInt(session.date.slice(0,10).split('-')[1]));
            const day = parseInt(session.date.slice(0,10).split('-')[2]);
            const date = `Session on ${month} ${day}, ${year}`;
            cy.contains(date).should('be.visible');
            cy.contains("Detail").should("be.visible");
        })        

        cy.contains('Detail').click();

        cy.url().should("include", "/sessions/detail/1");

        // Verify if delete button appears for admin users
        const deleteButton = cy.get("button[mat-raised-button]");
        deleteButton.get("mat-icon").should("contain", "delete");
        deleteButton.get("span.ml1").should("contain", "Delete");
        deleteButton.contains("Delete").should("be.visible")
    })
})