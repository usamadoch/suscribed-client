/**
 * Generates a MongoDB-compatible ObjectId
 * This is useful for creating IDs on the client side before saving to the database.
 */
export function generateObjectId(): string {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const random = 'x'.repeat(16).replace(/[x]/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
    });
    return (timestamp + random).toLowerCase();
}
