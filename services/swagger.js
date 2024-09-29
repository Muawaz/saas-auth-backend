// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
require("dotenv").config();

const port = process.env.PORT;

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API Information',
        },
        servers: [
            {
                url: `http://localhost:${port}`, // Your local server URL
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to your API routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
