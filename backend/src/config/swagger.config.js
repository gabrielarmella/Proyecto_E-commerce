import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API REST Proyecto",
    version: "1.0.0",
    description: "Documentación de la API REST para futuros proyectos de e-commerce",
  },
    servers: [
    {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo local",
    },
    ],
    components: {
    securitySchemes: {
        bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        },
    },
    },
};

const options = {
  swaggerDefinition,
  //Archivos que usa @swagger para generar la documentacion
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;