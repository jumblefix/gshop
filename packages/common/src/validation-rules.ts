import * as yup from 'yup';

const userSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(3)
    .max(100),
  email: yup
    .string()
    .trim()
    .min(6)
    .max(255)
    .email(),
  password: yup
    .string()
    .min(6)
    .max(255),
});

const productSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .min(3)
    .max(255),
  coverImage: yup
    .string()
    .trim()
    .min(3)
    .max(255),
  description: yup
    .string()
    .trim()
    .min(140),
  rating: yup
    .number()
    .min(0)
    .max(10),
  offerPrice: yup
    .number()
    .min(1)
    .required(),
  price: yup
    .number()
    .min(1)
    .required(),
});

export default {
  userSchema,
  productSchema,
};
