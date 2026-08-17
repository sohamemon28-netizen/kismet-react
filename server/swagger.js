import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Kismet API",
            version: "1.0.0",
            description: "REST API for the Kismet e-commerce application"
        },

        servers: [
            {
                url: "http://localhost:5000"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;