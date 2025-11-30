import { TErrorSources, TGenericErrorResponse } from "../interface/error.types"
import { Prisma } from "@prisma/client"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerValidationError = (
    err: Prisma.PrismaClientValidationError
): TGenericErrorResponse => {
    const str = err.message;

    const regex = /Argument `(.*?)`: (.*?)(?="?$)/s;
    const match = str.match(regex);

    if (!match) {
        return {
            statusCode: 400,
            message: "Validation Error",
            errorSources: [
                {
                    field: "unknown",
                    message: str,
                },
            ],
        };
    }

    const errorSources: TErrorSources[] = [
        {
            field: match[1],
            message: match[2],
        },
    ];

    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources,
    };
};
