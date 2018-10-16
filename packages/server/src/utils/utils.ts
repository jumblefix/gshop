import slugify from 'slugify';

export const makeSlug = (str: string) => slugify(str, { lower: true });
