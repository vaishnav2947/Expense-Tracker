# AI_NOTES.md

## AI Usage Notes

I used AI as a development assistant while building this project. It helped me speed up the initial implementation, but I made sure to review the generated code and understand how each part worked before considering the project complete.

## What AI helped with

AI assisted me with:

- Setting up the initial project structure.
- Generating the Express.js boilerplate.
- Creating the API endpoints and JSON file handling logic.
- Writing the initial Jest and Supertest test cases.
- Adding Swagger/OpenAPI documentation.
- Preparing the basic README.

## What I reviewed

After generating the project, I went through the code to understand the overall flow and verify that everything worked as expected.

I reviewed how requests move through the routes, controllers, services, and file storage layer. I also checked the validation logic to ensure invalid requests were handled properly and confirmed that the summary endpoint correctly calculates both the total expenses and category-wise totals.

Finally, I installed the dependencies, ran the project locally, executed the test suite, and tested the API endpoints to verify the application behaved as expected.

## Design Decisions

To keep the project aligned with the assignment requirements, I chose to keep the implementation simple.

- Used a local JSON file for data storage instead of a database.
- Kept the project structure straightforward with routes, controllers, services, and utility functions.
- Implemented only the required endpoints without adding unnecessary features.
- Made category filtering case-insensitive for a better user experience.

## AI Suggestions I Didn't Use

During development, AI suggested a few additional ideas that I decided not to include.

- An update (`PUT`) endpoint was suggested, but it wasn't part of the assignment requirements.
- Using a database and additional architectural layers was also suggested, but those would have added unnecessary complexity for a small project using JSON file storage.

## Reflection

AI helped reduce the time spent on repetitive setup and boilerplate code, allowing me to focus more on understanding the implementation and verifying the application's behavior.

Rather than accepting everything as-is, I reviewed the generated code, ensured it met the assignment requirements, and verified that the API and tests worked correctly before finalizing the project.
