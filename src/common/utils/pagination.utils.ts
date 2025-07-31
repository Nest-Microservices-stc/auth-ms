export function getPagination({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
  const take = limit;
  const skip = (page - 1) * limit;
  return { skip, take };
}
