/** MongoDB ObjectId: exactly 24 hex characters */
export const isValidObjectId = (id: string): boolean => /^[a-f\d]{24}$/i.test(id);
