export const db = {
  users: [
    {
      id: '1',
      username: 'john_doe',
      password: '$2a$10$XQq1Z5YsLzF5.LQrY1PTWe1hJ8Qi9FW7yVTwYT3vYxJvMYhS5v6Sm', // hashed 'password123'
      homeAddress: '123 Main St'
    }
  ],
  stores: [
    {
      id: '1',
      name: 'Super Market',
      description: 'Your one-stop shop for groceries',
      city: 'New York',
      tagline: 'Fresh food, great prices',
      image: 'store1.jpg'
    }
  ],
  gyms: [
    {
      id: '1',
      name: 'Power Fitness',
      description: 'Premium fitness center',
      city: 'Los Angeles',
      tagline: 'Transform your body',
      image: 'gym1.jpg'
    }
  ],
  petshops: [
    {
      id: '1',
      name: 'Happy Pets',
      description: 'Everything for your furry friends',
      city: 'Chicago',
      tagline: 'We love pets',
      image: 'petshop1.jpg'
    }
  ]
};