export interface TErrorSources {
    field: string;
    message: string
}

export interface TGenericErrorResponse {
    statusCode: number,
    message: string,
    errorSources?: TErrorSources[]

}