import { z, ZodObject } from "zod";

export const zodValidator = <S extends ZodObject>(payload: unknown, schema: S) => {
    const validatedPayload = schema.safeParse(payload);

    if (!validatedPayload.success) {
        return {
            success: false as const,
            errors: validatedPayload.error.issues.map((issue) => ({
                field: String(issue.path[0] ?? ""),
                message: issue.message,
            })),
        };
    }

    return {
        success: true as const,
        data: validatedPayload.data as z.output<S>,
    };
};
