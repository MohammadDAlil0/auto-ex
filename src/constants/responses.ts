export const GlobalResponse = (request: any, response: any, data?: any, statusCode?: number | undefined, message?: any) => (
    process.env.NODE_ENV === 'DEVELOPMENT' ? 
    developmentResponse(request, response, data, statusCode, message) : 
    productionResponse(response, statusCode, message)
);

export const developmentResponse = (request: any, response: any, data?: any, statusCode?: number | undefined, message?: any) => ({
    statusCode: statusCode || response.statusCode,
    messages: Array.isArray(message) ? message : [message || response.message],
    timestamp: Date.now(),
    path: request.url,
    data,
});

export const productionResponse = (response: any, statusCode?: number | undefined, message?: any) => ({
    statusCode: statusCode || response.statusCode,
    messages: Array.isArray(message) ? message : [message || response.message]
});
