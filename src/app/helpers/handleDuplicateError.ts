import { TGenericErrorResponse } from "../interface/error.types"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
    const filed = err.meta.target

    return {
        statusCode: 400,
        message: `${filed[0]} already exists!!`
    }
}