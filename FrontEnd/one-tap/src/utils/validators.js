import * as Yup from 'yup';

export const loginFormSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const signupFormSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Password confirmation does not match')
    .required('Please confirm your password'),
});

export const profileFormSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    )
    .required('Username is required'),
  category: Yup.string().required('Category is required'),
  avatar: Yup.string().url('Please enter a valid URL').optional(),
});

export const socialLinkSchema = Yup.object({
  platform: Yup.string().required('Platform is required'),
  url: Yup.string().url('Please enter a valid URL').required('URL is required'),
  position: Yup.string()
    .oneOf(['top', 'bottom'], 'Position must be top or bottom')
    .required('Position is required'),
  active: Yup.boolean().default(true),
});

export const customLinkSchema = Yup.object({
  url: Yup.string().url('Please enter a valid URL').required('URL is required'),
  tagline: Yup.string()
    .max(100, 'Tagline must be less than 100 characters')
    .optional(),
  active: Yup.boolean().default(true),
});

export const bioSchema = Yup.object({
  description: Yup.string().max(35, 'Bio must be 35 words or less').optional(),
  active: Yup.boolean().default(true),
});
