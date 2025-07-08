import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mecamot E-commerce API",
      version: "1.0.0",
      description:
        "API REST pour la plateforme e-commerce Mecamot spécialisée en jardinage, motos et outils mécaniques",
      contact: {
        name: "Équipe Mecamot",
        email: "contact@mecamot.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
          description: "Authentification par session cookie",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            firstname: { type: "string" },
            lastname: { type: "string" },
            phone: { type: "string" },
            role: { type: "string", enum: ["USER", "ADMIN"] },
            isVerified: { type: "boolean" },
            isDeleted: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number", format: "decimal" },
            stock: { type: "integer" },
            sku: { type: "string" },
            slug: { type: "string" },
            brand: { type: "string" },
            isDeleted: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            category: { $ref: "#/components/schemas/Category" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string" },
            isDeleted: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            quantity: { type: "integer" },
            userId: { type: "string", format: "uuid" },
            productId: { type: "string", format: "uuid" },
            product: { $ref: "#/components/schemas/Product" },
          },
        },
        PaginationResponse: {
          type: "object",
          properties: {
            currentPage: { type: "integer" },
            totalPages: { type: "integer" },
            totalItems: { type: "integer" },
            hasNextPage: { type: "boolean" },
            hasPrevPage: { type: "boolean" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object" },
            pagination: { $ref: "#/components/schemas/PaginationResponse" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            error: { type: "string" },
          },
        },
      },
    },
    tags: [
      { name: "Authentication", description: "Gestion de l'authentification" },
      { name: "Users", description: "Gestion des utilisateurs" },
      { name: "Products", description: "Gestion des produits" },
      { name: "Categories", description: "Gestion des catégories" },
      { name: "Cart", description: "Gestion du panier" },
      { name: "Stats", description: "Statistiques et analytics" },
    ],
  },
  apis: ["./src/routes/**/*.ts", "./routes/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
