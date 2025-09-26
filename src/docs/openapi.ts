import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Aiqfome API',
      version: '1.0.0',
      description: 'API em TypeScript com HMAC e token HMAC',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'HMAC',
        },
        hmacAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-hmac-signature',
          description: 'Use também x-hmac-timestamp',
        },
        hmacTimestamp: {
          type: 'apiKey',
          in: 'header',
          name: 'x-hmac-timestamp',
        },
      },
      schemas: {
        CreateUserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
          },
        },
        UserOutput: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        TokenOutput: {
          type: 'object',
          properties: { token: { type: 'string' } },
        },
        AddFavoriteInput: {
          type: 'object',
          required: ['productId'],
          properties: { productId: { type: 'integer', minimum: 1 } },
        },
        FavoritesOutput: {
          type: 'object',
          properties: {
            productIds: {
              type: 'array',
              items: { type: 'integer' },
            },
          },
        },
        ProductSummary: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
          },
        },
        ProductDetail: {
          allOf: [
            { $ref: '#/components/schemas/ProductSummary' },
            {
              type: 'object',
              properties: {
                description: { type: 'string' },
                image: { type: 'string' },
              },
            },
          ],
        },
      },
    },
    tags: [
      { name: 'Health' },
      { name: 'Users' },
      { name: 'Auth' },
      { name: 'Favorites' },
      { name: 'Products' },
    ],
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          responses: { 200: { description: 'OK' } },
        },
      },
      '/users': {
        post: {
          tags: ['Users'],
          summary: 'Create user',
          security: [{ hmacAuth: [] }, { hmacTimestamp: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateUserInput' },
              },
            },
          },
          responses: {
            201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserOutput' } } } },
            400: { description: 'Invalid payload' },
            409: { description: 'Email already in use' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          security: [{ hmacAuth: [] }, { hmacTimestamp: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginInput' },
              },
            },
          },
          responses: {
            200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenOutput' } } } },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/favorites': {
        post: {
          tags: ['Favorites'],
          summary: 'Add favorite',
          security: [{ hmacAuth: [] }, { hmacTimestamp: [] }, { bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AddFavoriteInput' },
              },
            },
          },
          responses: { 204: { description: 'No Content' } },
        },
        get: {
          tags: ['Favorites'],
          summary: 'List favorites',
          security: [{ hmacAuth: [] }, { hmacTimestamp: [] }, { bearerAuth: [] }],
          responses: {
            200: {
              description: 'OK',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/FavoritesOutput' } } },
            },
          },
        },
      },
      '/favorites/{productId}': {
        delete: {
          tags: ['Favorites'],
          summary: 'Remove favorite',
          security: [{ hmacAuth: [] }, { hmacTimestamp: [] }, { bearerAuth: [] }],
          parameters: [
            { name: 'productId', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } },
          ],
          responses: { 204: { description: 'No Content' } },
        },
      },
      '/products': {
        get: {
          tags: ['Products'],
          summary: 'List all products (FakeStore)',
          responses: {
            200: {
              description: 'OK',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/ProductSummary' } } } },
            },
          },
        },
      },
      '/products/{id}': {
        get: {
          tags: ['Products'],
          summary: 'Get product by ID (FakeStore)',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } },
          ],
          responses: {
            200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductDetail' } } } },
            404: { description: 'Not Found' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
