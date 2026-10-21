import { getInputFieldError, type IInputErrorState } from "@/lib/getInputFieldError";

export default function InputFieldError({
    field,
    state,
}: {
    field: string;
    state: IInputErrorState;
}) {
    const message = getInputFieldError(field, state);
    if (!message) return null;

    return (
        <p className="text-sm text-destructive" role="alert">
            {message}
        </p>
    );
}
