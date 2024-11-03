export function removeElementAt(array: Array<unknown>, element: unknown): void {
    const indexToRemove = array.indexOf(element);
    if (indexToRemove === -1)
        return;

    array.splice(indexToRemove, 1);
}