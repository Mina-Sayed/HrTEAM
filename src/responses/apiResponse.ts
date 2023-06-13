class ApiResponse<T>
{
    constructor(public success: boolean, public message: string, public data?: T, public status: number = 200, public error?: Error)
    {
    }

    static success<T>(data?: T, message = "Success", status = 200)
    {
        return new ApiResponse<T>(true, message, data, status);
    }

    static error<T>(message: string, error?: Error, status = 500, data?: T | null)
    {
        return new ApiResponse<T>(false, message, data as T, status, error);
    }

}
